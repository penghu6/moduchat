import React, { useState, useEffect } from 'react';
import animationList from '../data/animationList';
import '../css/animation.css';

const Animation = () => {
  const [selectedAnimation, setSelectedAnimation] = useState('');
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (selectedAnimation) {
      setAnimating(true);
      const timer = setTimeout(() => {
        setAnimating(false);
      }, 1000); // 动画持续时间
      return () => clearTimeout(timer);
    }
  }, [selectedAnimation]);

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

export default Animation;
