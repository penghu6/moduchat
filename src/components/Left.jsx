import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, message, Avatar, Upload, Button } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined, PictureOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { sendMessage, addMessage } from '../redux/chat-ai-slice';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import '../css/Left.css'; 

function PageLeft() {
    const [input, setInput] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const dispatch = useDispatch();
    const { messages, isLoading, error } = useSelector(state => state.chatAi);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const textAreaRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async () => {
        if (!input.trim() && !imageFile) {
            message.warning('请输入内容或上传图片');
            return;
        }

        const userMessage = { role: 'user', content: input };
        dispatch(addMessage(userMessage));
        setInput('');

        try {
            await dispatch(sendMessage({ text: input, image: imageFile })).unwrap();
            setImageFile(null);
        } catch (error) {
            console.error('Error:', error);
            message.error('发送失败，请稍后重试');
        }
    };

    const handleImageUpload = (info) => {
        const file = info.file.originFileObj;
        if (file) {
            setImageFile(file);
            message.success(`${file.name} 上传成功`);
        } else {
            message.error('上传失败，请重试');
        }
    };

    const handlePaste = (event) => {
        const items = event.clipboardData.items;
        for (let item of items) {
            if (item.type.indexOf('image') !== -1) {
                const file = item.getAsFile();
                setImageFile(file);
                break;
            }
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreviewUrl(null);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const observer = new MutationObserver(scrollToBottom);
        const config = { childList: true, subtree: true };
        observer.observe(messagesContainerRef.current, config);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (imageFile) {
            const objectUrl = URL.createObjectURL(imageFile);
            setImagePreviewUrl(objectUrl);

            // 清理函数
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [imageFile]);

    return (
        <div className="LeftContainer">
            <div className="messages-container" ref={messagesContainerRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                        <Avatar 
                            icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />} 
                            className={`avatar ${msg.role}`}
                        />
                        <div className="message-content">
                            <ReactMarkdown
                                components={{
                                    code({node, inline, className, children, ...props}) {
                                        const match = /language-(\w+)/.exec(className || '')
                                        return !inline && match ? (
                                            <SyntaxHighlighter
                                                language={match[1]}
                                                PreTag="div"
                                                {...props}
                                            >
                                                {String(children).replace(/\n$/, '')}
                                            </SyntaxHighlighter>
                                        ) : (
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        )
                                    }
                                }}
                            >
                                {msg.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="ai-input-container">
                <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={handleImageUpload}
                >
                    <Button icon={<PictureOutlined />} />
                </Upload>
                <div className="input-wrapper">
                    <Input.TextArea
                        ref={textAreaRef}
                        placeholder="说出你的需求..."
                        autoSize={{ minRows: 3, maxRows: 5 }}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onPaste={handlePaste}
                        onPressEnter={(e) => {
                            if (!e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />
                    {imagePreviewUrl && (
                        <div className="image-preview">
                            <img 
                                src={imagePreviewUrl}
                                alt="预览" 
                            />
                            <Button 
                                icon={<CloseCircleOutlined />} 
                                onClick={removeImage}
                                className="remove-image-button"
                            />
                        </div>
                    )}
                </div>
                <SendOutlined className={`send-icon ${isLoading ? 'sending' : ''}`} onClick={handleSend} />
            </div>
        </div>
    );
}

export default PageLeft;