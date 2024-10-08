import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { compileComponent } from '../utils/tools';
import '../css/user-component.css';
import { Tooltip } from 'antd';

const componentList = [
  {
    id: 1,
    name: 'HelloWorld',
    component: () => (
      <div style={{ color: 'red', textAlign: 'center', fontSize: '18px' }}>
        Hello World
      </div> 
    ) 
  },
  {
    id: 2,
    name: 'Button',
    component: () => (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%', 
        height: '100%' 
      }}>
        <button style={{ 
          padding: '10px 20px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px' 
        }}>
          Click me
        </button>
      </div>
    )
  },
  {
    id: 3,
    name: 'Card',
    component: () => (
      <div style={{ 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        padding: '15px', 
        maxWidth: '200px',
        margin: '5px auto',
        textAlign: 'center'
      }}>
        <h3 style={{ marginTop: 0 }}>Card Title</h3>
        <p>This is a sample card component with some content.</p>
      </div>
    )
  },
  {
    id: 4,
    name: 'ImageGrid',
    component: () => {
      const imageUrl = 'https://cdn.pixabay.com/photo/2015/09/09/02/03/clock-931027_640.jpg';
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '200px'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '10px' 
          }}>
            {[...Array(4)].map((_, index) => (
              <img 
                key={index} 
                src={imageUrl} 
                alt={`img-${index}`} 
                style={{ 
                  width: '50px',
                  height: '50px',
                  objectFit: 'cover' 
                }} 
              />
            ))}
          </div>
        </div>
      );
    }
  },
  {
    id: 5,
    name: 'ProductCard',
    component: () => (
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        maxWidth: '250px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <img 
          src="https://cdn.pixabay.com/photo/2015/09/09/02/03/clock-931027_640.jpg" 
          alt="便携式充电器"
          style={{
            width: '100%',
            height: '150px',
            objectFit: 'cover',
            borderRadius: '4px'
          }}
        />
        <div style={{ marginTop: '10px' }}>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>便携式充电器(内置线缆)</h3>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <span style={{ color: '#ffa41c' }}>★★★★☆</span>
            <span style={{ fontSize: '12px', color: '#666', marginLeft: '5px' }}>(3200)</span>
          </div>
          <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>¥29.99</p>
          <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>免费配送 8月2日(周五)前</p>
        </div>
        <button style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: '#007bff',
          color: 'white',
          fontSize: '20px',
          cursor: 'pointer'
        }}>+</button>
      </div>
    )
  },
  {
    id: 6,
    name: 'SeeMoreButton',
    component: () => (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px'
      }}>
        <button style={{
          width: '328px',
          padding: '10px 20px',
          backgroundColor: '#f0f0f0',
          border: 'none',
          borderRadius: '20px',
          fontSize: '14px',
          color: '#333',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          transition: 'background-color 0.3s ease',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          See more
        </button>
      </div>
    )
  },
];

const UserComponent = () => {
  const [components, setComponents] = useState(componentList);
  const dispatch = useDispatch();

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragStart = (e, componentId) => {
    console.log('handleDragStart started', componentId);
    console.log('handleDragStart started', components);
    const component = components.find(c => c.id === componentId);
    if (!component) return;

    const componentData = {
      id: component.id,
      name: component.name,
      component: component.component
    };

    e.dataTransfer.setData('customize-component', JSON.stringify(componentData));
  };

  const handleDrop = (e) => {
    const codeData = e.dataTransfer.getData('text/plain');
   
    let newComponentCode;
    
    try {
      newComponentCode = JSON.parse(codeData);
    } catch (error) {
      newComponentCode = codeData; 
    }

    // 使用 compileComponent 函数编译组件代码
    const AnonymousComponent = compileComponent(newComponentCode);

    if (AnonymousComponent) {
      setComponents(prevComponents => {
        const newId = Math.max(...prevComponents.map(c => c.id), 0) + 1;
        const updatedComponents = [{
          id: newId,
          name: AnonymousComponent.name || `Component${newId}`,
          component: AnonymousComponent
        }, ...prevComponents];

        console.log('更新后的组件列表:', updatedComponents);
        return updatedComponents;
      });

      console.log('新组件已添加', AnonymousComponent.name);
    } else {
      console.error('组件编译失败');
    }
  };

  return (
    <div className="right-container" onDrop={handleDrop} onDragOver={handleDragOver}>
      <div className="component-list">
        {components.map((component) => (
          <Tooltip key={component.id} title={component.name} placement="top">
            <div
              className="component-item"
              draggable
              
              onDragStart={(e) => handleDragStart(e, component.id)}
            >
              <div className="component-preview">
                {React.createElement(component.component)}
              </div>
            </div>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default UserComponent;
