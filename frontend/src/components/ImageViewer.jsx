import React, {useEffect, useRef, useState} from 'react';
import 'react-image-lightbox/style.css';
import urlJoin from "url-join";
import {useTranslation} from "react-i18next";
import {Flex, Image} from "antd";


function RotatableImage({settingConfig, imViewConfig, selectedImage}) {
    const [displaySize, setDisplaySize] = useState({
        width: 'auto',
        height: '100%',
    });
    const containerRef = useRef(null);

    const imageRef = useRef(null);


    const [visible, setVisible] = useState(false);

    const updateImageSize = () => {
        const img = imageRef.current;
        if (!img) return;

        const iw = img.naturalWidth;
        const ih = img.naturalHeight;

        const rotated = (imViewConfig?.rotateDeg ?? 0) % 180 !== 0;
        const container = containerRef.current;
        if (!container) return;

        const cw = container.clientWidth;
        const ch = container.clientHeight;

        const cwpx = `${cw}px`;
        const chpx = `${ch}px`;
        if (!rotated) {
            if (iw / ih > cw / ch) {
                setDisplaySize({
                    width: '100%',
                    height: 'auto',
                })
            } else {
                setDisplaySize({
                    width: 'auto',
                    height: '100%',
                })
            }
        } else {
            setDisplaySize({
                width: chpx,
                maxWidth: chpx,
                maxHeight: cwpx,
                height: "auto"
            })
        }

    };

    useEffect(() => {
        updateImageSize();
    }, [imViewConfig, selectedImage]);

    return (
        <Flex style={{height: "90%", maxHeight: "90%", width: "100%", maxWidth: "100%"}} align={"center"}
              justify={"center"} ref={containerRef}>

            <Image
                style={{display: 'none'}}
                preview={{
                    visible,
                    src: urlJoin(settingConfig.backendUrl, selectedImage.url || selectedImage.path),
                    onVisibleChange: value => {
                        setVisible(value);
                    },
                    imageRender: (x) => {
                        const newStyle = {
                            ...(x.props.style || {}),
                            transform: `rotate(${imViewConfig?.rotateDeg ?? 0}deg)`,
                        };
                        return React.cloneElement(x, { style: newStyle });
                    }
                }}
            />
            <img
                onClick={() => {
                    setVisible(true)
                }}
                ref={imageRef}
                src={urlJoin(settingConfig.backendUrl, selectedImage.url || selectedImage.path)}
                alt={selectedImage.description || selectedImage.path}
                onLoad={updateImageSize}
                style={{
                    transform: `rotate(${imViewConfig?.rotateDeg ?? 0}deg)`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.3s ease-in-out',
                    ...displaySize,
                }}
            />
        </Flex>

    );
}


export default function ImageViewer({
                                        selectedImage,
                                        setSelectedImage,
                                        refreshKey,
                                        setRefreshKey,
                                        settingConfig,
                                        imViewConfig
                                    }) {


    const {t} = useTranslation();
    const [open, setOpen] = useState(false);

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


    // const handleImageLoad = (e) => {
    //     const {naturalWidth, naturalHeight} = e.target;
    //     selectedImage.naturalSize = {width: naturalWidth, height: naturalHeight};
    //     setSelectedImage(selectedImage);
    //     setRefreshKey(refreshKey + 1); // 强制刷新组件以更新实际宽高显示
    // };

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

        open ? (

            <RotatableImage
                settingConfig={settingConfig}
                selectedImage={selectedImage}
                imViewConfig={imViewConfig} // 支持 0, 90, 180, 270
            />

        ) : (
            <span style={{
                color: '#999',
                textAlign: 'center',
                padding: 16
            }}>{t("waitLoad")} {selectedImage.title}</span>
        )
    );
}
