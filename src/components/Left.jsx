import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, message, Avatar } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import { sendMessage, addMessage } from '../redux/chatAiSlice';

function PageLeft() {
    const [input, setInput] = useState('');
    const dispatch = useDispatch();
    const { messages, isLoading, error } = useSelector(state => state.chatAi);
    const messagesEndRef = useRef(null);

    const handleSend = async () => {
        if (!input.trim()) {
            message.warning('请输入内容');
            return;
        }

        const userMessage = { role: 'user', content: input };
        dispatch(addMessage(userMessage));
        setInput('');

        try {
            await dispatch(sendMessage(input)).unwrap();
        } catch (error) {
            console.error('Error:', error);
            message.error('发送失败，请稍后重试');
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
                        if (!e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                />
                <SendOutlined className="send-icon" onClick={handleSend} />
            </div>
        </div>
    );
}

export default PageLeft;