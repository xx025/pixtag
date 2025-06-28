import {Flex} from 'antd';
import {useEffect, useState} from "react";

import {useTranslation} from 'react-i18next';


export function BottomLine({selectedImage, mockImageList, refreshKey}) {


    const {t} = useTranslation();
    const [sizeText, setSizeText] = useState(null);


    useEffect(() => {
        // console.log("selectedImage.naturalSize", selectedImage?.naturalSize);
        if (selectedImage?.naturalSize) {
            const text = `${selectedImage.naturalSize.width}x${selectedImage.naturalSize.height}`;
            setSizeText(text);
        } else {
            setSizeText(t("waitLoad"));
        }
    }, [refreshKey, selectedImage]);

    return (

        selectedImage ?

            <Flex align="center" gap="large" style={{width: "100%"}} direction="horizontal" justify="space-between">
                <div>
                    <span>{t("imagePath")}: {selectedImage.path || selectedImage.url}</span>
                    <span style={{width: 130}}> {t("actualSize")}: {sizeText} </span>
                </div>
                <span>{t("currentPosition")}: [ {selectedImage.id} / {mockImageList.length} ]</span>
            </Flex> : <>{t("selectAnImage")}</>
)
    ;
}
