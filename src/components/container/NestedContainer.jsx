
import React from 'react';
import styled from 'styled-components';

const StyledNested = styled.div`
  display: ${props => props.display};
  flex-direction: ${props => props.direction};
  grid-template-columns: ${props => props.columns};
  gap: ${props => props.gap}px;
  padding: ${props => props.padding}px;
`;

//可嵌套容器,允许容器相互嵌套，以创建更复杂的布局。
const NestedContainer = ({
  children,
  type = 'flex',
  direction = 'column',
  columns = 'repeat(3, 1fr)',
  gap = 16,
  padding = 16
}) => {
  const display = type === 'flex' ? 'flex' : 'grid';
  
  return (
    <StyledNested
      display={display}
      direction={direction}
      columns={columns}
      gap={gap}
      padding={padding}
    >
      {children}
    </StyledNested>
  );
};

export default NestedContainer;