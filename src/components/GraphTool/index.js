import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';

import { STORE_KEYS } from '@/stores';
import { orderFormToggleKeys } from '@/stores/MarketMaker';
import ExchangesLabel from '@/components/OrderTabs/ExchangesLabel';
import PriceChartCanvas from './PriceChartCanvas';
import TradingView from './TradingView';
import { BGraph, BGraphControls } from './styles';

class GraphTool extends Component {
  componentDidUpdate() {
    const { isDepthChartLoaded, showOrderFormWith, isFirstLoad, setIsFirstLoad } = this.props;

    // show depthChart & advanced Orderform by default when page is loaded
    if (isDepthChartLoaded && isFirstLoad) {
      showOrderFormWith(orderFormToggleKeys.onToggleKey);
      setIsFirstLoad(false);
    }
  }

  render() {
    const { base, quote, rightBottomSectionFullScreenMode, isTradingView } = this.props;
    const baseSymbol = (base || '').replace('S:', '').replace('F:', '');
    const quoteSymbol = (quote || '').replace('S:', '').replace('F:', '');

    return (
      <BGraph id="graph-chart-parent">
        {!rightBottomSectionFullScreenMode && (
          <BGraphControls id="graph-chart-content">
            {!isTradingView && <PriceChartCanvas />}
            {isTradingView && (
              <TradingView coinPair={baseSymbol && quoteSymbol ? `${baseSymbol}-${quoteSymbol}` : 'BTC-USDT'} />
            )}
            <ExchangesLabel insideGraph />
          </BGraphControls>
        )}
      </BGraph>
    );
  }
}

export default compose(
  inject(STORE_KEYS.VIEWMODESTORE, STORE_KEYS.MARKETMAKER, STORE_KEYS.ORDERBOOKBREAKDOWN),
  observer,
  withProps(
    ({
      [STORE_KEYS.ORDERBOOKBREAKDOWN]: { isDepthChartLoaded, base, quote },
      [STORE_KEYS.VIEWMODESTORE]: { isFirstLoad, setIsFirstLoad, rightBottomSectionFullScreenMode },
      [STORE_KEYS.MARKETMAKER]: { showOrderFormWith }
    }) => ({
      base,
      quote,
      isDepthChartLoaded,
      isFirstLoad,
      setIsFirstLoad,
      showOrderFormWith,
      rightBottomSectionFullScreenMode
    })
  )
)(GraphTool);
