import {Flex} from 'antd';
import {useEffect, useState} from "react";

import {useTranslation} from 'react-i18next';
import {GithubOutlined} from "@ant-design/icons";
import {decryptAES, encryptAES, othersInfo} from "./utils.jsx";


export function BottomLine({currentProjConf, selectedImage, mockImageList, refreshKey}) {


    const {t} = useTranslation();
    const [sizeText, setSizeText] = useState(null);


    const [tagCountMap, setTagCountMap] = useState({});

    useEffect(() => {
        // console.log("selectedImage.naturalSize", selectedImage?.naturalSize);
        if (selectedImage?.naturalSize) {
            const text = `${selectedImage.naturalSize.width}x${selectedImage.naturalSize.height}`;
            setSizeText(text);
        } else {
            setSizeText(t("waitLoad"));
        }
    }, [refreshKey, selectedImage]);


    useEffect(() => {
        const countMap = {};

        mockImageList.forEach(item => {
            const tagId = item.tag.id;
            if (!countMap[tagId]) {
                countMap[tagId] = {
                    ...item.tag,
                    count: 0
                };
            }
            countMap[tagId].count++;
        });
        setTagCountMap(countMap);
    }, [mockImageList, refreshKey]);




    return (selectedImage ?
            <Flex align="center" gap="large" style={{width: "100%"}} direction="horizontal" justify="space-between">
                <Flex direction="horizontal" align="center" gap="small">
                    <span> [ {selectedImage.id} / {mockImageList.length} ]</span>

                    <span>{t("imagePath")}: {selectedImage.path || selectedImage.url}</span>
                    {/*<span style={{width: 150,wrap:false}}> {t("actualSize")}: {sizeText} </span>*/}
                </Flex>
                <Flex direction="horizontal" align="center" gap="small">
                    {Object.values(tagCountMap).map((tag, index, arr) => (
                        <span key={tag.id} style={{color: tag.color, marginRight: 8}}>
                            {tag.name}: {tag.count}
                            {index !== arr.length - 1 && ' ｜ '}
                        </span>
                    ))}
                    <a href={decryptAES(othersInfo.github, othersInfo.key)}><GithubOutlined /></a>
                </Flex>
            </Flex> : <>{t("selectAnImage")}</>
    )
        ;
}
