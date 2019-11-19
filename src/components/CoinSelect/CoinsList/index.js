import React, { Component, createRef } from 'react';
import { AutoSizer, Column, Table } from 'react-virtualized';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { Tooltip } from 'react-tippy';
import _differenceBy from 'lodash/differenceBy';

import { withSafeTimeout } from '@hocs/safe-timers';
import SettingsMenu from '@/components/SettingsMenu';
import CoinIcon from '@/components-generic/CoinIcon';
import ScrollUpButton from '@/components-generic/ScrollUpButton';
import {
  RightExchDropdownSearchIcon
  // SearchCloseIcon
} from '@/components-generic/SvgIcon';
import AutoConvertSlider from '../AutoConvertSlider';
import CoinName from '../CoinName';
import {
  Wrapper,
  ExchDropdownList,
  ItemButtonWrapper,
  NoMatch,
  RightExchDropdownWrapper,
  Search,
  SearchIconWrapper,
  // CloseIconWrapper,
  SelectedCoinWrapper,
  CoinDetailWrapper,
  SearchInput,
  StyleWrapper,
  PopoverWrapper,
  CoinsWrapper,
  Coins,
  CoinLabel,
  CoinWrapper,
  AmountLabel
} from './styles';
import { STORE_KEYS } from '@/stores';
import { MODE_KEYS } from '@/config/constants';
import { getTableItems } from './utils';

const ROW_HEIGHT = 62;

class CoinsList extends Component {
  state = {
    searchInputValue: '',
    storedInputValue: '',
    tableItems: [],
    isTableLoaded: false,
    scrollTop: 0,
    coinSymbolMaxLength: 4,
    isFilterOpened: false,
    selectedCoinData: undefined,
    isEditing: true,
    isTrading: false,
    isFocused: false,
    isOrderBookTimedOut: false
  };

  wrapperRef = createRef();
  searchInputRef = createRef();

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const newState = {
      timestamp: Date.now()
    };

    if (nextProps.isOrderBookTimedOut !== prevState.isOrderBookTimedOut && nextProps.isOrderBookTimedOut) {
      newState.searchInputValue = '';
      newState.storedInputValue = '';
      newState.isFocused = false;
      newState.isEditing = false;
      newState.isFilterOpened = false;
      newState.selectedCoinData = undefined;
      newState.isOrderBookTimedOut = true;
    }

    if (prevState.timestamp !== nextProps.timestamp) {
      newState.tableItems = getTableItems(nextProps, prevState);
    }

