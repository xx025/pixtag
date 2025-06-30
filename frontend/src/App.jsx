import './App.css'
import React, {useEffect, useState} from 'react';
import {Button, Flex, Layout} from 'antd';
import HeaderLoad from "./components/HeaderLoad.jsx";
import ImageListSidebar from "./components/ImageListPanel.jsx";
import ImageViewer from "./components/ImageViewer.jsx";
import TagControlPanel from "./components/TagControlPanel.jsx";
import {SettingFilled} from "@ant-design/icons";
import SettingPanel from "./components/SettingPanel.jsx";
import {BottomLine} from "./components/BottomLine.jsx";
import {
    defaultProjConf,
    defaultSettingConf,
    loadWithDefaults
} from "./components/utils.jsx";
import i18n from "i18next";
import ControlImView from "./components/ControlImView.jsx";


const {Header, Footer, Sider, Content} = Layout;


export default function Main(key) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [mockImageList, setMockImageList] = useState([])
    const [refreshKey, setRefreshKey] = useState(0);// 一些组件延迟渲染,用于强制刷新组件
    const [showSetting, setShowSetting] = useState(false);
    const [currentProjConf, setCurrentProjConf] = useState(() => {
        return loadWithDefaults('currentProjConf', defaultProjConf);
    })

    const [imViewConfig, setImViewConfig] = useState({
        rotateDeg: 0,
        rotateLock: false
    })

    const [settingConfig, setSettingConfig] = useState(() => {
        return loadWithDefaults('settingConfig', defaultSettingConf)
    });

    useEffect(() => {
        console.log("当前语言:", i18n.language);
    }, []);
    useEffect(() => {
        localStorage.setItem('currentProjConf', JSON.stringify(currentProjConf));
    }, [currentProjConf]);

    useEffect(() => {
        localStorage.setItem("settingConfig", JSON.stringify(settingConfig));
    }, [settingConfig]);


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
                currentProjConf={currentProjConf}
                setCurrentProjConf={setCurrentProjConf}
            />
            <Header className="custom-fixed-header">
                <Flex justify="space-between" align="center" style={{width: '100%'}}>
                    <Flex gap={"large"}>
                        <HeaderLoad
                            SetImageList={setMockImageList}
                            mockImageList={mockImageList}
                            settingConfig={settingConfig}
                            currentProjConf={currentProjConf}
                            setCurrentProjConf={setCurrentProjConf}
                        />
                        <ControlImView
                            imViewConfig={imViewConfig}
                            setImViewConfig={setImViewConfig}
                            selectedImage={selectedImage}
                        />
                    </Flex>
                    <Button icon={<SettingFilled/>} onClick={() => setShowSetting(!showSetting)}/>
                </Flex>
            </Header>
            <div className="main-inner-layout">
                <Sider className="custom-fixed-left">
                    <div className="image-list-sidebar-scroll">
                        <ImageListSidebar
                            setSelectedImage={setSelectedImage}
                            selectedImage={selectedImage}
                            mockImageList={mockImageList}
                            setMockImageList={setMockImageList}
                            currentProjConf={currentProjConf}
                            refreshKey={refreshKey}
                            setRefreshKey={setRefreshKey}

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
                            imViewConfig={imViewConfig}
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

                    currentProjConf={currentProjConf}
                    selectedImage={selectedImage}
                    mockImageList={mockImageList}
                    refreshKey={refreshKey}
                />
            </Footer>
        </Layout>
    );
}
