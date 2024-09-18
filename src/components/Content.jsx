import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Tabs } from 'antd';
import Editor from './code_preview/Editor';
import Preview from './code_preview/Preview';

function Content() {
    const { messages } = useSelector(state => state.chatAi);
    const lastAssistantMessage = messages.filter(msg => msg.role === 'assistant').pop();
    const [activeTab, setActiveTab] = useState('editor');
    const [extractedCode, setExtractedCode] = useState('');
    const [codeBlocks, setCodeBlocks] = useState({ html: '', css: '', js: '' });

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
                        <Preview codeBlocks={codeBlocks} />
                    </TabPane>
                </Tabs>
            </div>
        );
    };

    return (
        <div className="content-container">
            <h2>代码预览</h2>
            {lastAssistantMessage && renderCodeBlocks()}
        </div>
    );
}

export default Content;
