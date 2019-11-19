import styled from 'styled-components/macro';
import { Tooltip } from 'react-tippy';

export const Wrapper = styled.div`
  position: relative;
  height: 100%;
  flex: 1;
`;

export const StyleWrapper = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;

  .ps__thumb-y {
    opacity: 0 !important;
    z-index: 9999;
    cursor: pointer;
  }

  .ReactVirtualized__Table__Grid {
    overflow: visible !important;

    .ReactVirtualized__Grid__innerScrollContainer {
      overflow: visible !important;
    }
  }

  .ReactVirtualized__Table__headerRow {
    background-color: #0d112b;
    border-bottom: 1px solid #1e233e;

    .ReactVirtualized__Table__headerColumn {
      border-collapse: collapse;
      box-sizing: border-box;
      color: ${props => props.theme.palette.clrPurple};
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      text-transform: capitalize;
      height: 28px;
      z-index: 3;
      -webkit-border-horizontal-spacing: 2px;
      -webkit-border-vertical-spacing: 2px;
      white-space: nowrap;
    }
  }

  .ReactVirtualized__Table__rowColumn {
    height: 100%;
    margin-left: 0;
    margin-right: 0;
    text-overflow: inherit;
    overflow: initial !important;
  }

  .ReactVirtualized__Table__row {
    overflow: visible !important;
    pointer-events: none;

    .ReactVirtualized__Table__rowColumn {
      pointer-events: auto;
      &:last-child {
        margin-right: 0;
      }

      .bCQGbm {
      }
    }

    &:focus {
      outline: none;
    }
  }

  .ReactVirtualized__Table__Grid {
    box-shadow: 7px 6px 11px rgba(0, 0, 0, 0.05);
  }
`;

export const MainData = styled.div`
  .ReactVirtualized__Table__row {
    &.hovering-item,
    &:hover {
      background: ${props => props.theme.palette.coinPairDropDownItemHoverBg};
    }
  }
`;

export const CellWrapper = styled.div.attrs({ className: 'cell-wrapper' })`
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 12px;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
  color: ${props => props.theme.palette.clrPurple};
  border-bottom: 1px solid ${props => props.theme.palette.clrSubBorder};
  ${props => props.isLastCell && 'justify-content: flex-end;'}

  .equal {
    padding: 0 12px;
  }
  .amount {
    padding-left: 12px;
  }

  .percent-value {
    display: flex;

    .decimal-value {
      display: flex;
      align-items: center;
      .dot {
        font-size: 20px;
        padding-top: 14px;
        width: 1px;
        font-weight: bold;
      }
    }
  }
`;

export const SliderWrapper = styled.div`
  display: flex;
  position: relative;
  height: 100%;
  align-items: center;
  min-width: 278px;
`;

export const Symbol = styled.div`
  display: flex;
  align-items: center;
  min-width: 50px;

  > div {
    display: flex;
    flex-direction: column;
    font-size: 11px;
    line-height: 1.2;
    .symbol {
      color: #a349a3;
    }
    .rate {
      color: ${props =>
        props.plus ? props.theme.palette.exchBarItemPlusPrice : props.theme.palette.exchBarItemMinusPrice};
    }
  }
`;

export const SliderTooltip = styled(Tooltip)`
  min-width: 130px;
`;

export const TooltipWrapper = styled.div`
  text-align: right;
`;

export const TooltipValue = styled.span`
  margin: 0 3px 0 2px;
`;

export const TitleWrapper = styled.div`
  position: absolute;
  left: -1px;
  top: -32px;
  display: flex;
  width: 100%;
  height: 31px;
  font-size: 14px;
  font-weight: 500;
`;

export const Title = styled.div`
  flex: 1;
  padding: 10px;
  padding-top: 5px;
  text-align: left;
  color: ${props => props.theme.palette.clrPurple};
  border-left: 1px solid ${props => props.theme.palette.clrBorder};
`;

export const AllocationBar = styled.span`
  margin-left: 10px;
  height: 7px;
  border-radius: 5px;
`;

export const Suffix = styled.span`
  top: -3px;
  left: -2px;
  display: inline-block;
  position: relative;
  font-size: 9px;
`;

export const CoinWrapper = styled.div`
  border-radius: 50%;
  width: 37px;

  .exch-dropdown__icon {
    margin-right: 0;
  }

  &:hover {
    transition-duration: 0.3s;
    transform: scale(1.1);
  }
`;
