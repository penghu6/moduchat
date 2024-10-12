import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from '@codemirror/view';
import { CopyOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { updateCodeHandle } from '../../redux/chatSlice';
import { extractCodeBlocks } from '../../utils/utils';


function CodeEditor() {

    // 存储提取的代码
    const [code, setCode] = useState('');
    const dispatch = useDispatch();

    // 从 Redux store 中获取聊天消息
    const { codeComponent } = useSelector(state => state.chat);

    useEffect(() => {
        if (codeComponent) {
            setCode(
                `${codeComponent.js}`
            );
        }
    }, [codeComponent]);


    // 复制代码到剪贴板
    const copyToClipboard = () => {
        navigator.clipboard.writeText(code).then(() => {
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
                value={code}
                height="700px"
                extensions={[
                    EditorView.lineWrapping,
                    html(),
                    css(),
                    javascript({ jsx: true })  // 启用 JavaScript 和 JSX 支持
                ]}
                theme="dark"
                onChange={(value) => {
                    // console.log("value",value); 

                    // 更新代码块
                    const updatedCode = {
                        js: value.toString()
                    };
                    dispatch(updateCodeHandle(updatedCode));
                    setCode(updatedCode);
                }}
            />
        </div>
    );
}

export default CodeEditor;
