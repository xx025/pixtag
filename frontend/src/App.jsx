import './App.css'
import React, {useEffect, useState} from 'react';
import {Button, Flex, Layout, Select, Tag} from 'antd';
import HeaderLoad from "./components/HeaderLoad.jsx";
import ImageListSidebar from "./components/ImageListPanel.jsx";
import ImageViewer from "./components/ImageViewer.jsx";
import TagControlPanel from "./components/TagControlPanel.jsx";
import {SettingFilled} from "@ant-design/icons";
import SettingPanel from "./components/SettingPanel.jsx";
import {BottomLine} from "./components/BottomLine.jsx";
import {tags} from "./components/utils.jsx";
import i18n from "i18next";

const {Header, Footer, Sider, Content} = Layout;


export default function Main() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [mockImageList, setMockImageList] = useState([])
    const [refreshKey, setRefreshKey] = useState(0);// 一些组件延迟渲染,用于强制刷新组件


    useEffect(() => {
        console.log("当前语言:", i18n.language);
    }, []);


    const [currentProjConf, setCurrentProjConf] = useState(() => {
        const savedConfig = localStorage.getItem('currentProjConf');
        console.log(savedConfig)
        if (savedConfig) {
            return JSON.parse(savedConfig);
        }
        return {
            projectId: 0,
            location: '',
            tags: tags
        };
    })

    useEffect(() => {
        localStorage.setItem('currentProjConf', JSON.stringify(currentProjConf));
    }, [currentProjConf]);


    const [settingConfig, setSettingConfig] = useState(() => {
        const savedConfig = localStorage.getItem('settingConfig');
        if (savedConfig) {
            return JSON.parse(savedConfig);
        }
        return {
            backendUrl: 'http://127.0.0.1:9989'
        };
    });

    const [showSetting, setShowSetting] = useState(false);

    const onPrev = () => {
        if (!selectedImage) return;
        const currentIndex = mockImageList.findIndex(img => img.id === selectedImage.id);
        if (currentIndex > 0) {
            setSelectedImage(mockImageList[currentIndex - 1]);
        }
    }

    const onNext = () => {
        if (!selectedImage) return;
        const currentIndex = mockImageList.findIndex(img => img.id === selectedImage.id);
        if (currentIndex < mockImageList.length - 1) {
            setSelectedImage(mockImageList[currentIndex + 1]);
        }
    }


    return (
        <Layout className="main-layout">
            <SettingPanel
                open={showSetting}
                onOk={() => setShowSetting(false)}
                onCancel={() => setShowSetting(false)}
                settingConfig={settingConfig}
                setSettingConfig={setSettingConfig}
            />
            <Header className="custom-fixed-header">
                <Flex justify="space-between" align="center" style={{width: '100%'}}>
                    <HeaderLoad
                        SetImageList={setMockImageList}
                        mockImageList={mockImageList}
                        settingConfig={settingConfig}
                        currentProjConf={currentProjConf}
                        setCurrentProjConf={setCurrentProjConf}
                    />
                    <Button icon={<SettingFilled/>} onClick={() => setShowSetting(!showSetting)}/>
                </Flex>
            </Header>
            <div className="main-inner-layout">
                <Sider className="custom-fixed-left">
                    <div className="image-list-sidebar-scroll">
                        <ImageListSidebar
                            onImageSelect={setSelectedImage}
                            mockImageList={mockImageList}
                            selectedImage={selectedImage}
                            refreshKey={refreshKey}
                        />
                    </div>
                </Sider>
                <Content className="custom-fixed-content">
                    <Flex vertical justify={'space-between'} align={'center'} style={{height: '100%'}}>
                        <ImageViewer
                            selectedImage={selectedImage}
                            setSelectedImage={setSelectedImage}
                            refreshKey={refreshKey}
                            setRefreshKey={setRefreshKey}
                            settingConfig={settingConfig}
                        />
                        <TagControlPanel
                            selectedImage={selectedImage}
                            setSelectedImage={setSelectedImage}
                            onPrev={onPrev}
                            onNext={onNext}
                            refreshKey={refreshKey}
                            setRefreshKey={setRefreshKey}
                            currentProjConf={currentProjConf}
                            settingConfig={settingConfig}
                        />
                    </Flex>
                </Content>
                {/*<Sider className="custom-fixed-right">右栏</Sider>*/}
            </div>
            <Footer className="custom-fixed-footer">
                <BottomLine
                    selectedImage={selectedImage}
                    mockImageList={mockImageList}
                    refreshKey={refreshKey}
                />
            </Footer>
        </Layout>
    );
}
