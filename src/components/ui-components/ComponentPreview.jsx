import React from 'react';
import { useSelector, useDispatch,useEffect, useState } from 'react-redux';
import { addComponent, removeComponent } from '../../redux/app-preview-slice';
import '../../css/ComponentPreview.css';
import { DeleteOutlined } from '@ant-design/icons';
import { compileComponent } from '../../utils/tools';
const AppPreview = () => {
  const components = useSelector(state => state.appPreview.components);
  const dispatch = useDispatch();

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const componentData = JSON.parse(e.dataTransfer.getData('customize-component')) ;
    console.log('Component to be added:', componentToAdd);
    return;
    const componentToAdd = {...componentData, component: componentData.component.toString().replace("function ", '')};
    console.log('Component to be added:', componentToAdd);
    dispatch(addComponent(componentToAdd));
    console.log('handleDrop completed');
  };

  const handleRemoveComponent = (index) => {
    dispatch(removeComponent(index));
  };

  const stringToFunction = (str) => {
    const functionBody = str.substring(str.indexOf('{') + 1, str.lastIndexOf('}'));
    return new Function(`return ${functionBody}`)();
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
          <div 
            className="phone-content"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {components.length > 0 ? (
              components.map((ComponentData, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  {typeof ComponentData.component === 'string'
                    ? React.createElement(ComponentData.component)
                    : React.createElement(ComponentData.component)}
                  <DeleteOutlined
                    onClick={() => handleRemoveComponent(index)}
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      color: 'rgba(255, 0, 0, 0.7)',
                      fontSize: '18px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'rgba(255, 0, 0, 0.9)'}
                    onMouseLeave={(e) => e.target.style.color = 'rgba(255, 0, 0, 0.7)'}
                  />
                </div>
              ))
            ) : (
              <div className="component-placeholder">
                拖动组件到这里
              </div>
            )}
          </div>
          <div className="phone-home-indicator"></div>
        </div>
      </div>
    </div>
  );
};

export default AppPreview;
