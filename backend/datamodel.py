from typing import List, Any

from pydantic import BaseModel

image_extensions = ["*.jpg", "*.jpeg", "*.png", "*.bmp", "*.gif", "*.webp"]



class Tag(BaseModel):
    id: int = 0  # Default tag ID
    name: str = "default"  # Default tag name
    color: str = "#FFFFFF"  # Default color is white
    path: str = "./"


class ImageListRequest(BaseModel):
    location: str
    tags: List[Tag]


class ImageListResponse(BaseModel):
    location: str
    status: str = "success"  # Default status is success
    projectId: str
    message: str = "Images loaded successfully"
    images: List[Any] = []  # List of images, can be of any type
    tags: List[Tag] = []  # List of tags associated with the images


class ImItem(BaseModel):
    id: int
    path: str
    title: str
    tagId: int = 0
    tag: Tag = None
    url: str
    description: str = ""


class ChangeImageClassRequest(BaseModel):
    projectId: str
    im: ImItem


class ChangeImageClassResponse(BaseModel):
    status: str = "success"  # Default status is success
    message: str = "Image class changed successfully"
    im: ImItem


class CleanAllTags(BaseModel):
    projectId: str
    tags: List[Tag]
