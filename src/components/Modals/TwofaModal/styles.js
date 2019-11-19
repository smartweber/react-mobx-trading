import styled from 'styled-components';

export const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 1000000;
  ${props => props.hoverMode && 'pointer-events: none;'}
  ${props => props.inLineMode && 'display:none;'}
`;

export const ModalWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 4000;
  background: rgba(0, 0, 0, 0.435);
  border-radius: ${props => props.theme.palette.borderRadius};
`;

export const ModalInnerWrapper = styled.div`
  position: relative;
`;

export const InnerWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 10px;
`;

export const TextTitle = styled.span`
  margin: 32px 0;
  width: 100%;
  text-align: center;
  color: ${props => props.theme.palette.clrHighContrast};
  font-size: 20px;
  font-weight: bold;
`;

export const ButtonWrappers = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 32px 0;

  button[disabled='disabled'],
  button:disabled {
    cursor: not-allowed;
    pointer-events: none;
    .gradient-button__content {
      background-color: ${props => props.theme.palette.clrOnBackDisabled};
    }
  }
`;
