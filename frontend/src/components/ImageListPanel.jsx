import React, {useEffect, useRef, useState} from 'react';
import {List, Tag, Flex, Input, Select} from 'antd';
import {hexToRgba} from "./utils.jsx";

export default function ImageListSidebar({
                                             setSelectedImage,
                                             selectedImage,
                                             mockImageList,
                                             setMockImageList,
                                             currentProjConf,
                                             refreshKey,
                                             setRefreshKey,
                                         }) {
    const itemRefs = useRef({});
    const [selectedIds, setSelectedIds] = useState([]);


    useEffect(() => {
        if (currentProjConf?.tags?.length) {
            setSelectedIds(currentProjConf.tags.map(tag => tag.id));
        }
    }, [currentProjConf]);

    const [searchValue, setSearchValue] = React.useState('');

    useEffect(() => {
        if (selectedImage && itemRefs.current[selectedImage.id]) {
            itemRefs.current[selectedImage.id].scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    }, [selectedImage?.id]);


    // 选择第一个可见的图片
    useEffect(
        () => {
            if (mockImageList.length > 0 && !mockImageList.some(item => item.id === selectedImage?.id && item.isVisible)) {
                const firstVisibleImage = mockImageList.find(item => item.isVisible);
                if (firstVisibleImage) {
                    setSelectedImage(firstVisibleImage);
                } else {
                    setSelectedImage(null);
                }
            }
        },
        [mockImageList, selectedImage, refreshKey]
    )


    useEffect(() => {
        mockImageList.forEach(item => {
            item.isVisible = item.description.includes(searchValue) && selectedIds.includes(item.tag.id);
        });
        setMockImageList(mockImageList);
        if (selectedImage && !mockImageList.find(img => img.id === selectedImage.id)?.isVisible) {
            setSelectedImage(null);
        }
    }, [searchValue, selectedIds, selectedImage, refreshKey]);

    useEffect(() => {
        console.log("Selected IDs changed:", selectedIds);
        setRefreshKey(refreshKey + 1); // 强制刷新组件以更新可见性
    }, [selectedIds]);


    const handleChange = (value) => {
        setSelectedIds(value);
    };


    return (
        <Flex vertical='vertical' style={{height: '100%', width: '100%'}} justify="space-between">
            <Select
                size="small"
                mode="multiple"
                allowClear
                style={{width: '100%'}}
                placeholder="Please select"
                value={selectedIds}
                onChange={handleChange}
            >
                {currentProjConf.tags.map(tag => (
                    <Option key={tag.id} value={tag.id}>
                        {tag.name}
                    </Option>
                ))}
            </Select>
            <div style={{
                overflowY: 'auto',
                borderRight: '1px solid #eee',
                background: '#fafafa',
                padding: '4px',
                boxSizing: 'border-box',
            }}>
                <List
                    itemLayout="vertical"
                    dataSource={mockImageList.filter(item => item.isVisible)} // 👈 只保留 isVisible 为 true 的
                    renderItem={(item) => (
                        <div key={item.id} ref={el => itemRefs.current[item.id] = el}>
                            <List.Item
                                onClick={() => setSelectedImage && setSelectedImage(item)}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: selectedImage?.id === item.id ? '#e6f7ff' : 'transparent',
                                    border: selectedImage?.id === item.id ? '1px solid #1890ff' : 'none',
                                    borderRadius: 2,
                                    marginBottom: 2,
                                    padding: 2,
                                    margin: '2px 0',
                                    transition: 'background 0.2s',
                                }}
                            >
                                <Flex justify="space-between" align="center" style={{fontSize: 12, color: '#666'}}
                                      gap={"1px"}>
                                    <span style={{whiteSpace: 'normal', wordBreak: 'break-all'}}>
                                        {`${item.id}. ${item.description}`}
                                    </span>
                                    <Tag bordered={false} color={hexToRgba(item.tag.color, 0.7)}
                                         style={{fontSize: "10", marginInline: "0", width: "50px"}}>
                                        {item.tag.name}
                                    </Tag>
                                </Flex>
                            </List.Item>
                        </div>
                    )}
                />
            </div>

            <Input
                placeholder="Search"
                size="small"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
        </Flex>

    );
}