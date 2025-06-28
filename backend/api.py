import shutil
import uuid
from itertools import count
from pathlib import Path

from fastapi import APIRouter, Request
from fastapi.responses import FileResponse

from .datamodel import ImageListRequest, ImItem, ImageListResponse, ChangeImageClassRequest, ChangeImageClassResponse, CleanAllTags, image_extensions
from .utils import getfiles

router = APIRouter()
global_projects = {}


@router.get("/loadImage")
async def load_image(im_path):
    im_path = Path(im_path)
    if not im_path.exists():
        pass
    else:
        return FileResponse(
            im_path,
            media_type="image/jpeg",
            filename=im_path.name
        )


@router.post("/getImageList", response_model=ImageListResponse)
async def get_ims_list(body: ImageListRequest, request: Request):
    images_location = Path(body.location).resolve()
    tags = body.tags
    project_id = f"{uuid.uuid4()}".replace("-", "")
    result = ImageListResponse(
        location=images_location.resolve().as_posix(),
        projectId=project_id,
    )

    if not images_location.exists():
        result.status = "error"
        result.message = f"Images location {images_location} does not exist."
        return result

    global_projects[project_id] = images_location.as_posix()
    id_counter = count(1)
    ims = []
    for tag in tags:
        if tag.path:
            tag_im_location = images_location / Path(tag.path)
            if not tag_im_location.exists():
                continue
            print(f"搜索图片：{tag_im_location.resolve().as_posix()}")
            tag_images = getfiles(tag_im_location, image_extensions)
            for im in tag_images:
                ims.append(
                    ImItem(
                        id=0,
                        title=f"{im.name}",
                        tagId=tag.id,
                        description=f"{im.name}",
                        path=im.resolve().as_posix(),
                        url="api/loadImage?im_path=" + im.resolve().as_posix(),
                    )
                )

    ims.sort(key=lambda x: x.title)
    for im in ims:
        im.id = next(id_counter)

    result.images = ims
    return result


@router.post("/changeImageTag", response_model=ChangeImageClassResponse)
async def change_image_class(
        change_request: ChangeImageClassRequest
):
    im = change_request.im
    response = ChangeImageClassResponse(im=im)
    project_id = change_request.projectId
    if project_id not in global_projects:
        response.status = "error"
        response.message = f"Project ID {project_id} does not exist. Suggest Reload Project."
        return response
    proj_location = global_projects[project_id]
    old_path = Path(im.path)
    new_path = Path(proj_location) / im.tag.path / old_path.name
    if not old_path.exists():
        response.status = "error"
        response.message = f"Image location {old_path} does not exist."
        return response
    Path(new_path).parent.mkdir(parents=True, exist_ok=True)
    shutil.move(old_path, new_path)
    im.path = new_path.resolve().as_posix()
    im.url = "api/loadImage?im_path=" + im.path
    response.im = im
    return response


@router.post("/cleanAllTags")
async def clean_all_tags(request: CleanAllTags):
    global global_projects

    print("请求", request)
    project_id = request.projectId

    tags = request.tags
    if project_id not in global_projects:
        return {"status": "error", "message": f"Project ID {project_id} does not exist."}

    project_location = Path(global_projects[project_id])
    if not project_location.exists():
        return {"status": "error", "message": f"Project location {project_location} does not exist."}

    for tag in tags:
        tag_path = project_location / tag.path
        if tag_path.exists() and tag_path.is_dir():
            if tag_path == project_location:
                print(f"Skipping root project directory {project_location} for tag {tag.name}.")
                continue
            for file in getfiles(tag_path, image_extensions):
                new_path = project_location / file.name
                shutil.move(file, new_path)
        else:
            print(f"Tag directory {tag_path} does not exist or is not a directory.")

    return {"status": "ok", " message": "All tags cleaned successfully. Place Click Reload Project to see changes."}