    return newState;
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
    if (this.clearScrollTopTimeout) {
      this.clearScrollTopTimeout();
    }
  }

  onChangeSearchInputValue = e => {
    const searchInputValue = e.target.value;
    const tableItems = getTableItems(this.props, { searchInputValue });

    this.setState(
      {
        searchInputValue,
        scrollTop: 0,
        tableItems,
        isFilterOpened: false
      },
      () => {
        if (searchInputValue && this.overscanStopIndex) {
          this.onRowsRendered({
            overscanStartIndex: this.overscanStartIndex,
            overscanStopIndex: this.overscanStopIndex
          });
        }
      }
    );

    if (this.scrollRef) {
      this.scrollRef.scrollTop = 0;
    }
  };

  onSelectItem = value => {
    const {
      setSelectedCoin,
      onChange,
      setStockMode,
      setRightBottomSectionOpenMode,
      setTradingViewMode,
      setArbMode
    } = this.props;

    let symbol = '';

    if (value && value.stock) {
      symbol = value.symbol;
      setStockMode(true);
    } else {
      symbol = value && value.fiat ? value.symbol : value;
      setStockMode(false);
    }

    onChange(symbol);

    this.setState({
      searchInputValue: '',
      storedInputValue: '',
      isOrderBookTimedOut: false
    });

    setSelectedCoin(symbol);
    this.setState({ isEditing: false });
    this.toggleDropdown();

    setRightBottomSectionOpenMode(MODE_KEYS.myPortfolioModeKey);
    setTradingViewMode(false);
    setArbMode(false);
  };

  handleScroll = ({ scrollTop }) => {
    this.setState({ scrollTop });
  };

  handleClickOutside = event => {
    if (this.props.isOpen && this.wrapperRef.current && !this.wrapperRef.current.contains(event.target)) {
      const qrCodePortal = document.getElementById('qr-code-portal');
      if (qrCodePortal && qrCodePortal.contains(event.target)) {
        return;
      }

      if (!this.props.isMyPortfolio) {
        this.toggleDropdown();
      }
    }
  };

  scrollTop = (duration = 300) => {
    if (duration > 0) {
      const difference = this.state.scrollTop;
      const perTick = (difference / duration) * 50;

      if (this.clearScrollTopTimeout) {
        this.clearScrollTopTimeout();
      }
      this.clearScrollTopTimeout = this.props.setSafeTimeout(() => {
        this.setState(prevState => ({ scrollTop: prevState.scrollTop - perTick }));
        if (this.scrollRef) {
          this.scrollRef.scrollTop = this.state.scrollTop;
        }

        this.scrollTop(duration - 10);
      }, 10);
    }
  };

  toggleDropdown = () => {
    const { setCoinListOpen, openDropList, closeDropList, isOpen } = this.props;

    setCoinListOpen(!isOpen);
    if (isOpen) {
      closeDropList();
    } else {
      openDropList();
    }

    if (isOpen) {
      if (this.scrollRef) {
        this.scrollRef.scrollTop = 0;
      }
      this.setState({
        scrollTop: 0
      });
    }

    this.closeFilterDropDown();
  };

  onMouseEnterItem = rowData => {
    const { setActiveCoin, setHoverPortfolio } = this.props;
    const symbol = rowData && rowData.symbol ? rowData.symbol : '';

    if (rowData.position > 0) {
      setActiveCoin(symbol);
      setHoverPortfolio(true);
    }
  };

  onMouseLeaveItem = () => {
    this.props.setActiveCoin('F:USD');
    this.props.setHoverPortfolio(false);
  };

  onCellClick = data => () => {
    this.setState({ selectedCoinData: data });
    this.onSelectItem(data && (data.fiat || data.stock) ? data : data.symbol);
  };

  cellRenderer = ({ /* rowIndex, */ rowData }) => {
    const { defaultFiat, selectedCoin } = this.props;
    const { searchInputValue, coinSymbolMaxLength, isFocused, selectedCoinData } = this.state;
    const { position, symbol, enabled } = rowData;
    if (!rowData) {
      return;
    }
    const className = `${!enabled ? 'disabled' : ''}`;
    const isReadableActive = position > 0.01;

    return (
      <ItemButtonWrapper
        className={className}
        isReadableActive={isReadableActive}
        selected={symbol === selectedCoin}
        isFocused={isFocused}
        selectedCoinData={selectedCoinData}
        onClick={this.onCellClick(rowData)}
      >
        <CoinIcon value={rowData} defaultFiat={defaultFiat} size={37} />
        <CoinName
          value={rowData}
          search={searchInputValue}
          defaultFiat={defaultFiat}
          coinSymbolMaxLength={coinSymbolMaxLength}
          noLeftPadding
        />
      </ItemButtonWrapper>
    );
  };

  onRowsRendered = ({ overscanStartIndex, overscanStopIndex }) => {
    // Save values to use when search changes
    this.overscanStartIndex = overscanStartIndex;
    this.overscanStopIndex = overscanStopIndex;

    const { tableItems } = this.state;

    const visibleItems = tableItems.slice(overscanStartIndex, overscanStopIndex + 1);
    const maxLength = visibleItems.reduce((maxLength, item) => {
      if (item && item.symbol && item.symbol.length > maxLength) {
        return item.symbol.length;
      }
      return maxLength;
    }, 0);

    this.setState({
      coinSymbolMaxLength: maxLength,
      isTableLoaded: true
    });
  };

  openFilterDropDown = () => {
    this.setState({ isFilterOpened: true });
  };

  closeFilterDropDown = () => {
    this.setState({ isFilterOpened: false });
  };

  clearSearchInput = () => {
    const { closeDropList } = this.props;
    closeDropList();
    this.setState({
      searchInputValue: '',
      isFocused: false,
      selectedCoinData: undefined
    });
  };

  hideCurrencyInfo = () => {
    this.setState({ isEditing: true });
    if (this.searchInputRef && this.searchInputRef.current) {
      this.searchInputRef.current.focus();
    }
    this.toggleDropdown();
  };

  onFocusInput = () => {
    const { openDropList } = this.props;
    const { storedInputValue } = this.state;
    openDropList();
    this.setState({
      isFocused: true,
      searchInputValue: storedInputValue
    });
  };

  onBlurInput = () => {
    const { closeDropList, rightBottomSectionOpenMode } = this.props;
    if (rightBottomSectionOpenMode !== MODE_KEYS.depthChartKey) {
      closeDropList();
    }

    setTimeout(() => {
      this.setState({
        isFocused: false
      });
    }, 300);
  };

  handleMouseLeaveSettings = e => {
    // IF related target is tooltip, it became window object otherwise it is dom element.
    if (e && e.relatedTarget !== window) {
      this.closeFilterDropDown();
    }
  };

  getCoinView = coin => {
    const { defaultFiat, coinsInMyWallet } = this.props;
    const isNonZero = coinsInMyWallet.filter(item => item.symbol === coin.symbol).length > 0;
    return (
      <Tooltip
        arrow
        animation="shift"
        position="top"
        theme="bct full-width"
        title={`${coin.symbol.replace('F:', '').replace('S:', '')} (${coin.name})`}
        key={coin.symbol}
      >
        <CoinWrapper size={43} onClick={this.onCellClick(coin)} isNonZero={isNonZero}>
          <CoinIcon value={coin} defaultFiat={defaultFiat} size={37} isNonZero={isNonZero} />
        </CoinWrapper>
      </Tooltip>
    );
  };

  getCoinList = (coins, label) => (
    <CoinsWrapper>
      <CoinLabel>{label}</CoinLabel>
      <Coins>{coins.slice(0, 8).map(this.getCoinView)}</Coins>
      <Coins>{coins.slice(8, 16).map(this.getCoinView)}</Coins>
    </CoinsWrapper>
  );

  getDropdownList = () => {
    const { searchInputValue, tableItems, scrollTop, isFocused, isTableLoaded } = this.state;
    const { isOpen, topCryptos, topFiats, topStocks, topBonds, coinsInMyWallet } = this.props;
    const filteredTableItems = isFocused && searchInputValue !== '' ? tableItems : [];

    const diffCryptos = _differenceBy(topCryptos, coinsInMyWallet, 'symbol');
    const diffFiats = _differenceBy(topFiats, coinsInMyWallet, 'symbol');
    const diffStocks = _differenceBy(topStocks, coinsInMyWallet, 'symbol');
    const diffBonds = _differenceBy(topBonds, coinsInMyWallet, 'symbol');

    const cryptos = _differenceBy(topCryptos, diffCryptos, 'symbol').concat(diffCryptos);
    const fiats = _differenceBy(topFiats, diffFiats, 'symbol').concat(diffFiats);
    const stocks = _differenceBy(topStocks, diffStocks, 'symbol').concat(diffStocks);
    const bonds = _differenceBy(topBonds, diffBonds, 'symbol').concat(diffBonds);

    return (
      <ExchDropdownList itemCount={filteredTableItems.length + 1} isSearching={searchInputValue} isOpen={isOpen}>
        <ScrollUpButton isVisible={isOpen && scrollTop > 1} onClick={() => this.scrollTop(300)} />
        <AutoSizer>
          {({ width, height }) => (
            <StyleWrapper width={width - 2} height={height - 2}>
              <PerfectScrollbar
                containerRef={ref => {
                  this.scrollRef = ref;
                }}
                options={{ suppressScrollX: true, minScrollbarLength: 50 }}
                onScrollY={this.handleScroll}
              >
                {isFocused && isTableLoaded && searchInputValue !== '' && filteredTableItems.length === 0 && (
                  <NoMatch>your search - {searchInputValue} - did not match any currencies</NoMatch>
                )}

                <Table
                  autoHeight={true}
                  width={width}
                  height={height}
                  headerHeight={0}
                  disableHeader={true}
                  rowCount={filteredTableItems.length}
                  rowGetter={({ index }) => filteredTableItems[index]}
                  rowHeight={ROW_HEIGHT}
                  overscanRowCount={0}
                  id="wallet-table"
                  scrollTop={scrollTop}
                  onRowsRendered={this.onRowsRendered}
                  onRowMouseOver={({ rowData }) => this.onMouseEnterItem(rowData)}
                  onRowMouseOut={() => this.onMouseLeaveItem()}
                >
                  <Column dataKey="name" width={width} cellRenderer={this.cellRenderer} />
                </Table>

                {!(isFocused && searchInputValue !== '') && (
                  <>
                    {cryptos.length > 0 && this.getCoinList(cryptos, 'Coins')}
                    {fiats.length > 0 && this.getCoinList(fiats, 'Forex')}
                    {stocks.length > 0 && this.getCoinList(stocks, 'Stocks')}
                    {bonds.length > 0 && this.getCoinList(bonds, 'Bonds')}
                  </>
                )}
              </PerfectScrollbar>
            </StyleWrapper>
          )}
        </AutoSizer>
      </ExchDropdownList>
    );
  };

  handleTrading = isTrading => {
    this.setState({ isTrading });
  };

  getSearchInput = () => {
    const { searchInputValue, isFilterOpened, selectedCoinData, isEditing, isTrading, isFocused } = this.state;
    const { slidersHash, arbMode, totalUSDAmount } = this.props;
    const coinSymbol = selectedCoinData ? selectedCoinData.symbol.replace('F:', '').replace('S:', '') : '';
    const coinName = selectedCoinData ? selectedCoinData.name : '';

    const coin = selectedCoinData ? selectedCoinData.symbol : '';
    // const amount = slidersHash[coin] ? slidersHash[coin].valueSlider : 0;
    const isMaxSlider =
      slidersHash[coin] && Number.parseFloat(slidersHash[coin].maxSlider - slidersHash[coin].valueSlider) < 0.0001;
    const total = isMaxSlider
      ? totalUSDAmount
      : slidersHash[coin]
      ? slidersHash[coin].valueSlider * slidersHash[coin].price
      : 0;

    return (
      <Search onMouseLeave={this.handleMouseLeaveSettings}>
        {selectedCoinData && !isEditing && (
          <SelectedCoinWrapper>
            <CoinDetailWrapper onClick={this.hideCurrencyInfo}>
              <span className="coin-symbol">{coinSymbol}</span>
              {!isTrading && <span className="coin-name">{coinName}</span>}
            </CoinDetailWrapper>
            {!arbMode && (
              <AutoConvertSlider
                coin={coin}
                disabled={false}
                color={selectedCoinData.hex}
                handleTrading={this.handleTrading}
              />
            )}
          </SelectedCoinWrapper>
        )}

        <SearchInput
          id="search-input"
          type="text"
          value={searchInputValue}
          onChange={this.onChangeSearchInputValue}
          onFocus={this.onFocusInput}
          onBlur={this.onBlurInput}
          ref={this.searchInputRef}
          isFocused={isFocused}
          placeholder="Search all exchanges"
          onMouseEnter={this.closeFilterDropDown}
        />

        {isTrading && <AmountLabel>$&nbsp;{total.toFixed(2)}</AmountLabel>}

        <SearchIconWrapper>
          {!isTrading && (
            <RightExchDropdownWrapper onMouseEnter={this.openFilterDropDown}>
              <RightExchDropdownSearchIcon />
            </RightExchDropdownWrapper>
          )}
          <PopoverWrapper isOpen={isFilterOpened}>
            <SettingsMenu onClose={this.closeFilterDropDown} isOpen={isFilterOpened} />
          </PopoverWrapper>
        </SearchIconWrapper>

        {/* {(selectedCoinData || isFocused) && !isTrading && (
          <CloseIconWrapper
            onClick={() => this.clearSearchInput()}
            isEmpty={(amount === 0 && selectedCoinData) || isFocused}
          >
            <SearchCloseIcon />
          </CloseIconWrapper>
        )} */}
      </Search>
    );
  };

  render() {
    return (
      <Wrapper ref={this.wrapperRef}>
        {this.getSearchInput()}
        {this.getDropdownList()}
      </Wrapper>
    );
  }
}

