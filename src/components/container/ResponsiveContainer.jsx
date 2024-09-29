import React from 'react';
import styled from 'styled-components';


const StyledResponsive = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${props => props.minWidth}px, 1fr));
  grid-gap: ${props => props.gap}px;
  padding: ${props => props.padding}px;
`;

//响应式容器
const ResponsiveContainer = ({ children, minWidth = 300, gap = 16, padding = 16 }) => {
  return (
    <StyledResponsive minWidth={minWidth} gap={gap} padding={padding}>
      {children}
    </StyledResponsive>
  );
};

export default ResponsiveContainer;