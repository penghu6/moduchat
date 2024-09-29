import React from 'react';
import styled from 'styled-components';

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, 1fr);
  grid-gap: ${props => props.gap}px;
  padding: ${props => props.padding}px;
`;

const GridContainer = ({ children, columns = 3, gap = 16, padding = 16 }) => {
  return (
    <StyledGrid columns={columns} gap={gap} padding={padding}>
      {children}
    </StyledGrid>
  );
};

export default GridContainer;