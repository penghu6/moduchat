import React, { useState, useEffect, useRef } from 'react';
import '../../css/DynamicPreview.css';
import { componentToString, stringToComponent } from '../../utils/tools';
import { reviseComponent } from '../../api/open_ai';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Rendering error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}

function DynamicPreview({ codeBlocks, isSmartEditMode }) {
  const [code, setCode] = useState('');
  const iframeRef = useRef(null);

  useEffect(() => {
    if (codeBlocks && codeBlocks.js) {
      setCode(codeBlocks.js);
    }
  }, [codeBlocks]);

  useEffect(() => {
    if (iframeRef.current) {
      updateIframeContent();
    }
  }, [code]);

  useEffect(() => {
    console.log('Smart Edit Mode in DynamicPreview:', isSmartEditMode);
  }, [isSmartEditMode]);

  const preprocessCode = (code) => {
    return code
      .replace(/import\s+.*?from\s+['"].*?['"];?/g, '') // 去掉所有 import 语句
      .replace(/export\s+default\s+\w+;?/, '') // 去掉 export default 语句
      .replace(/const\s+\{\s*useState\s*,\s*useEffect\s*\}\s*=\s*React\s*;?/g, '') // 去掉 const { useState, useEffect } = React;
      .replace(/const\s+\{\s*useState\s*\}\s*=\s*React\s*;?/g, '') // 去掉 const { useState } = React;
      .replace(/import\s+React,\s*{\s*useState\s*}\s*from\s+['"]react['"];?/g, ''); // 去掉 import React, { useState } from 'react';
  };

  const handleReviseComponent = async (prompt) => {
    try {
      const revisedCode = await reviseComponent(prompt, code);
      console.log('Revised code:', revisedCode);
      // 如果你想更新预览，可以取消下面这行的注释
       setCode(revisedCode);
    } catch (error) {
      console.error('Error revising component:', error);
    }
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
            :root {
              --rp-select-color: 210, 100%, 50%;
              --bd-dash-percent: 25%;
              --bd-border-width: 2px;
              --bd-gap-and-dash-length: 8px;
              --bd-speed: 0px;
            }

            /* Make whole page (iframe) */
            body.rp-focus-enabled * {
              cursor: default !important;
              user-select: none !important;
            }

            /* Selected element styles when clicking on an element when using "Focus & Edit" */
            .rp-selected {
              border-radius: 4px;
              background-clip: border-box;
              box-shadow:
                0 4px 6px -1px rgb(0 0 0 / 0.1),
                0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
              position: relative;
              background: linear-gradient(
                  90deg,
                  hsl(var(--rp-select-color)) var(--bd-dash-percent),
                  transparent calc(100% - var(--bd-dash-percent))
                ),
                linear-gradient(
                  90deg,
                  hsl(var(--rp-select-color)) var(--bd-dash-percent),
                  transparent calc(100% - var(--bd-dash-percent))
                ),
                linear-gradient(
                  0deg,
                  hsl(var(--rp-select-color)) var(--bd-dash-percent),
                  transparent calc(100% - var(--bd-dash-percent))
                ),
                linear-gradient(
                  0deg,
                  hsl(var(--rp-select-color)) var(--bd-dash-percent),
                  transparent calc(100% - var(--bd-dash-percent))
                );
              background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
              background-size:
                var(--bd-gap-and-dash-length) var(--bd-border-width),
                var(--bd-gap-and-dash-length) var(--bd-border-width),
                var(--bd-border-width) var(--bd-gap-and-dash-length),
                var(--bd-border-width) var(--bd-gap-and-dash-length);
              background-position:
                0 0,
                var(--bd-speed) 100%,
                0 var(--bd-speed),
                100% 0;
              animation: border-dance 10s infinite linear;
            }

            @keyframes border-dance {
              0% {
                background-position:
                  0 0,
                  100% 100%,
                  0 100%,
                  100% 0;
              }
              100% {
                background-position:
                  100% 0,
                  0 100%,
                  0 0,
                  100% 100%;
              }
            }

            .rp-selected::after {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-color: hsla(var(--rp-select-color), 0.1);
              pointer-events: none;
            }

            /* Hover effect styles when enabling "Focus & Edit" */
            .rp-hovered:not(.rp-selected) {
              border-radius: 4px;
              outline: 1px dashed #5048e5 !important;
              position: relative;
            }

            .rp-hovered:not(.rp-selected)::after {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-color: rgba(80, 72, 229, 0.03);
              pointer-events: none;
            }

            .edit-input-container {
              position: absolute;
              z-index: 10;
              width: 272px; /* 17rem * 16px/rem = 272px */
              max-width: 90vw;
            }

            .edit-input-form {
              position: relative;
              margin-top: 0.75rem;
              display: flex;
              width: 100%;
              border-radius: 0.5rem;
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
            }

            .edit-input-inner {
              position: relative;
              min-width: 0;
              flex: 1 1 0%;
            }

            .edit-input-textarea-wrapper {
              overflow: hidden;
              border-radius: 0.5rem;
              background-color: white;
              border: 1px solid rgb(209, 213, 219); /* 直接应用边框 */
            }

            .edit-input-textarea {
              display: block;
              width: 100%;
              resize: none;
              border: 0;
              background-color: transparent;
              padding: 0.375rem 0.75rem;
              color: rgb(17 24 39);
              font-size: 0.875rem;
              line-height: 1.5rem;
            }

            .edit-input-textarea:focus {
              outline: none;
            }

            .edit-input-textarea-wrapper:focus-within {
              border-color: rgb(79, 70, 229); /* 聚焦时改变边框颜色 */
              box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2); /* 添加轻微的阴影效果 */
            }

            .edit-input-submit {
              position: absolute;
              right: 8px;
              bottom: 8px;
              display: inline-flex;
              align-items: center;
              border-radius: 6px;
              background-color: rgb(79 70 229);
              padding: 3px 5px;
              font-size: 10px;
              color: white;
              box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            }

            .edit-input-submit:hover {
              background-color: rgb(67 56 202);
            }

            @media (min-width: 640px) {
              .edit-input-textarea {
                font-size: 0.875rem;
                line-height: 1.5rem;
              }
            }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            const { useState, useEffect, useRef } = React;

            const EditInput = ({ top, left, onSubmit, selectedElement }) => {
              const [input, setInput] = useState('');
              const textareaRef = useRef(null);

              useEffect(() => {
                if (textareaRef.current) {
                  textareaRef.current.focus();
                }
              }, []);

              const handleSubmit = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const elementInfo = selectedElement ? \`Selected element: <\${selectedElement.tagName.toLowerCase()} data-rs="\${selectedElement.getAttribute('data-rs')}">\n\n\` : '';
                const prompt = \`\${elementInfo}\${input}\`;
                onSubmit(prompt);
                setInput('');
              };

              const handleChange = (e) => {
                e.stopPropagation();
                setInput(e.target.value);
              };

              const handleKeyDown = (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              };

              const handleClick = (e) => {
                e.stopPropagation();
              };

              return (
                <div 
                  className="edit-input-container" 
                  style={{ top: \`\${top}px\`, left: '20px' }}
                  onClick={handleClick}
                >
                  <div className="edit-input-form">
                    <div className="edit-input-inner">
                      <form onSubmit={handleSubmit}>
                        <div className="edit-input-textarea-wrapper">
                          <textarea
                            ref={textareaRef}
                            rows="3"
                            value={input}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            className="edit-input-textarea"
                            placeholder="Enter instructions to revise the component"
                            onClick={handleClick}
                          />
                        </div>
                        <button type="submit" className="edit-input-submit" onClick={handleClick}>
                          Submit
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              );
            };

            const DraggableComponent = ({ children, code, onRevise }) => {
              const [selectedElement, setSelectedElement] = useState(null);
              const [inputPosition, setInputPosition] = useState({ top: 0, left: 0 });
              const [showInput, setShowInput] = useState(false);

              const handleDragStart = (e) => {
                e.dataTransfer.setData("text/plain", ${JSON.stringify(preprocessCode(code))});
              };

              useEffect(() => {
                const handleMouseOver = (e) => {
                  const hoveredElement = e.target.closest('[data-rs]');
                  if (hoveredElement && !hoveredElement.classList.contains('rp-selected')) {
                    hoveredElement.classList.add('rp-hovered');
                  }
                };

                const handleMouseOut = (e) => {
                  const hoveredElement = e.target.closest('[data-rs]');
                  if (hoveredElement) {
                    hoveredElement.classList.remove('rp-hovered');
                  }
                };

                const handleClick = (e) => {
                  if (e.target.closest('.edit-input-container')) {
                    return;
                  }

                  const clickedElement = e.target.closest('[data-rs]');

                  document.querySelectorAll('.rp-hovered').forEach(el => {
                    el.classList.remove('rp-hovered');
                  });

                  if (clickedElement) {
                    document.querySelectorAll('.rp-selected').forEach(el => {
                      el.classList.remove('rp-selected');
                    });
                    clickedElement.classList.add('rp-selected');
                    setSelectedElement(clickedElement);
                    const rect = clickedElement.getBoundingClientRect();
                    setInputPosition({ 
                      top: rect.bottom, 
                      left: Math.max(20, rect.left)
                    });
                    setShowInput(true);
                  } else {
                    document.querySelectorAll('.rp-selected').forEach(el => {
                      el.classList.remove('rp-selected');
                    });
                    setSelectedElement(null);
                    setShowInput(false);
                  }
                };

                document.addEventListener('mouseover', handleMouseOver);
                document.addEventListener('mouseout', handleMouseOut);
                document.addEventListener('click', handleClick);

                return () => {
                  document.removeEventListener('mouseover', handleMouseOver);
                  document.removeEventListener('mouseout', handleMouseOut);
                  document.removeEventListener('click', handleClick);
                };
              }, []);

              const handleInputSubmit = (prompt) => {
                onRevise(prompt);
              };

              return (
                <div
                  draggable
                  onDragStart={handleDragStart}
                  style={{ 
                    width: '100%',
                    height: '100%',
                    overflow: 'visible',
                    boxSizing: 'border-box'
                  }}
                >
                  {children}
                  {showInput && (
                    <EditInput
                      top={inputPosition.top}
                      left={inputPosition.left}
                      onSubmit={handleInputSubmit}
                      selectedElement={selectedElement}
                    />
                  )}
                </div>
              );
            };

            ${preprocessCode(code)}
            
            (function() {
              const componentName = Object.keys(window).find(key => 
                window[key] && 
                typeof window[key] === 'function' && 
                /^[A-Z]/.test(key) && 
                key !== 'React' &&
                key !== 'ReactDOM' &&
                key !== 'DraggableComponent' &&
                key !== 'EditInput'
              );
              console.log("componentName",componentName);
              
              if (componentName) {
                ReactDOM.render(
                  React.createElement(DraggableComponent, { 
                    code: ${JSON.stringify(code)},
                    onRevise: (prompt) => {
                      window.parent.postMessage({ type: 'reviseComponent', prompt }, '*');
                    }
                  }, 
                    React.createElement(window[componentName])
                  ), 
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

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'reviseComponent') {
        handleReviseComponent(event.data.prompt);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [code]);

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default DynamicPreview;