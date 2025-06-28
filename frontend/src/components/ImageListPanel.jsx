import React, {useEffect, useRef} from 'react';
import {List, Tag, Flex, Input, Select, Space} from 'antd';

export default function ImageListSidebar({onImageSelect, mockImageList, selectedImage, refreshKey}) {
    const itemRefs = useRef({});

    useEffect(() => {
        if (selectedImage && itemRefs.current[selectedImage.id]) {
            itemRefs.current[selectedImage.id].scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    }, [selectedImage?.id]);


    return (
        <Flex vertical='vertical' style={{height: '100%', width: '100%'}} justify="space-between">
            {/*<Select*/}
            {/*    size="small"*/}
            {/*    mode="multiple"*/}
            {/*    allowClear*/}
            {/*    style={{width: '100%'}}*/}
            {/*    placeholder="Please select"*/}
            {/*    defaultValue={['a10', 'c12']}*/}
            {/*/>*/}
            <div style={{
                overflowY: 'auto',
                borderRight: '1px solid #eee',
                background: '#fafafa',
                padding: '4px',
                boxSizing: 'border-box',
            }}>
                <List
                    itemLayout="vertical"
                    dataSource={mockImageList}
                    renderItem={(item) => (
                        <div
                            key={item.id}
                            ref={el => itemRefs.current[item.id] = el}
                        >
                            <List.Item
                                onClick={() => onImageSelect && onImageSelect(item)}
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
                                <Flex justify="space-between" align="center" style={{fontSize: 12, color: '#666'}} gap={"1px"}>
                                    <span style={{whiteSpace: 'normal', wordBreak: 'break-all'}}>
                                        {`${item.id}. ${item.description}`}
                                    </span>
                                    <Tag bordered={false} color={item.tag.color} style={{fontSize: "10", marginInline:"0" ,width: "50px"}} >
                                        {item.tag.name}
                                    </Tag>
                                </Flex>
                            </List.Item>
                        </div>
                    )}
                />
            </div>

            {/*<Input placeholder="Search" size="small"/>*/}
        </Flex>

    );
}