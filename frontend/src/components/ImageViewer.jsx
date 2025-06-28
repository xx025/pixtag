import React, {useEffect, useState} from 'react';
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
        <div style={{padding: 2, textAlign: 'center', width: '100%', height: '93%'}}>
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
