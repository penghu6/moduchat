import React, { useState, useEffect, useRef } from 'react';
import '../../css/CodeEditorPreview.css';
import { componentToString, stringToComponent } from '../../utils/tools';
import { reviseComponent } from '../../api/open_ai';
import { useSelector, useDispatch } from 'react-redux';
import { updateCodeHandle } from '../../redux/chatSlice';
import { extractCodeBlocks ,preprocessCode} from '../../utils/utils';

// 错误边界组件，用于捕获渲染错误
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

function CodeEditorPreview({ isSmartEditMode }) {
  const [code, setCode] = useState('');
  const [smartEditMode, setSmartEditMode] = useState(false);
  const iframeRef = useRef(null);
  const dispatch = useDispatch();
  //代码信息
  const { codeComponent } = useSelector(state => state.chat);


  // 更新代码状态
  useEffect(() => {
    if (codeComponent) {
      let code=preprocessCode(codeComponent.js.toString());
      setCode(code);
    }
  }, [codeComponent]);

  // 更新智能编辑模式状态
  useEffect(() => {
    console.log('SmartEditMode in CodeEditorPreview:', isSmartEditMode);
    setSmartEditMode(isSmartEditMode);
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage({ type: 'updateSmartEditMode', value: isSmartEditMode }, '*');
    }
  }, [isSmartEditMode]);

 


  // 处理组件修订
  const handleReviseComponent = async (prompt) => {
    try {
      const revisedCode = await reviseComponent(prompt, code);
      console.log('Revised code:', revisedCode);
      //dispatch(setCode(revisedCode)); 
      const updatedCode = {
        js: revisedCode.toString()
    };
      dispatch(updateCodeHandle(updatedCode));
    } catch (error) {
      console.error('Error revising component:', error);
    }
  };

  // 更新 iframe 内容
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
          <script src="https://cdn.tailwindcss.com"></script>
          <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
          <script src="https://unpkg.com/lucide@latest"></script>
          <style>
            /* 样式定义 */
            :root {
              --rp-select-color: 210, 100%, 50%;
              --bd-dash-percent: 25%;
              --bd-border-width: 2px;
              --bd-gap-and-dash-length: 8px;
              --bd-speed: 0px;
            }

            /* 整个页面 (iframe) */
            body.rp-focus-enabled * {
              cursor: default !important;
              user-select: none !important;
            }

            /* 选中元素样式 */
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

            /* 悬停效果样式 */
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

            /* 编辑输入容器样式 */
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

            /* 添加自定义滚动条样式 */
            ::-webkit-scrollbar {
              width: 4px;
              height: 4px;
            }

            ::-webkit-scrollbar-track {
              background: rgba(0, 0, 0, 0.1);
              border-radius: 2px;
            }

            ::-webkit-scrollbar-thumb {
              background: rgba(0, 0, 0, 0.3);
              border-radius: 2px;
            }

            ::-webkit-scrollbar-thumb:hover {
              background: rgba(0, 0, 0, 0.5);
            }

            /* 确保内容可以滚动 */
            #root {
              height: 100%;
              overflow-y: auto;
            }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            const { useState, useEffect, useRef } = React;

            // 编辑输入组件
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

            // 可拖动组件
            const DraggableComponent = ({ children, code, onRevise, initialSmartEditMode }) => {
              const [smartEditMode, setSmartEditMode] = useState(initialSmartEditMode);
              const [selectedElement, setSelectedElement] = useState(null);
              const [inputPosition, setInputPosition] = useState({ top: 0, left: 0 });
              const [showInput, setShowInput] = useState(false);

              const handleDragStart = (e) => {
                e.dataTransfer.setData("text/plain", ${JSON.stringify(preprocessCode(code))});
              };

              useEffect(() => {
                const handleMessage = (event) => {
                  if (event.data.type === 'updateSmartEditMode') {
                    console.log('Received new smartEditMode:', event.data.value);
                    setSmartEditMode(event.data.value);
                  }
                };

                window.addEventListener('message', handleMessage);

                if (!smartEditMode) {
                  document.querySelectorAll('.rp-hovered, .rp-selected').forEach(el => {
                    el.classList.remove('rp-hovered', 'rp-selected');
                  });
                  setSelectedElement(null);
                  setShowInput(false);
                  return () => {
                    window.removeEventListener('message', handleMessage);
                  };
                }

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
                  window.removeEventListener('message', handleMessage);
                  document.removeEventListener('mouseover', handleMouseOver);
                  document.removeEventListener('mouseout', handleMouseOut);
                  document.removeEventListener('click', handleClick);
                };
              }, [smartEditMode]);

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
                  {showInput && smartEditMode && (
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
              const componentName = Object.keys(window).reverse().find(key => 
                window[key] && 
                typeof window[key] === 'function' && 
                /^[A-Z]/.test(key) && 
                key !== 'React' &&
                key !== 'ReactDOM' &&
                key !== 'DraggableComponent' &&
                key !== 'EditInput'
              );
              console.log("componentName", componentName);
        
              
              if (componentName) {
                ReactDOM.render(
                  React.createElement(DraggableComponent, { 
                    code: ${JSON.stringify(code)},
                    onRevise: (prompt) => {
                      window.parent.postMessage({ type: 'reviseComponent', prompt }, '*');
                    },
                    initialSmartEditMode: ${smartEditMode}
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

  // 监听消息事件
  useEffect(() => {
    if (iframeRef.current) {
      updateIframeContent();
    }
  }, [code, smartEditMode]);

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


export default CodeEditorPreview;