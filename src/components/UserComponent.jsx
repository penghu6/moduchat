import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { compileComponent } from '../utils/tools';
import '../css/UserComponent.css';
import { Tooltip } from 'antd';
import { listUserComponents } from '../api/user_component';

const UserComponent = () => {
  const [componentList, setComponentList] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    // 调用后台接口获取用户组件列表
    listUserComponents()
      .then((response) => {
        // 假设后台返回的数据格式为 { data: [...] }
        setComponentList(response.data);
      })
      .catch((error) => {
        console.error('获取用户组件列表失败：', error);
      });
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragStart = (e, componentId) => {
    console.log('handleDragStart started', componentId);
    console.log('handleDragStart started', componentList);
    const component = componentList.find(c => c.id === componentId);
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
      setComponentList(prevComponents => {
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
        {componentList.map((component) => (
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

// 动态渲染组件的组件
const DynamicComponent = ({ code }) => {
  const Component = React.useMemo(() => {
    // 将字符串代码转换为可执行的 React 组件
    // 注意：这种方式存在安全风险，需确保代码可信
    try {
      const func = new Function('React', `return ${code}`)(React);
      return func;
    } catch (error) {
      console.error('组件解析出错：', error);
      return () => <div>组件加载失败</div>;
    }
  }, [code]);

  return <Component />;
};
