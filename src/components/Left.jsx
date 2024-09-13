import React, { useState, useRef, useEffect } from 'react';
import { Input, message, Avatar } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import axios from 'axios';

function PageLeft() {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    const handleSend = async () => {
        if (!input.trim()) {
            message.warning('请输入内容');
            return;
        }

        const userMessage = { role: 'user', content: input };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInput('');

        try {
            const result = await axios.post(
                'http://openai-proxy.brain.loocaa.com/v1/chat/completions',
                {
                    model: "gpt-3.5-turbo",
                    messages: [...messages, userMessage]
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer DlJYSkMVj1x4zoe8jZnjvxfHG6z5yGxK'
                    }
                }
            );

            const aiMessage = { role: 'assistant', content: result.data.choices[0].message.content };
            setMessages(prevMessages => [...prevMessages, aiMessage]);
        } catch (error) {
            console.error('Error:', error);
            message.error('发送失败，请稍后重试');
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="LeftContainer">
            <div className="messages-container">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                        <Avatar 
                            icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />} 
                            className={`avatar ${msg.role}`}
                        />
                        <div className="message-content">{msg.content}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="ai-input-container">
                <Input.TextArea
                    placeholder="说出你的需求..."
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onPressEnter={(e) => {
                        e.preventDefault();
                        handleSend();
                    }}
                />
                <SendOutlined className="send-icon" onClick={handleSend} />
            </div>
        </div>
    );
}

export default PageLeft;