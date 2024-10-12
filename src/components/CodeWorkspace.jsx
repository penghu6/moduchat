import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs, Button } from 'antd';  // 导入 Button
import Editor from './ui-components/CodeEditor';
import DynamicPreview from './ui-components/CodeEditorPreview'; 
import AppPreview from './ui-components/ComponentPreview';
import { toggleSmartEditMode } from '../redux/content-slice';
import '../css/CodeWorkspace.css';

function CodeWorkspace() {
    // 获取 dispatch 函数,用于触发 Redux actions
    const dispatch = useDispatch();

    // 从 Redux store 中获取 Smart Edit 模式的状态
    const { isSmartEditMode } = useSelector(state => state.content);


    // 当前活动的标签页,默认为 'preview'
    const [activeTab, setActiveTab] = useState('preview');

    // 存储应用预览中的组件
    const [appComponents, setAppComponents] = useState([]);

    // 添加 useEffect 来打印 isSmartEditMode 的状态
    useEffect(() => {
        console.log('Smart Edit Mode:', isSmartEditMode);
    }, [isSmartEditMode]);

   

    // useEffect(() => {
    //     if (lastAssistantMessage) {
    //         const blocks = extractCodeBlocks(lastAssistantMessage.content);
    //         setCodeBlocks(blocks);
    //         setExtractedCode(
    //             `${blocks.js}`
    //         );
    //     }
    // }, [lastAssistantMessage]);

    const addComponentToAppPreview = (component) => {
        setAppComponents(prevComponents => [...prevComponents, component]);
    };

    const handleToggleSmartEditMode = () => {
        dispatch(toggleSmartEditMode());
    };

    const renderCodeBlocks = () => {
        const { TabPane } = Tabs;

        return (
            <div className="code-block">
                <Tabs 
                    activeKey={activeTab} 
                    onChange={setActiveTab} 
                    defaultActiveKey="preview"
                    className="code-tabs"
                >
                    <TabPane tab="Live Editor" key="editor">
                        <Editor/>
                    </TabPane>
                    <TabPane tab="Code Preview" key="preview">
                        <DynamicPreview isSmartEditMode={isSmartEditMode} />
                    </TabPane>
                    <TabPane tab="App Preview" key="appPreview">
                        <AppPreview 
                            components={appComponents} 
                            addComponent={addComponentToAppPreview}
                        />
                    </TabPane>
                </Tabs>
            </div>
        );
    };

    return (
        <div className="content-container">
            <div className="header-container">
                <h2>代码预览</h2>
                <div className="smart-edit-wrapper">
                    <Button 
                        type={isSmartEditMode ? "primary" : "default"}
                        onClick={handleToggleSmartEditMode}
                        className="smart-edit-button"
                    >
                        Smart Edit
                    </Button>
                </div>
            </div>
            {renderCodeBlocks()}
        </div>
    );
}

export default CodeWorkspace;
