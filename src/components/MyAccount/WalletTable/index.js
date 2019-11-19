import React, { Component } from 'react';
import { AutoSizer, Column, Table } from 'react-virtualized';
import { Tooltip } from 'react-tippy';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';
import { sortBy } from 'lodash';

import { STORE_KEYS } from '@/stores';
import { formatString, customDigitFormatWithNoTrim } from '@/utils';
import { currencySymbols } from '@/mock/currencies';
import CoinIcon from '@/components-generic/CoinIcon';
import AutoConvertSlider from '@/components/CoinSelect/AutoConvertSlider';
import {
  CellWrapper,
  SliderWrapper,
  Symbol,
  StyleWrapper,
  TooltipValue,
  TooltipWrapper,
  Wrapper,
  CoinWrapper,
  SliderTooltip
} from './styles';
import { viewModeKeys } from '@/stores/ViewModeStore';

class WalletTable extends Component {
  onChangeActiveCoin = symbol => {
    this.props.setActiveCoin(symbol);
    this.props.setHoverPortfolio(true);
  };

  onMouseLeave = () => {
    this.props.setActiveCoin('F:USD');
    this.props.setHoverPortfolio(false);
  };

  onRowsRendered = () => {
    const { setWalletDataLoadStatus } = this.props;
    setWalletDataLoadStatus(true);
  };

  onChange = val => {
    const { setBase, setViewMode } = this.props;
    setBase(val);
    setViewMode(viewModeKeys.basicModeKey);
  };

  onSelectItem = value => {
    const { setSelectedCoin, setStockMode } = this.props;

    let symbol = '';

    if (value && value.stock) {
      symbol = value.symbol;
      setStockMode(true);
    } else {
      symbol = value && value.fiat ? value.symbol : value;
      setStockMode(false);
    }

    this.onChange(symbol);
    setSelectedCoin(symbol);
  };

  onCellClick = data => () => {
    this.onSelectItem(data && (data.fiat || data.stock) ? data : data.symbol);
  };

  firstRenderer = ({ rowData }) => {
    const element = rowData;
    const cellValue = customDigitFormatWithNoTrim(element.position, 5);

    return (
      <CellWrapper>
        <CoinWrapper role="button" tabIndex="0" onClick={this.onCellClick(element)}>
          <CoinIcon value={element.symbol} size={37} />
        </CoinWrapper>
        <div className="amount">{cellValue}</div>
      </CellWrapper>
    );
  };

  secondRenderer = ({ rowData }) => {
    const element = rowData;
    const symbol = element.symbol.replace('F:', '').replace('S:', '');
    const cellValue = customDigitFormatWithNoTrim(element.usdRate, 5);
    const { initUSDRate, usdRate } = element;

    const rate = ((usdRate - initUSDRate) / usdRate) * 100;
    const rateString = formatString(Math.abs(rate), 2);
    return (
      <CellWrapper>
        <Symbol plus={rate >= 0}>
          1
          <div>
            <span className="symbol">{symbol}</span>
            {symbol !== 'USD' && symbol !== 'USDT' ? (
              <span className="rate">{rateString}%</span>
            ) : (
              <Tooltip arrow title="Not Applicable" position="bottom" theme="bct">
                NA
              </Tooltip>
            )}
          </div>
        </Symbol>
        <div className="equal">=</div>
        <div>${cellValue}</div>
      </CellWrapper>
    );
  };

  thirdRenderer = ({ rowData }) => {
    const element = rowData;
    const { totalUSDAmount } = this.props;
    let percentValue = (element.usdValue / totalUSDAmount) * 100;
    let integerValue = '';
    let decimalValue = '';
    if (percentValue < 10) {
      percentValue = percentValue.toFixed(1);
      integerValue = percentValue.split('.')[0];
      decimalValue = percentValue.split('.')[1];
      percentValue = (
        <div className="decimal-value">
          <span>{integerValue}</span>
          <span className="dot">.</span>
          <span>{decimalValue}</span>
        </div>
      );
    } else {
      percentValue = percentValue.toFixed(2).split('.')[0];
    }
    const symbolName = element.symbol.replace('F:', '').replace('S:', '');
    const symbol = currencySymbols[symbolName];
    const tooltipValue = {
      symbol: customDigitFormatWithNoTrim(element.position, 10),
      usd: customDigitFormatWithNoTrim(element.usdValue, 10),
      btc: customDigitFormatWithNoTrim(element.btcValue, 10)
    };
    const cellValue = customDigitFormatWithNoTrim(element.usdValue, 5);

    return (
      <CellWrapper isLastCell>
        <SliderWrapper>
          <SliderTooltip
            arrow
            html={
              <TooltipWrapper>
                {symbolName !== 'USD' && symbolName !== 'BTC' && (
                  <div>
                    <strong>{symbol}</strong>
                    <TooltipValue>{tooltipValue.symbol}</TooltipValue>
                    {symbolName}
                  </div>
                )}
                <div>
                  <strong>$</strong>
                  <TooltipValue>{tooltipValue.usd}</TooltipValue>
                  USD
                </div>
                <div>
                  <TooltipValue>{tooltipValue.btc}</TooltipValue>
                  BTC
                </div>
              </TooltipWrapper>
            }
            position="top"
            theme="bct"
          >
            ${cellValue}
          </SliderTooltip>
          <div className="equal">=</div>
          <div className="percent-value">{percentValue}%</div>

          <AutoConvertSlider
            coin={element.symbol}
            disabled={false}
            color={element.hex}
            handleTrading={this.handleTrading}
            isWallet={true}
          />
        </SliderWrapper>
      </CellWrapper>
    );
  };

