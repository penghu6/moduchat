import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

const PreviewContainer = styled.div`
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: bold;
`;

const PreviewArea = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  margin-top: 20px;
  height: 500px; // 设置一个固定高度
`;

function Preview({ codeBlocks }) {
  const [code, setCode] = useState('');

  useEffect(() => {
    if (codeBlocks && codeBlocks.js) {
      setCode(codeBlocks.js);
    }
  }, [codeBlocks]);

  // 预处理代码，移除 import 和 export 语句
  const preprocessCode = (code) => {
    console.log('Original code:', code);
    const processedCode = code
      .replace(/import React(,|\s*)\s*{\s*(useState,\s*useEffect|useEffect,\s*useState)?\s*}\s*from\s*['"]react['"];?\n?/, '')
      .replace(/import React from ['"]react['"];?\n?/, '')
      .replace(/export default (\w+);?/, 'window.$1 = $1;')
      .replace(/export { (\w+) as default };?/, 'window.$1 = $1;')
    console.log('Processed code:', processedCode);
    return processedCode;
  };

  return (
    <PreviewContainer>
      <PreviewArea>
        <iframe
          srcDoc={`
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8" />
                <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
                <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
                <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
              </head>
              <body>
                <div id="root"></div>
                <script type="text/babel">
                  const { useState, useEffect } = React;
                  
                  // Inject the user code after processing
                  ${preprocessCode(code)}
                  
                  (function() {
                    const componentName = Object.keys(window).find(key => 
                      window[key] && 
                      typeof window[key] === 'function' && 
                      /^[A-Z]/.test(key) && // Ensure it's a React component with uppercase first letter
                      key !== 'React' &&
                      key !== 'ReactDOM'
                    );
      
                    if (componentName) {
                      ReactDOM.render(
                        React.createElement(window[componentName]), 
                        document.getElementById('root')
                      );
                    } else {
                      console.error('No valid React component found. Available global objects:', Object.keys(window));
                      document.getElementById('root').innerHTML = 
                        '<p style="color: red;">Error: No valid React component found. Check the console for more details.</p>';
                    }
                  })();
                </script>
              </body>
            </html>
          `}
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </PreviewArea>
    </PreviewContainer>
  );
  
}

export default Preview;