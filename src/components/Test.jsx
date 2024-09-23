import React, { useState, useEffect, useCallback, useMemo, useRef, useReducer, useContext } from 'react';
import * as Babel from '@babel/standalone';

// 模拟 AI 生成命名式组件代码的函数
const generateComponentCode = () => {
  const componentName = `SnakeGame${Math.floor(Math.random() * 1000)}`;
  return `
import React, { useState, useEffect } from 'react';

const ${componentName} = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [speed, setSpeed] = useState(200);

  useEffect(() => {
    const changeDirection = (e) => {
      if (e.key === 'ArrowUp' && direction.y === 0) setDirection({ x: 0, y: -1 });
      if (e.key === 'ArrowDown' && direction.y === 0) setDirection({ x: 0, y: 1 });
      if (e.key === 'ArrowLeft' && direction.x === 0) setDirection({ x: -1, y: 0 });
      if (e.key === 'ArrowRight' && direction.x === 0) setDirection({ x: 1, y: 0 });
    };

    document.addEventListener('keydown', changeDirection);
    const gameInterval = setInterval(moveSnake, speed);

    return () => {
      document.removeEventListener('keydown', changeDirection);
      clearInterval(gameInterval);
    }
  }, [direction, speed]);

  const moveSnake = () => {
    const newSnake = JSON.parse(JSON.stringify(snake));
    const head = newSnake[0];
    const newHead = { x: head.x + direction.x, y: head.y + direction.y };

    newSnake.unshift(newHead);
    
    if (newHead.x === food.x && newHead.y === food.y) {
      setFood({
        x: Math.floor(Math.random() * 30),
        y: Math.floor(Math.random() * 30),
      });
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);

    if (newHead.x < 0 || newHead.x >= 30 || newHead.y < 0 || newHead.y >= 30 ||
      newSnake.slice(1).some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      setSnake([{ x: 10, y: 10 }]);
      setDirection({ x: 1, y: 0 });
    }
  }

  return (
    <div className="relative w-[320px] h-[584px] bg-gray-800">
      {snake.map((segment, index) => (
        <div
          key={index}
          className="absolute bg-green-500"
          style={{
            left: segment.x * 2 + '%',
            top: segment.y * 2 + '%',
            width: '2%',
            height: '2%',
          }}
        />
      ))}
      <div
        className="absolute bg-red-500"
        style={{
          left: food.x * 2 + '%',
          top: food.y * 2 + '%',
          width: '2%',
          height: '2%',
        }}
      />
    </div>
  );
};

export default ${componentName};
  `;
};

// 编译组件代码的函数
const compileComponent = (code) => {
  try {
    // 使用 Babel 转换代码
    const transformedCode = Babel.transform(code, {
      presets: ['react'],
    }).code;

    // 移除 import 和 export 语句
    const codeWithoutImportExport = transformedCode
      .replace(/import\s+.*?from\s+['"].*?['"];?/g, '')
      .replace(/export\s+default\s+\w+;?/, '');

    // 提取组件名称
    const componentNameMatch = code.match(/const\s+(\w+)\s*=/);
    const componentName = componentNameMatch ? componentNameMatch[1] : 'AnonymousComponent';

    // 使用 Function 构造函数动态创建组件
    const ComponentFunction = new Function('React', `
      const { useState, useEffect, useCallback, useMemo, useRef, useReducer, useContext } = React;
      ${codeWithoutImportExport}
      return ${componentName};
    `);
    
    return ComponentFunction(React);
  } catch (error) {
    console.error('编译组件时出错:', error);
    return null;
  }
};

const Test = () => {
  const [components, setComponents] = useState([]);

  useEffect(() => {
    generateNewComponent();
  }, []);

  const generateNewComponent = () => {
    const componentCode = generateComponentCode();
    const CompiledComponent = compileComponent(componentCode);
    console.log("CompiledComponent", CompiledComponent);
    if (CompiledComponent) {
      setComponents(prevComponents => [...prevComponents, CompiledComponent]);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>动态命名组件测试</h1>
      <button onClick={generateNewComponent} style={{ marginBottom: '20px' }}>
        生成新组件
      </button>
      {components.map((Component, index) => (
        <Component key={index} />
      ))}
    </div>
  );
};

export default Test;