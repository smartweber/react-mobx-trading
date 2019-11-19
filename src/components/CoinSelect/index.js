import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';

import { STORE_KEYS } from '@/stores';
import { viewModeKeys } from '@/stores/ViewModeStore';
import { donutChartModeStateKeys } from '@/stores/LowestExchangeStore';

import { MODE_KEYS } from '@/config/constants';
import CoinsList from '@/components/CoinSelect/CoinsList';
import { StyledWrapper } from './styles';

class CoinSelect extends Component {
  state = {
    isListOpen: false
  };

  componentDidUpdate() {
    const { donutChartStatus, resetDonutChartStatus, setExchange } = this.props;

    if (donutChartStatus === donutChartModeStateKeys.doneModeKey) {
      setExchange('Global');
      resetDonutChartStatus();
    }
  }

  closeList = () => {
    this.setState({ isListOpen: false });
  };

  openList = () => {
    this.setState({ isListOpen: true });
  };

  changedPositionOfUSDT = (items, isSort = false) => {
    if (!items.length) {
      return [];
    }

    const btcItem = items.find(x => x.symbol === 'BTC');
    const usdItem = items.find(x => x.symbol === 'F:USD');
    const coinItems = items.filter(x => x.symbol !== 'F:USD' && x.symbol !== 'BTC');

    if (usdItem) coinItems.unshift(usdItem);
    if (btcItem) coinItems.unshift(btcItem);

    if (isSort) {
      coinItems.sort((a, b) => {
        const maxSlide1 = this.props.slidersHash[a.symbol] ? this.props.slidersHash[a.symbol].maxSlider : 0;
        const amount1 = this.props.slidersHash[a.symbol] ? this.props.slidersHash[a.symbol].valueSlider : 0;
        const maxSlide2 = this.props.slidersHash[b.symbol] ? this.props.slidersHash[b.symbol].maxSlider : 0;
        const amount2 = this.props.slidersHash[b.symbol] ? this.props.slidersHash[b.symbol].valueSlider : 0;
        return amount2 / maxSlide2 - amount1 / maxSlide1;
      });
    }
    return coinItems;
  };

  handleDropdownChange = val => {
    const { setBase, setViewMode, setTradingViewMode, setArbMode } = this.props;
    if (val !== 'AUM') {
      setArbMode(false);
      setBase(val);
      setViewMode(viewModeKeys.basicModeKey);
      setTradingViewMode(false);
    }
  };

  render() {
    const { isListOpen } = this.state;
    const { baseCoins, portfolioData, isMyPortfolio } = this.props;
    return (
      <StyledWrapper>
        <CoinsList
          isOpen={isListOpen || isMyPortfolio}
          isMyPortfolio={isMyPortfolio}
          onChange={this.handleDropdownChange}
          mainItems={this.changedPositionOfUSDT(baseCoins)}
          topGroupItems={this.changedPositionOfUSDT(portfolioData, true)}
          openDropList={this.openList}
          closeDropList={this.closeList}
        />
      </StyledWrapper>
    );
  }
}

const enhanced = compose(
  inject(
    STORE_KEYS.INSTRUMENTS,
    STORE_KEYS.YOURACCOUNTSTORE,
    STORE_KEYS.LOWESTEXCHANGESTORE,
    STORE_KEYS.EXCHANGESSTORE,
    STORE_KEYS.VIEWMODESTORE,
    STORE_KEYS.PORTFOLIOSTORE,
    STORE_KEYS.AUTOSLIDERSTORE
  ),
  observer,
  withProps(props => {
    const {
      [STORE_KEYS.INSTRUMENTS]: { setBase, selectedBase },
      [STORE_KEYS.YOURACCOUNTSTORE]: { baseCoins, isAUMSelected },
      [STORE_KEYS.LOWESTEXCHANGESTORE]: { donutChartStatus, resetDonutChartStatus },
      [STORE_KEYS.EXCHANGESSTORE]: { setExchange },
      [STORE_KEYS.VIEWMODESTORE]: { setViewMode, setTradingViewMode, setArbMode, rightBottomSectionOpenMode },
      [STORE_KEYS.PORTFOLIOSTORE]: { data: portfolioData },
      [STORE_KEYS.AUTOSLIDERSTORE]: { slidersHash }
    } = props;
    return {
      setBase,
      selectedBase,
      donutChartStatus,
      resetDonutChartStatus,
      setExchange,
      setViewMode,
      setArbMode,
      setTradingViewMode,
      baseCoins,
      isAUMSelected,
      portfolioData,
      isMyPortfolio:
        rightBottomSectionOpenMode === MODE_KEYS.myPortfolioModeKey ||
        rightBottomSectionOpenMode === MODE_KEYS.coldStorage,
      slidersHash
    };
  })
);

export default enhanced(CoinSelect);
