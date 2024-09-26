import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs, Button } from 'antd';  // 导入 Button
import Editor from './code_preview/editor';
import Preview from './code_preview/preview';
import DynamicPreview from './code_preview/dynamic-preview'; 
import AppPreview from './code_preview/app-preview';
import { toggleSmartEditMode } from '../redux/content-slice';
import '../css/Content.css';

function Content() {
    // 获取 dispatch 函数,用于触发 Redux actions
    const dispatch = useDispatch();

    // 从 Redux store 中获取聊天消息
    const { messages } = useSelector(state => state.chatAi);

    // 从 Redux store 中获取 Smart Edit 模式的状态
    const { isSmartEditMode } = useSelector(state => state.content);

    // 获取最后一条助手消息
    const lastAssistantMessage = messages.filter(msg => msg.role === 'assistant').pop();

    // 当前活动的标签页,默认为 'preview'
    const [activeTab, setActiveTab] = useState('preview');

    // 存储提取的代码
    const [extractedCode, setExtractedCode] = useState('');

    // 存储不同类型的代码块 (HTML, CSS, JavaScript)
    const [codeBlocks, setCodeBlocks] = useState({ html: '', css: '', js: '' });

    // 存储应用预览中的组件
    const [appComponents, setAppComponents] = useState([]);

    // 添加 useEffect 来打印 isSmartEditMode 的状态
    useEffect(() => {
        console.log('Smart Edit Mode:', isSmartEditMode);
    }, [isSmartEditMode]);

    const extractCodeBlocks = (content) => {
        const blocks = {
            js: ''
        };

        const regex = /```(jsx?|react|javascript)\n([\s\S]*?)```/g;
        let match;

        while ((match = regex.exec(content)) !== null) {
            const code = match[2].trim();
            blocks.js += code + '\n\n';
        }
        console.log("Extracted blocks:", blocks);
        return blocks;
    };

    useEffect(() => {
        if (lastAssistantMessage) {
            const blocks = extractCodeBlocks(lastAssistantMessage.content);
            setCodeBlocks(blocks);
            setExtractedCode(
                `${blocks.js}`
            );
        }
    }, [lastAssistantMessage]);

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
                        <Editor
                            extractedCode={extractedCode}
                            setExtractedCode={setExtractedCode}
                            setCodeBlocks={setCodeBlocks}
                        />
                    </TabPane>
                    <TabPane tab="Code Preview" key="preview">
                        <DynamicPreview codeBlocks={codeBlocks} isSmartEditMode={isSmartEditMode} />
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

export default Content;
