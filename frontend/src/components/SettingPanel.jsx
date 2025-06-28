import React from 'react';
import {Input, Modal, Select} from 'antd';
import i18n from "i18next";

export default function SettingPanel({
                                         open,
                                         onOk,
                                         onCancel,
                                         settingConfig,
                                         setSettingConfig
                                     }) {


    const handleOk = () => {
        onOk();
    };

    const setBackendUrl = (url) => {
        console.log("Setting backend URL to:", url);
        setSettingConfig(prevConfig => {
            return {...prevConfig, backendUrl: url};
        });
        localStorage.setItem('settingConfig', JSON.stringify({
            ...settingConfig,
            backendUrl: url
        }));
    }

    return (
        <Modal
            title="Setting"
            open={open}
            onOk={handleOk}
            onCancel={onCancel}
        >



            <p>后端地址:</p>
            <Input
                placeholder="请输入后端地址"
                value={settingConfig.backendUrl}
                onChange={e => setBackendUrl(e.target.value)}
            />

            <p>当前语言: {i18n.language}</p>
            <Select
                defaultValue={i18n.language}
                style={{ width: 120 }}
                onChange={(lng) => i18n.changeLanguage(lng)}
                options={[
                    { value: 'zh', label: '中文' },
                    { value: 'en', label: 'English' },
                ]}
            />

        </Modal>



    );
}
