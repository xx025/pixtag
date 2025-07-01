import {Button, Flex} from "antd";
import {LockOutlined, RotateLeftOutlined, RotateRightOutlined, UnlockOutlined} from "@ant-design/icons";
import React, {useEffect} from "react";

export default function ControlImView({
                                          imViewConfig,
                                          setImViewConfig,
                                          selectedImage
                                      }) {


    useEffect(() => {
        // 当切换图片时，如果没有锁定角度，就自动还原为 0
        if (selectedImage) {
            console.log("selectedImage", selectedImage, imViewConfig);
            if (!imViewConfig?.rotateLock) {
                setImViewConfig(prev => ({
                    ...prev,
                    rotateDeg: 0,
                }));
            }
        }
    }, [selectedImage]);


    function setNextDeg(plusDeg) {
        console.log("nextDeg", imViewConfig.rotateDeg + plusDeg)
        setImViewConfig(
            {...imViewConfig, rotateDeg: imViewConfig.rotateDeg + plusDeg}
        )

    }


    return (
        <Flex gap={"small"} align={"center"}>
            <Button icon={<RotateLeftOutlined/>} type="text" style={{padding: "0 5px"}}
                    onClick={() => setNextDeg(-90)}/>
            <Button icon={<RotateRightOutlined/>} type="text" style={{padding: "0 5px"}}
                    onClick={() => setNextDeg(90)}/>
            <Button icon={imViewConfig.rotateLock ? <LockOutlined/> :  <UnlockOutlined/> } type="text"
                    style={{padding: "0 5px"}}
                    onClick={() => {
                        setImViewConfig({
                            ...imViewConfig, rotateLock: !imViewConfig.rotateLock
                        })
                    }}/>
        </Flex>
    )
}
