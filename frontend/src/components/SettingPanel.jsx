import React from 'react';
import {Form, Input, Modal, Select} from 'antd';
import i18n from "i18next";
import {useTranslation} from "react-i18next";


import {readableKey} from "./utils.jsx";

export default function SettingPanel({
                                         open,
                                         onOk,
                                         onCancel,
                                         settingConfig,
                                         setSettingConfig,
                                         currentProjConf
                                     }) {

    const {t} = useTranslation();

    const setBackendUrl = (url) => {
        console.log("Setting backend URL to:", url);
        setSettingConfig(prevConfig => {
            return {...prevConfig, backendUrl: url};
        });
    }

    const tagMap = Object.fromEntries(currentProjConf.tags.map(tag => [tag.id, tag.name]));

    return (
        <Modal
            title={t("setting")}
            open={open}
            onOk={() => {
                onOk();
            }}
            onCancel={onCancel}
        >
            <Form layout="vertical" style={{width: '100%', height: '100%', padding: 0}}>
                <Form.Item label={<b>{t("backEndUrl")}</b>} style={{marginBottom: "4px"}}>
                    <Input
                        placeholder={t("inputImagePath")}
                        value={settingConfig.backendUrl}
                        onChange={(e) => setBackendUrl(e.target.value)}
                    />
                </Form.Item>
                <Form.Item label={<b>{t("currentLang")}</b>} style={{marginBottom: "4px"}}>
                    <Select
                        defaultValue={i18n.language}
                        style={{width: 160}}
                        onChange={(lng) => i18n.changeLanguage(lng)}
                        options={[
                            {value: 'zh', label: '中文'},
                            {value: 'en', label: 'English'},
                        ]}
                    />
                </Form.Item>


                <Form.Item label={<b>{t("hotkey")}</b>} style={{marginBottom: "4px"}}>
                    <Form.List name="accdd">
                        {() => (
                            <div>
                                {Object.entries(currentProjConf.hotkeys).map(([key, keys]) => {
                                    let displayName = tagMap[key] || key;

                                    return (
                                        <div key={key} color={"black"}>
                                            {displayName}： {keys.map(k => readableKey(k)).join(',')}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Form.List>
                </Form.Item>


            </Form>

        </Modal>



    );
}