  emptyRender = () => {
    return <CellWrapper />;
  };

  getRowData = index => {
    const { data } = this.props;
    const sortedData = this.sortData(data);

    if (index > sortedData.length - 1 && sortedData.length) {
      const empty_data = data[1];
      empty_data.type = null;
      return empty_data;
    }

    return sortedData[index];
  };

  sortData = data => {
    const { totalUSDAmount } = this.props;
    if (!data.length) {
      return null;
    }
    let sortedData = sortBy(data, item => (item.usdValue / totalUSDAmount) * 100).reverse();

    sortedData = sortedData.map(item => {
      if (!item.initUSDRate) item.initUSDRate = item.usdRate;

      return item;
    });

    return sortedData;
  };

  rowClassName = ({ index }) => {
    const { data, activeCoin, isHoverPortfolio } = this.props;
    if (!data.length) {
      return null;
    }

    const sortedData = this.sortData(data);
    if (index > -1) {
      if (isHoverPortfolio && sortedData[index].coin === activeCoin) {
        return 'hovering-item';
      }
      if (index === data.length - 1) {
        return 'last-item';
      }
    }
  };

  render() {
    const { data } = this.props;
    const emptyRowCount = 3 - data.length;
    const list = [{}, {}, {}];

    return (
      <Wrapper>
        <AutoSizer>
          {({ width, height }) => {
            const sectionHeight = height;
            const rowHeight = height / 3;
            const emptyTableHeight = rowHeight * emptyRowCount;
            const tableHeight = rowHeight * data.length;

            return (
              <StyleWrapper width={width} height={sectionHeight}>
                <PerfectScrollbar
                  options={{
                    suppressScrollX: true,
                    minScrollbarLength: 50
                  }}
                >
                  <Table
                    width={width}
                    height={tableHeight}
                    disableHeader={true}
                    rowCount={data.length}
                    rowGetter={({ index }) => this.getRowData(index)}
                    rowClassName={this.rowClassName}
                    rowHeight={rowHeight}
                    overscanRowCount={0}
                    onRowsRendered={this.onRowsRendered}
                    onRowMouseOver={({ rowData }) => this.onChangeActiveCoin(rowData.symbol)}
                    onRowMouseOut={() => this.onMouseLeave()}
                  >
                    <Column width={width * 0.3} dataKey="token" cellRenderer={this.firstRenderer} />
                    <Column width={width * 0.35} dataKey="amount" cellRenderer={this.secondRenderer} />
                    <Column width={width * 0.35} dataKey="price" cellRenderer={this.thirdRenderer} />
                  </Table>
                  {data.length < 3 && (
                    <Table
                      width={width}
                      height={emptyTableHeight}
                      disableHeader={true}
                      rowHeight={rowHeight}
                      rowCount={emptyRowCount}
                      rowGetter={({ index }) => list[index]}
                    >
                      <Column width={width / 3} dataKey="token" cellRenderer={this.emptyRender} />
                      <Column width={width / 3} dataKey="allocation" cellRenderer={this.emptyRender} />
                      <Column width={width / 3} dataKey="amount" cellRenderer={this.emptyRender} />
                    </Table>
                  )}
                </PerfectScrollbar>
              </StyleWrapper>
            );
          }}
        </AutoSizer>
      </Wrapper>
    );
  }
}

export default compose(
  inject(
    STORE_KEYS.PORTFOLIOSTORE,
    STORE_KEYS.CONVERSIONAUTOSTORE,
    STORE_KEYS.YOURACCOUNTSTORE,
    STORE_KEYS.FIATCURRENCYSTORE,
    STORE_KEYS.INSTRUMENTS,
    STORE_KEYS.VIEWMODESTORE
  ),
  observer,
  withProps(
    ({
      [STORE_KEYS.PORTFOLIOSTORE]: { data, totalUSDAmount, setWalletDataLoadStatus },
      [STORE_KEYS.CONVERSIONAUTOSTORE]: { setActiveCoin, setHoverPortfolio, activeCoin, isHoverPortfolio },
      [STORE_KEYS.YOURACCOUNTSTORE]: { setSelectedCoin },
      [STORE_KEYS.FIATCURRENCYSTORE]: { setStockMode },
      [STORE_KEYS.INSTRUMENTS]: { setBase },
      [STORE_KEYS.VIEWMODESTORE]: { setViewMode }
    }) => ({
      data,
      totalUSDAmount,
      setActiveCoin,
      setHoverPortfolio,
      activeCoin,
      isHoverPortfolio,
      setWalletDataLoadStatus,
      setSelectedCoin,
      setStockMode,
      setBase,
      setViewMode
    })
  )
)(WalletTable);
