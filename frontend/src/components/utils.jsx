import urlJoin from "url-join";


export const OKStatus = [200, "200", "OK", "ok", "success", "Success", "successed"];


export const tags = [
    {id: 0, name: 'UnTag', color: '#ccc', "path": "./"},
    {id: 1, name: 'Right', color: '#48915e', path: "./right"},
    {id: 2, name: 'Error', color: '#d17b93', path: "./error"},
    {id: 3, name: 'Ignore', color: '#958765', path: "./ignore"},
];

export function loadImageList(backendUrl, value, tags) {
    const url = urlJoin(backendUrl, 'api/getImageList');
    return fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({location: value, tags})
    }).then(
        res => res.json()
    ).catch(
        err => {
            console.error("加载图片列表失败:", err);
            throw new Error("加载图片列表失败，请检查网络连接或后端服务是否正常。");
        }
    )
}

export function updateImageTag(backendUrl, projectId, selectedImage) {
    // console.log(projectId, selectedImage);
    const get_project_path_url = urlJoin(backendUrl, `api/changeImageTag`);
    const data = JSON.stringify({projectId, im: selectedImage})
    // console.log("更新图片标签数据:", data);
    return fetch(get_project_path_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    }).then(
        res => res.json()
    ).catch(err => {
        console.error("更新图片标签失败:", err);
        throw new Error("更新图片标签失败，请检查网络连接或后端服务是否正常。");
    })
}


export function cleanAllTags(backendUrl, projectId, tags) {

    const get_project_path_url = urlJoin(backendUrl, `api/cleanAllTags`);
    return fetch(get_project_path_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({projectId, tags})
    }).then(
        res => res.json()
    ).catch(err => {
        console.error("清除所有标签失败:", err);
        throw new Error("清除所有标签失败，请检查网络连接或后端服务是否正常。");
    });
}

