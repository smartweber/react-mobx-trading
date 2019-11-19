import styled from 'styled-components';

export const OuterWrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.palette.clrMainWindow};
  color: ${props => props.theme.palette.clrHighContrast};
  border-radius: ${props => props.theme.palette.borderRadius};
  font-size: 20px;
  box-shadow: 0 3px 10px 5px rgba(0, 0, 0, 0.52);

  #client-snackbar {
    display: flex;
    align-items: center;

    svg {
      opacity: 0.9;
      margin-right: 8px;
    }
  }

  .error {
    background: #d32f2f;
    color: white;
  }

  .success {
    background: #43a047;
    color: white;
  }
`;

export const SpinnerWrapper = styled.div`
  position: relative;
  height: 80px;
`;

export const TextDescription = styled.span`
  margin: 32px 0;
  width: 100%;
  text-align: center;
  color: ${props => props.theme.palette.clrHighContrast};
  font-size: 20px;
  font-weight: bold;
`;
