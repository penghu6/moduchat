import React, { useState, useEffect } from 'react';
import '../../css/DynamicPreview.css';

function Preview({ codeBlocks }) {
  const [code, setCode] = useState('');

  useEffect(() => {
    if (codeBlocks && codeBlocks.js) {
      setCode(codeBlocks.js);
    }
  }, [codeBlocks]);

  const preprocessCode = (code) => {
    // 移除 import 和 export 语句
    return code.replace(/^import\s+.*$/gm, '').replace(/^export\s+.*$/gm, '');
  };

  return (
    <div className="preview-container">
      <div className="phone-frame">
        <div className="phone-screen">
          <div className="phone-notch"></div>
          <div className="phone-button"></div>
          <div className="phone-status-bar">
            <span>9:41</span>
            <span>📶 📶 🔋</span>
          </div>
          <iframe
            srcDoc={`
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="UTF-8" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                  <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
                  <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
                  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                  <style>
                    body {
                      margin: 0;
                      padding: 0;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                    }
                  </style>
                </head>
                <body>
                  <div id="root"></div>
                  <script type="text/babel">
                    const { useState, useEffect } = React;
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
                        console.error('No valid React component found. Available global objects:', Object.keys(window));
                        document.getElementById('root').innerHTML = 
                          '<p style="color: red;">Error: No valid React component found. Check the console for more details.</p>';
                      }
                    })();
                  </script>
                </body>
              </html>
            `}
          />
          <div className="phone-home-indicator"></div>
        </div>
      </div>
    </div>
  );
}

export default Preview;