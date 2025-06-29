import React, {useEffect, useRef, useState} from 'react';
import 'react-image-lightbox/style.css';
import urlJoin from "url-join";
import {useTranslation} from "react-i18next";


export default function ImageViewer({
                                        selectedImage,
                                        setSelectedImage,
                                        refreshKey,
                                        setRefreshKey,
                                        settingConfig
                                    }) {


    const {t} = useTranslation();
    const [open, setOpen] = useState(false);
    const containerRef = useRef();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (
                ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) ||
                e.target.isContentEditable
            ) {
                return; // 避免在输入框等处触发
            }

            const key = e.key;
            const hotkeys = settingConfig.hotkeys;
            const matchedEntry = Object.entries(hotkeys).find(([, keys]) => keys.includes(key));
            if (!matchedEntry) return;
            e.preventDefault(); // 阻止默认事件（比如空格滚动）
            const [actionKey] = matchedEntry;
            const domId = `btnId-${actionKey}`;  // 你用的 ID 命名规则
            const btn = document.getElementById(domId);
            if (btn) {
                btn.click();  // 触发按钮点击
            } else {
                console.warn(`按钮 ${domId} 未找到`);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [settingConfig.hotkeys]);


    const handleImageLoad = (e) => {
        const {naturalWidth, naturalHeight} = e.target;
        selectedImage.naturalSize = {width: naturalWidth, height: naturalHeight};
        setSelectedImage(selectedImage);
        setRefreshKey(refreshKey + 1); // 强制刷新组件以更新实际宽高显示
    };

    useEffect(() => {
        setOpen(false); // 在 selectedImage 改变时清除之前的图片
        if (selectedImage) {
            setTimeout(() => setOpen(true), 0);
        }
    }, [selectedImage?.id]);

    if (!selectedImage) {
        return <div style={{color: '#999', textAlign: 'center', padding: 16}}>{t("selectAnImage")}</div>;
    }

    return (
        <div style={{padding: 2, textAlign: 'center', width: '100%', height: '93%'}} ref={containerRef}>
            {open ? (
                <img
                    src={urlJoin(settingConfig.backendUrl, selectedImage.url || selectedImage.path)}
                    alt={selectedImage.title}
                    onLoad={handleImageLoad}
                    style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        width: 'auto',
                        height: '100%',
                        // borderRadius: 8,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        cursor: 'pointer'
                    }}
                />
            ) : (
                <span style={{color: '#999', textAlign: 'center', padding: 16}}>{t("waitLoad")} {selectedImage.title}</span>

            )}
        </div>
    );
}