const enhanced = compose(
  withSafeTimeout,
  inject(
    STORE_KEYS.SETTINGSSTORE,
    STORE_KEYS.VIEWMODESTORE,
    STORE_KEYS.FIATCURRENCYSTORE,
    STORE_KEYS.YOURACCOUNTSTORE,
    STORE_KEYS.TRADINGVIEWSTORE,
    STORE_KEYS.AUTOSLIDERSTORE,
    STORE_KEYS.CONVERSIONAUTOSTORE,
    STORE_KEYS.INSTRUMENTS,
    STORE_KEYS.ORDERBOOKBREAKDOWN,
    STORE_KEYS.PORTFOLIOSTORE
  ),
  observer,
  withProps(
    ({
      [STORE_KEYS.SETTINGSSTORE]: { defaultFiat, isShortSell },
      [STORE_KEYS.VIEWMODESTORE]: {
        setLogoutModalOpen,
        arbMode,
        rightBottomSectionOpenMode,
        setArbMode,
        setRightBottomSectionOpenMode,
        setTradingViewMode
      },
      [STORE_KEYS.FIATCURRENCYSTORE]: { setStockMode },
      [STORE_KEYS.YOURACCOUNTSTORE]: { setSelectedCoin, selectedCoin, coinsInMyWallet },
      [STORE_KEYS.TRADINGVIEWSTORE]: { setCoinListOpen },
      [STORE_KEYS.AUTOSLIDERSTORE]: { slidersHash },
      [STORE_KEYS.CONVERSIONAUTOSTORE]: { setActiveCoin, setHoverPortfolio },
      [STORE_KEYS.INSTRUMENTS]: { selectedBase, selectedQuote, topCryptos, topFiats, topStocks, topBonds },
      [STORE_KEYS.ORDERBOOKBREAKDOWN]: { bids, asks, isOrderBookTimedOut },
      [STORE_KEYS.PORTFOLIOSTORE]: { totalUSDAmount }
    }) => ({
      setStockMode,
      setSelectedCoin,
      selectedCoin,
      coinsInMyWallet,
      setCoinListOpen,
      defaultFiat,
      isShortSell,
      rightBottomSectionOpenMode,
      setActiveCoin,
      setHoverPortfolio,
      setLogoutModalOpen,
      arbMode,
      slidersHash,
      selectedBase,
      selectedQuote,
      bids,
      asks,
      isOrderBookTimedOut,
      topCryptos,
      topFiats,
      topStocks,
      topBonds,
      setArbMode,
      setRightBottomSectionOpenMode,
      setTradingViewMode,
      totalUSDAmount
    })
  )
);
export default enhanced(CoinsList);
