import React from 'react';
import * as Babel from '@babel/standalone';

/**
 * 将 JSON 数据存储到本地存储
 * @param {string} key - 存储的键名
 * @param {any} value - 要存储的值（将被转换为 JSON）
 */
export const setItem = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * 从本地存储中检索 JSON 数据
 * @param {string} key - 要检索的键名
 * @param {any} defaultValue - 如果键不存在时返回的默认值
 * @returns {any} 解析后的值，如果解析失败则返回默认值
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return defaultValue;
    }
    return JSON.parse(serializedValue);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

/**
 * 从本地存储中移除指定的项
 * @param {string} key - 要移除的键名
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing item from localStorage:', error);
  }
};

/**
 * 清除所有本地存储的数据
 */
export const clear = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * 获取本地存储中的所有键
 * @returns {string[]} 键名数组
 */
export const getAllKeys = () => {
  try {
    return Object.keys(localStorage);
  } catch (error) {
    console.error('Error getting keys from localStorage:', error);
    return [];
  }
};

/**
 * 动态编译 React 组件代码
 * @param {string} code - 要编译的组件代码
 * @param {Object} React - React 对象
 * @returns {Function|null} 编译后的组件函数，如果编译失败则返回 null
 */
export const compileComponent = (code) => {
  try {
    // 如果 code 不是字符串，尝试将其转换为字符串
    if (typeof code !== 'string') {
      code = code.toString();
    }

    // 使用模板生成代码（如果需要）
    if (code.trim() === '') {
      code = generateComponentCode();
    }

    // 使用 Babel 转换代码
    const transformedCode = Babel.transform(code, {
      presets: ['react'],
      plugins: ['transform-modules-commonjs']
    }).code;

    // 移除 import 和 export 语句
    const codeWithoutImportExport = transformedCode
      .replace(/import\s+.*?from\s+['"].*?['"];?/g, '')
      .replace(/export\s+default\s+\w+;?/, '');

    // 提取组件名称
    const componentNameMatch = code.match(/(?:function|const)\s+(\w+)\s*(?:=|\()/);
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

/**
 * 生成动态组件代码
 * @param {string} prompt - 用于生成组件的提示词
 * @returns {string} 生成的组件代码
 */
export const generateComponentCode = () => {
  const template = `

const HelloWorld = () => {
  const style = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '680px',
    width: '100vw',
    fontSize: '30px',
    backgroundColor: '#f2f2f2'
  };

  return (
    <div style={style}>
      Hello World
    </div>
  );
};

`;
  return template;
};

// 将组件转换为字符串
export const componentToString = (component) => {
  console.log("组件类型:", typeof component);
  if (typeof component === 'string') {
    return component;
  }
  let str = component.toString();
  console.log("将组件转换为字符串:", str);
  return str;
};

// 将字符串转换回组件
export const stringToComponent = (str) => {
  // 移除可能存在的 "function" 关键字
  const cleanStr = str.replace(/^function\s*/, '');
  
  // 使用 Function 构造函数创建新的函数
  const ComponentFunction = new Function(`
    return (${cleanStr})
  `)();

  // 返回一个 React 组件
  return (props) => React.createElement(ComponentFunction, props);
};



