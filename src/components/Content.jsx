import React from 'react';
import { useSelector } from 'react-redux';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../css/Content.css';

function Content() {
    const { messages } = useSelector(state => state.chatAi);
    const lastAssistantMessage = messages.filter(msg => msg.role === 'assistant').pop();

    const extractCodeBlocks = (content) => {
        const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
        const codeBlocks = [];
        let match;

        while ((match = codeBlockRegex.exec(content)) !== null) {
            codeBlocks.push({
                language: match[1] || 'javascript',
                code: match[2].trim()
            });
        }

        return codeBlocks;
    };

    return (
        <div className="content-container">
            <h2>APP预览</h2>
            {lastAssistantMessage && extractCodeBlocks(lastAssistantMessage.content).map((block, index) => (
                <div key={index} className="code-block">
                    <SyntaxHighlighter language={block.language} style={tomorrow}>
                        {block.code}
                    </SyntaxHighlighter>
                </div>
            ))}
        </div>
    );
}

export default Content;
