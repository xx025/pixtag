import {Button, Flex} from 'antd';
import {OKStatus, tags, updateImageTag} from "./utils.jsx";
import {LeftOutlined, RightOutlined} from "@ant-design/icons";

export default function TagControlPanel(
    {
        selectedImage,
        setSelectedImage,
        onPrev,
        onNext,
        refreshKey,
        setRefreshKey,
        currentProjConf,
        settingConfig
    }
) {

    function isSolid(bind_tag, tag) {
        return bind_tag && bind_tag.id === tag.id;
    }

    function solidOrDashed(bind_tag, tag) {
        if (!bind_tag || !tag) {
            return 'dashed'; // 如果没有绑定的标签或当前标签，使用虚线
        }
        return isSolid(bind_tag, tag) ? 'outlined' : 'dashed';
    }

    function onTagChange(tag) {
        if (!selectedImage) return;

        const old_tag = selectedImage.tag;
        if (selectedImage.tag !== tag) {
            selectedImage.tag = tag; // 更新选中图片的标签
            updateImageTag(settingConfig.backendUrl, currentProjConf.projectId, selectedImage).then(result => {
                    const {status, message, im} = result;
                    if (!OKStatus.includes(status)) {
                        alert(message);
                        selectedImage.tag = old_tag; // 恢复原来的标签
                        setSelectedImage(selectedImage); // 更新状态
                    }
                    console.log("更新图片标签成功:", result);
                    selectedImage.path = im.path
                    selectedImage.url = im.url
                    setSelectedImage(selectedImage)

                    setRefreshKey(refreshKey + 1)
                    onNext() // 避免异步问题
                }
            ).catch(
                error => {
                    console.error("更新图片失败:", error);
                    alert(error)
                }
            )
        } else {
            onNext(); // 自动切换到下一张图片
        }

    }


    return (
        <Flex gap="large" align="center" justify="center" style={{padding: 8, width: "100%"}}>
            <Button onClick={onPrev} disabled={!selectedImage}><LeftOutlined/> Prev </Button>
            <Button
                variant={solidOrDashed(tags[0], selectedImage?.tag)}
                color="blue"
                onClick={() => onTagChange && onTagChange(tags[0])}
                disabled={!selectedImage}
            >
                {(selectedImage?.tag.name == tags[0].name ? ">" : "") + tags[0].name}
            </Button>
            <Button color="green"
                    variant={solidOrDashed(tags[1], selectedImage?.tag)}
                    onClick={() => onTagChange && onTagChange(tags[1])}
                    disabled={!selectedImage}
            >
                {(selectedImage?.tag.name == tags[1].name ? ">" : "") + tags[1].name}
            </Button>

            <Button
                variant={solidOrDashed(tags[3], selectedImage?.tag)}
                color="yellow"
                onClick={() => onTagChange && onTagChange(tags[3])}
                disabled={!selectedImage}
            >
                {(selectedImage?.tag.name == tags[3].name ? ">" : "") + tags[3].name}
            </Button>
            <Button
                color="red"
                variant={solidOrDashed(tags[2], selectedImage?.tag)}
                onClick={() => onTagChange && onTagChange(tags[2])}
                disabled={!selectedImage}
            >
                {(selectedImage?.tag.name == tags[2].name ? ">" : "") + tags[2].name}
            </Button>
            <Button onClick={onNext} disabled={!selectedImage}>Next <RightOutlined /> </Button>
        </Flex>
    );
}