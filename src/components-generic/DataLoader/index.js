import React from 'react';
import styled, { keyframes } from 'styled-components/macro';

const keyFrameSpin = keyframes`
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
`;

const Loader = styled.div`
  position: absolute;
  left: ${props => (props.noCenter ? '25px' : `calc(50% - ${props.width ? props.width / 2 : 25}px)`)};
  top: calc(50% - ${props => (props.height ? props.height / 2 : 25)}px);
  z-index: 99999;
  width: ${props => (props.width ? props.width : 50)}px;
  height: ${props => (props.height ? props.height : 50)}px;
  display: block;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: ${props => (props.dark ? props.theme.palette.clrBackground : props.theme.palette.clrHighContrast)};
  animation: ${keyFrameSpin} 1s linear infinite;
`;

const DataLoader = ({ width, height, dark, noCenter }) => (
  <Loader width={width} height={height} dark={dark} noCenter={noCenter} />
);

export default DataLoader;
