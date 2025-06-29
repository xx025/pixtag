// HeaderLoad.js
import React, {useState} from 'react';
import {Input, Button, Layout, Flex} from 'antd';
import {cleanAllTags, loadImageList, OKStatus, tags} from "./utils.jsx";
import {useTranslation} from "react-i18next";

const {Header} = Layout;

export default function HeaderLoad({
                                       SetImageList,
                                       mockImageList,
                                       settingConfig,
                                       currentProjConf,
                                       setCurrentProjConf
                                   }) {


    const {t} = useTranslation();
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState(
        currentProjConf.location || ''
    );
    const [loadings, setLoadings] = useState(false);


    function cleanAllTagsProxy() {
        let anw = confirm(t("confirmCleanAllTags"));
        if (!anw) {
            return;
        }

        console.log(currentProjConf.tags)
        cleanAllTags(
            settingConfig.backendUrl,
            currentProjConf.projectId,
            currentProjConf.tags
        ).then(result => {
            const {status, message} = result;
            if (!OKStatus.includes(status)) {
                alert(message);
                return;
            }
            console.log("清除所有标签成功:", result);
            handleButtonClick()
            alert(t("cleanAllTagsSuccess"));
        }).catch(
            error => {
                console.error("清除所有标签失败:", error);
                alert(error);
            }
        )
    }

    let startTime = performance.now();
    const handleButtonClick = () => {
        setLoading(true);

        loadImageList(settingConfig.backendUrl, inputValue, tags).then(result => {
            const {images, location, message, projectId, status} = result;
            if (!OKStatus.includes(status)) {
                alert(message)
            }
            startTime = performance.now();

            // 重组 images 列表，将 tag ID 替换为完整的 tag 对象
            const imagesList = images.map(image => {
                const tag = tags.find(t => t.id === image.tagId) || tags[0]; // 如果没有找到，默认使用未标状态
                return {
                    ...image,
                    tag: tag, // 使用完整的 tag 对象
                };
            });
            console.log("加载图片列表:", result);
            if (SetImageList) {
                SetImageList(imagesList);
                setCurrentProjConf({
                    ...currentProjConf,
                    projectId: projectId,
                    location: location,
                });
                console.log("图片列表加载成功:", imagesList);
            } else {
                console.warn("loadImageList2 is not provided");
            }
        }).catch(error => {
            console.error("加载图片列表失败:", error);
            alert(error)
        }).finally(
            () => {

                const endTime = performance.now();
                const duration = endTime - startTime;
                console.log(`loadImageList 耗时: ${duration.toFixed(2)} 毫秒`);
                setLoading(false); // 设置加载状态为false
                setLoadings(true); // 设置加载完成状态
            }
        )
    };

    return (
        <Flex gap={"large"}>
            <Input
                placeholder={t("inputImagePath")}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                style={{width: 500}}
                disabled={loading}
            />
            <Button onClick={handleButtonClick} loading={loading}>
                {
                    loading ? t("loading") : (loadings ? t("reload") : t("load"))
                }
            </Button>
            <Button onClick={cleanAllTagsProxy}
                    disabled={loading || !SetImageList}
            > {t("cleanAllTags")}</Button>
        </Flex>);
}
