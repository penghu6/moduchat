import React from 'react';
import styled from 'styled-components';

const StyledFlex = styled.div`
  display: flex;
  flex-direction: ${props => props.direction};
  justify-content: ${props => props.justify};
  align-items: ${props => props.align};
  flex-wrap: ${props => props.wrap};
  gap: ${props => props.gap}px;
  padding: ${props => props.padding}px;
`;

const FlexContainer = ({
  children,
  direction = 'row',
  justify = 'flex-start',
  align = 'stretch',
  wrap = 'nowrap',
  gap = 16,
  padding = 16
}) => {
  return (
    <StyledFlex
      direction={direction}
      justify={justify}
      align={align}
      wrap={wrap}
      gap={gap}
      padding={padding}
    >
      {children}
    </StyledFlex>
  );
};

export default FlexContainer;