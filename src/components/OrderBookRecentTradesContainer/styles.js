import styled from 'styled-components/macro';

export const AdvancedDropdownGrid = styled.div`
  position: relative;
  height: 100%;
  display: grid;
  grid-template-areas: ${props => {
    const top = props.isLoggedIn ? '"walletheader"' : '';
    const mid = '"ordercontent"';
    const bottom = props.lowerSectionClosed ? '' : '"leftlowersection"';
    return `${top} ${mid} ${bottom}`;
  }};
  grid-template-rows: ${props => {
    const top = props.isLoggedIn ? '60px' : '';
    const mid = 'auto';
    const bottom = props.lowerSectionClosed ? '' : props.theme.palette.lowerSectionHeight;

    return `${top} ${mid} ${bottom}`;
  }};
  grid-template-columns: 100%;
  grid-gap: 12px;
`;

export const OrderBookWrapper = styled.div.attrs({ className: 'order-book-wrapper' })`
  position: relative;
  grid-area: ordercontent;
  border: 1px solid ${props => props.theme.palette.clrBorder};
  border-radius: ${props => `${props.theme.palette.borderRadius}`};
  overflow: hidden;

  .wallet-header {
    border-top: 0 !important;
    border-left: 0 !important;
    border-right: 0 !important;
  }
`;
