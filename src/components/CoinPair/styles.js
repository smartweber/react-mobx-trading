import styled from 'styled-components/macro';

export const StyledWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;

export const CoinItemWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-size: 13px;
  color: ${props => props.theme.palette.coinPairSelectText2};
  transition: all 0.1s;
  z-index: 8;

  .exch-dropdown__icon {
    pointer-events: none;
  }
  [role='button'] {
    cursor: pointer;
    .exch-dropdown__icon {
      pointer-events: auto;
    }
  }
`;

export const CurrencyName = styled.div`
  font-size: 2rem;
  font-weight: 700;
  font-family: Roboto;
  color: ${props => props.theme.palette.coinPairSelectText2};
  background: transparent;
  border: 0;
  padding: 0 12px;
`;

export const EqualSymbol = styled.div`
  height: 100%;
  font-size: 40px;
  font-weight: 700;
  color: ${props => props.theme.palette.clrBorder};
`;
