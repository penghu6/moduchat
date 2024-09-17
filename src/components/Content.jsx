import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Tabs } from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { xml } from '@codemirror/lang-xml';
import { sass } from '@codemirror/lang-sass';
import { less } from '@codemirror/lang-less';
import { vue } from '@codemirror/lang-vue';
import { EditorView } from '@codemirror/view';
import * as Babel from '@babel/standalone';

function Content() {
    const { messages } = useSelector(state => state.chatAi);
    const lastAssistantMessage = messages.filter(msg => msg.role === 'assistant').pop();
    const [activeTab, setActiveTab] = useState('editor');
    const [extractedCode, setExtractedCode] = useState('');
    const [codeBlocks, setCodeBlocks] = useState({ html: '', css: '', js: '' });

    const extractCodeBlocks = (content) => {
        const blocks = {
            html: '',
            css: '',
            js: ''
        };

        const regex = /```(\w+)\n([\s\S]*?)```/g;
        let match;

        while ((match = regex.exec(content)) !== null) {
            const language = match[1].toLowerCase();
            const code = match[2].trim();

            if (language === 'html') blocks.html = code;
            else if (language === 'css') blocks.css = code;
            else if (language === 'javascript' || language === 'jsx' || language === 'react') blocks.js = code;
        }

        return blocks;
    };

    useEffect(() => {
        if (lastAssistantMessage) {
            const blocks = extractCodeBlocks(lastAssistantMessage.content);
            setCodeBlocks(blocks);
            setExtractedCode(
                `// HTML\n${blocks.html}\n\n// CSS\n${blocks.css}\n\n// React\n${blocks.js}`
            );
        }
    }, [lastAssistantMessage]);

    const compileReactCode = (code) => {
        try {
            return Babel.transform(code, {
                presets: ['react'],
            }).code;
        } catch (error) {
            console.error('Babel compilation error:', error);
            return `console.error("Babel compilation error: ${error.message}")`;
        }
    };

    const renderPreview = () => {
        const { html: htmlContent, css: cssContent, js: jsContent } = codeBlocks;
        const compiledJs = compileReactCode(jsContent);
        const fullHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
                <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
                <style>${cssContent}</style>
            </head>
            <body>
                <div id="root">${htmlContent}</div>
                <script>
                    ${compiledJs}
                    ReactDOM.render(React.createElement(App), document.getElementById('root'));
                </script>
            </body>
            </html>
        `;

        return (
            <div style={{ width: '100%', height: '500px', overflow: 'hidden', border: '1px solid #ccc' }}>
                <iframe
                    srcDoc={fullHtml}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title="Code Preview"
                    sandbox="allow-scripts"
                />
            </div>
        );
    };

    const renderCodeBlocks = () => {
        const { TabPane } = Tabs;

        return (
            <div className="code-block">
                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <TabPane tab="Live Editor" key="editor">
                        <CodeMirror
                            value={extractedCode}
                            height="500px"
                            extensions={[
                                EditorView.lineWrapping,
                                html(),
                                css(),
                                javascript({ jsx: true })
                            ]}
                            theme="dark"
                            onChange={(value) => {
                                setExtractedCode(value);
                                const updatedBlocks = {
                                    html: value.match(/\/\/ HTML\n([\s\S]*?)(?=\/\/|$)/)?.[1] || '',
                                    css: value.match(/\/\/ CSS\n([\s\S]*?)(?=\/\/|$)/)?.[1] || '',
                                    js: value.match(/\/\/ React\n([\s\S]*?)(?=\/\/|$)/)?.[1] || ''
                                };
                                setCodeBlocks(updatedBlocks);
                            }}
                        />
                    </TabPane>
                    <TabPane tab="Code Preview" key="preview">
                        {renderPreview()}
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
