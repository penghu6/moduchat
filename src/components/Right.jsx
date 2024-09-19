import React, { useState, useRef } from 'react';
import '../css/Right.css';

const componentList = [
  {
    name: 'HelloWorld',
    component: () => (
      <div style={{ color: 'red', textAlign: 'center', fontSize: '18px' }}>
        Hello World
      </div>
    )
  },
  {
    name: 'Button',
    component: () => (
      <button style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
        Click me
      </button>
    )
  },
  {
    name: 'Card',
    component: () => (
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', maxWidth: '200px' }}>
        <h3 style={{ marginTop: 0 }}>Card Title</h3>
        <p>This is a sample card component with some content.</p>
      </div>
    )
  },
  {
    name: 'ImageGrid',
    component: () => {
      const imageUrl = 'https://cdn.pixabay.com/photo/2015/09/09/02/03/clock-931027_640.jpg';
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '200px' // 调整高度以适应预览
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
                  width: '50px', // 调整大小以适应预览
                  height: '50px', // 调整大小以适应预览
                  objectFit: 'cover' 
                }} 
              />
            ))}
          </div>
        </div>
      );
    }
  },{
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
  }
];

const Right = () => {
  const [components, setComponents] = useState(componentList);
  const dragItem = useRef();
  const dragOverItem = useRef();

  const handleDragStart = (e, position) => {
    dragItem.current = position;
    e.target.classList.add('dragging');
  };

  const handleDragEnter = (e, position) => {
    dragOverItem.current = position;
    e.target.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.target.classList.remove('drag-over');
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
  };

  const handleDrop = (e) => {
    const copyListItems = [...components];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setComponents(copyListItems);
    e.target.classList.remove('drag-over');
  };

  return (
    <div className="right-container">
      <h2>组件预览列表</h2>
      <div className="component-list">
        {components.map((component, index) => (
          <div
            key={index}
            className="component-item"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragLeave={handleDragLeave}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="component-preview">
              {React.createElement(component.component)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Right;