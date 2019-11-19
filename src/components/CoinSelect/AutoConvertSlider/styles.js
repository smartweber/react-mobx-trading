import styled, { css } from 'styled-components/macro';
import { darkTheme } from '@/theme/core';

const { palette } = darkTheme;

export const TradeSlider = styled.div.attrs({ className: 'trade-slider' })`
  ${props =>
    props.isWallet
      ? css`
          position: absolute;
          bottom: -10px;
          left: 0;
          right: 0;
        `
      : css`
          width: 100%;
        `}

  .rc-slider {
    &.rc-slider-disabled {
      background-color: transparent;
    }
  }
`;

export const ProgressValue = styled.div`
  position: absolute;
  ${props =>
    props.isWallet
      ? `
    left: -50px;
  `
      : `
    right: 0px;  
  `};
  bottom: 3px;
  width: 15%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  color: black;
  z-index: 1;
  font-size: 14px;
  color: ${props => props.theme.palette.clrBorder};
`;

export const RailStyle = {
  default: {
    top: 6,
    height: 2,
    backgroundColor: palette.clrBorder
  },
  search: {
    top: 2,
    height: 4,
    backgroundColor: palette.clrBorder,
    borderRadius: 2
  },
  transparent: {
    top: 6,
    height: 2,
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  wallet: {
    top: 4,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)'
  }
};

const defaultHandleStyle = {
  top: 2,
  zIndex: 11,
  backgroundColor: 'white',
  border: `1px solid ${palette.clrBorder}`,
  boxShadow: '0 0 0 1px rgba(0, 0, 0, .5)'
};

export const HandleStyle = {
  hide: {
    display: 'none'
  },
  default: {
    top: 8,
    zIndex: 11,
    width: 8,
    height: 8,
    borderWidth: 0,
    borderRadius: 4,
    boxShadow: '0 0 0 1px rgba(0, 0, 0, .5)'
  },
  wallet: {
    top: 5,
    zIndex: 11,
    width: 8,
    height: 8,
    borderWidth: 0,
    borderRadius: 4,
    boxShadow: '0 0 0 1px rgba(0, 0, 0, .5)'
  },
  buy: {
    ...defaultHandleStyle
    // backgroundColor: palette.orderBookTableCellTextBuy
  },
  sell: {
    ...defaultHandleStyle
    // backgroundColor: palette.orderBookTableCellTextSell
  },
  hover: {
    top: 6,
    borderWidth: 0,
    height: 10,
    width: 10,
    borderRadius: 4,
    zIndex: 11
  },
  selected: {
    top: 2,
    backgroundColor: 'white',
    border: `1px solid ${palette.clrBorder}`,
    boxShadow: '0 0 0 1px rgba(0, 0, 0, .5)',
    // boxShadow: '0px 0px 0px 12px rgba(255, 255, 255, 0.16)',
    zIndex: 11
  }
};

export const TrackStyle = {
  default: {
    top: 2,
    height: 4,
    backgroundColor: palette.clrBorder
  },
  wallet: {
    top: 3,
    height: 2,
    backgroundColor: palette.clrBorder
  },
  buy: {
    top: 2,
    height: 4,
    backgroundColor: palette.orderBookTableCellTextBuy
  },
  sell: {
    top: 2,
    height: 4,
    backgroundColor: palette.orderBookTableCellTextSell
  }
};
