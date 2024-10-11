import React from 'react';
import { Button, message } from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from '@codemirror/view';
import { CopyOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

function CodeEditor({ setExtractedCode, setCodeBlocks }) {
    // 从 Redux store 获取代码
    const extractedCode = useSelector(state => state.content.code);

    // 复制代码到剪贴板
    const copyToClipboard = () => {
        navigator.clipboard.writeText(extractedCode).then(() => {
            message.success('代码已复制到剪贴板');
        }).catch(err => {
            console.error('无法复制代码: ', err);
            message.error('复制失败，请手动复制');
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* 复制代码按钮 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                <Button 
                    icon={<CopyOutlined />} 
                    onClick={copyToClipboard}
                >
                    复制代码
                </Button>
            </div>
            {/* CodeMirror 编辑器 */}
            <CodeMirror
                value={extractedCode}
                height="700px"
                extensions={[
                    EditorView.lineWrapping,
                    html(),
                    css(),
                    javascript({ jsx: true })  // 启用 JavaScript 和 JSX 支持
                ]}
                theme="dark"
                onChange={(value) => {
                    // 更新提取的代码
                    setExtractedCode(value);
                    // 更新代码块
                    const updatedBlocks = {
                        js: value
                    };
                    setCodeBlocks(updatedBlocks);
                }}
            />
        </div>
    );
}

export default CodeEditor;
