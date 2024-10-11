import React, { useState, useEffect } from 'react';
import animationList from '../data/animationList';
import '../css/AnimationSelector.css';

const AnimationSelector = () => {
  // 选中的动画名称
  const [selectedAnimation, setSelectedAnimation] = useState('');
  // 动画状态
  const [animating, setAnimating] = useState(false);

  // 监听选中动画的变化，触发动画效果
  useEffect(() => {
    if (selectedAnimation) {
      setAnimating(true);
      const timer = setTimeout(() => {
        setAnimating(false);
      }, 1000); // 动画持续时间为 1000 毫秒
      return () => clearTimeout(timer); // 清除定时器
    }
  }, [selectedAnimation]);

  // 渲染单个动画项
  const renderAnimationItem = (item) => (
    <div 
      key={item.value} 
      className={`animate-item ${animating && selectedAnimation === item.value ? item.value : ''}`}
      onClick={() => setSelectedAnimation(item.value)}
    >
      {item.label}
    </div>
  );

  return (
    <div className="animation-outer-container">
      <div className="animation-inner-container">
        {animationList.map((category) => (
          <div key={category.label} className="animation-category">
            <h3>{category.label}</h3>
            <div className="animation-list">
              {category.children.map(renderAnimationItem)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimationSelector;
