import React, { useState, useEffect, useRef } from 'react';
import '../../css/DynamicPreview.css';

function DynamicPreview({ codeBlocks }) {
  const [code, setCode] = useState('');
  const iframeRef = useRef(null);

  useEffect(() => {
    if (codeBlocks && codeBlocks.js) {
      console.log("codeBlocks.js", codeBlocks.js);
      setCode(codeBlocks.js);
    }
  }, [codeBlocks]);

  useEffect(() => {
    if (iframeRef.current) {
      updateIframeContent();
    }
  }, [code]);

  const preprocessCode = (code) => {
    return code
      .replace(/import\s+.*?from\s+['"].*?['"];?/g, '') // 去掉 import 语句
      .replace(/export\s+default\s+\w+;?/, '') // 去掉 export default 语句
      .replace(/const\s+\{\s*useState\s*,\s*useEffect\s*\}\s*=\s*React\s*;?/g, ''); // 去掉 const { useState, useEffect } = React;
  };

  const updateIframeContent = () => {
    const iframeDoc = iframeRef.current.contentDocument;
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
          <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
              overflow: hidden;
            }
            #root {
              padding: 0;
              width: 100%;
              height: 100%;
              overflow: auto;
              -webkit-overflow-scrolling: touch;
            }
            /* 自定义滚动条样式 */
            #root::-webkit-scrollbar {
              width: 4px; /* 滚动条宽度 */
            }
            #root::-webkit-scrollbar-track {
              background: transparent; /* 滚动条轨道背景色 */
            }
            #root::-webkit-scrollbar-thumb {
              background: rgba(0, 0, 0, 0.5); /* 滚动条滑块背景色 */
              border-radius: 2px; /* 滚动条滑块圆角 */
            }
            #root::-webkit-scrollbar-thumb:hover {
              background: rgba(0, 0, 0, 0.7); /* 滚动条滑块悬停背景色 */
            }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            const { useState, useEffect, useRef } = React;
            ${preprocessCode(code)}
            (function() {
              const componentName = Object.keys(window).find(key => 
                window[key] && 
                typeof window[key] === 'function' && 
                /^[A-Z]/.test(key) && 
                key !== 'React' &&
                key !== 'ReactDOM'
              );

              if (componentName) {
                ReactDOM.render(
                  React.createElement(window[componentName]), 
                  document.getElementById('root')
                );
              } else {
                console.error('未找到有效的 React 组件。可用的全局对象：', Object.keys(window));
                document.getElementById('root').innerHTML = 
                  '<p style="color: red;">错误：未找到有效的 React 组件。请查看控制台以获取更多详细信息。</p>';
              }
            })();
          </script>
        </body>
      </html>
    `);
    iframeDoc.close();
  };

  return (
    <div className="preview-container">
      <div className="phone-frame">
        <div className="phone-screen">
          <div className="phone-notch"></div>
          <div className="phone-status-bar">
            <span>9:41</span>
            <span>📶 📶 🔋</span>
          </div>
          <div className="iframe-container">
            <iframe
              ref={iframeRef}
              onLoad={updateIframeContent}
              title="codePreview"
              frameBorder="0"
              className="code-preview"
            />
          </div>
          <div className="phone-home-indicator"></div>
        </div>
        <div className="phone-button"></div>
      </div>
    </div>
  );
}

export default DynamicPreview;