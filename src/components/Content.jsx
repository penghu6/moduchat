import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Tabs } from 'antd';
import Editor from './code_preview/Editor';
import Preview from './code_preview/Preview';
import DynamicPreview from './code_preview/DynamicPreview'; 
import AppPreview from './code_preview/AppPreview';  // 新增

function Content() {
    const { messages } = useSelector(state => state.chatAi);
    const lastAssistantMessage = messages.filter(msg => msg.role === 'assistant').pop();
    const [activeTab, setActiveTab] = useState('editor');
    const [extractedCode, setExtractedCode] = useState('');
    const [codeBlocks, setCodeBlocks] = useState({ html: '', css: '', js: '' });
    const [appComponents, setAppComponents] = useState([]);  // 新增

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
        console.log("blocks",blocks)
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

    const renderCodeBlocks = () => {
        const { TabPane } = Tabs;

        return (
            <div className="code-block">
                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <TabPane tab="Live Editor" key="editor">
                        <Editor
                            extractedCode={extractedCode}
                            setExtractedCode={setExtractedCode}
                            setCodeBlocks={setCodeBlocks}
                        />
                    </TabPane>
                    <TabPane tab="Code Preview" key="preview">
                        <DynamicPreview codeBlocks={codeBlocks} />
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
            <h2>代码预览</h2>
            {renderCodeBlocks()}
        </div>
    );
}

export default Content;
