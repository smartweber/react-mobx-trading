import styled from 'styled-components/macro';

export const ChipWrapper = styled.div`
  flex: 1;
  width: 100%;
  position: relative;
  margin-top: 12px;
  overflow: hidden;
  cursor: pointer;
  opacity: ${props => (props.disabled ? 0.7 : 1)};

  &:first-child {
    margin-top: 0;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(2, 5, 18, 0);
    transition: 0.2s;
  }

  ${props =>
    props.disabled
      ? `
      &::after {
          background-color: rgba(2, 5, 18, 0.7);
      }
  `
      : `
      &:hover {
          transition-duration: 0.3s;
          transform: scale(1.1);
          &::after {
              background-color: rgba(255, 0, 0, 0.3);
          }
      }
      &:active {
        @keyframes pulse {
          from { transform: scale(1); }
          50% { transform: scale(0.85); }
          to { transform: scale(1); }
        }
        
        animation-name: pulse;
        animation-duration: 0.1s;
        animation-iteration-count: 1;
      }`};
`;

export const ChipBGImg = styled.img`
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  object-fit: cover;
`;
