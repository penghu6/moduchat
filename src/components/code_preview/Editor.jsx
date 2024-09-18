import React from 'react';
import { Button, message } from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from '@codemirror/view';
import { CopyOutlined } from '@ant-design/icons';

function Editor({ extractedCode, setExtractedCode, setCodeBlocks }) {
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                <Button 
                    icon={<CopyOutlined />} 
                    onClick={copyToClipboard}
                >
                    复制代码
                </Button>
            </div>
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
                    const htmlEndIndex = value.indexOf('<style>');
                    const cssEndIndex = value.indexOf('</style>');
                    const updatedBlocks = {
                        html: value.substring(0, htmlEndIndex).trim(),
                        css: value.substring(value.indexOf('<style>') + 7, cssEndIndex).trim(),
                        js: value.substring(value.indexOf('<script>') + 8, value.indexOf('</script>')).trim()
                    };
                    setCodeBlocks(updatedBlocks);
                }}
            />
        </div>
    );
}

export default Editor;
