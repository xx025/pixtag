import urlJoin from "url-join";
import keycode from "keycode";


export const OKStatus = [200, "200", "OK", "ok", "success", "Success", "successed"];


export const defaultBackendUrl = 'http://127.0.0.1:9989';

export const tags = [
    {id: 0, name: 'UnTag', color: '#717273', "path": "./"}, // 保留标记, ./
    {id: 1, name: 'Right', color: '#48915e', path: "./right"},
    {id: 2, name: 'Wrong', color: '#f3668d', path: "./error"},
    {id: 3, name: 'Ignore', color: '#ecba3f', path: "./ignore"},
];
export const defaultHotkeys = {
    "prev": ["ArrowLeft",],
    "next": ["ArrowRight", " "],
    0: ["w", "Backspace"],  // untag
    1: ["d", "ArrowUp"], // right
    2: ["a", "ArrowDown"], // error
    3: ["s", "Delete"],  // Ignore
}

export const defaultProjConf = {
    projectId: 0,
    location: '',
    tags: tags,
    hotkeys: defaultHotkeys,
};

export const defaultSettingConf = {
    backendUrl: defaultBackendUrl,
    hotkeys: defaultHotkeys,
};


export const readableKey = (k) => {
    const keyDisplayMap = {
        ' ': 'Space',
        'Enter': 'Enter ⏎',
        'Backspace': 'Backspace ⌫',
        'Delete': 'Delete ⌦',
        'ArrowLeft': '←',
        'ArrowRight': '→',
        'ArrowUp': '↑',
        'ArrowDown': '↓',
        'Tab': 'Tab ⇥',
    };
    return keyDisplayMap?.k ? keyDisplayMap[k] : k;
};
export  function loadWithDefaults(key, defaults) {
    try {
        const stored = localStorage.getItem(key);
        const parsed = stored ? JSON.parse(stored) : {};
        return { ...defaults, ...parsed };
    } catch (e) {
        console.warn(`无法解析 localStorage[${key}]，使用默认值`, e);
        return defaults;
    }
}


export function hexToRgba(hex, alpha = 0.5) {
    // 处理#开头
    let c = hex.startsWith('#') ? hex.substring(1) : hex;

    // 支持缩写 #abc 转成 #aabbcc
    if (c.length === 3) {
        c = c.split('').map(x => x + x).join('');
    }

    const bigint = parseInt(c, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `rgba(${r},${g},${b},${alpha})`;
}

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

