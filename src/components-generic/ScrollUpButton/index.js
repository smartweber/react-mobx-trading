import React from 'react';
import styled from 'styled-components/macro';

const ButtonWrapper = styled.div`
  position: absolute;
  right: 12px;
  bottom: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  color: #7f8bc2;
  background: rgba(13, 17, 43, 0.5);
  border: 1px solid #7f8bc2;
  border-radius: 5px;
  opacity: 1;
  transition: 0.3s;
  cursor: pointer;
  z-index: 100;

  &:hover {
    background: rgba(13, 17, 43, 1);
    color: #fff;
  }

  ${props => !props.isVisible && 'display: none;'}
`;

export default props => (
  <ButtonWrapper {...props}>
    <svg width="20" height="28" fill="currentColor">
      <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="img/sprite-basic.svg#arrow-up" />
    </svg>
  </ButtonWrapper>
);
