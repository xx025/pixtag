import {Button, Flex} from 'antd';
import {hexToRgba, OKStatus, tags, updateImageTag} from "./utils.jsx";
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

    // const containerRef = useRef(null);



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
            }).catch(error => {
                console.error("更新图片失败:", error);
                alert(error)
            })
        } else {
            onNext();
        }
    }

    return (
        <Flex gap="large" align="center" justify="center" style={{padding: 8, width: "100%"}}>
            <Button onClick={onPrev} disabled={!selectedImage} id="btnId-prev">
                <LeftOutlined/> Prev
            </Button>
            {currentProjConf.tags.map((tag, idx) => {
                const bgColor = tag.color
                const isSelected = selectedImage?.tag?.name === tag.name;
                return (
                    <Button
                        id={`btnId-${idx}`}
                        key={tag.id || tag.name} disabled={!selectedImage}
                        onClick={() => onTagChange && onTagChange(tag)}
                        style={{
                            background: hexToRgba(bgColor, 0.4),
                            color: "black",
                            borderColor: isSelected ? "black" : undefined, // 选中时边框白色提示，optional
                            textDecoration: isSelected ? 'underline' : undefined
                        }}
                    >
                        {tag.name}
                    </Button>
                );
            })}
            <Button onClick={onNext} disabled={!selectedImage} id="btnId-next">
                Next <RightOutlined/>
            </Button>
        </Flex>

    );
}
