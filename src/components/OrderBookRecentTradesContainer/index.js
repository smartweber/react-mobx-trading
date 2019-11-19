import React from 'react';
import { STORE_KEYS } from '@/stores';
import { withOrderFormToggleData } from '@/hocs/OrderFormToggleData';
import LeftLowerSectionGrid from '@/grid/LeftLowerSectionGrid';
import CoinSelect from '@/components/CoinSelect';
import { AdvancedDropdownGrid, OrderBookWrapper } from './styles';
import OrderBook from '@/components/OrderBook';
import { MODE_KEYS } from '@/config/constants';

const OrderBookRecentTradesContainer = ({
  isUserDropDownOpen,
  isLoggedIn,
  selectedBase,
  selectedQuote,
  rightBottomSectionOpenMode
}) => {
  const isDepthChart = rightBottomSectionOpenMode === MODE_KEYS.depthChartKey;
  return (
    <AdvancedDropdownGrid isUserDropDownOpen={isUserDropDownOpen} isLoggedIn={isLoggedIn}>
      {isLoggedIn && <CoinSelect />}

      <OrderBookWrapper id="order-book-wrapper">
        {(!isLoggedIn || isDepthChart || (selectedBase && selectedQuote)) && <OrderBook />}
      </OrderBookWrapper>

      <LeftLowerSectionGrid />
    </AdvancedDropdownGrid>
  );
};

export default withOrderFormToggleData(stores => {
  const {
    [STORE_KEYS.TELEGRAMSTORE]: { isLoggedIn },
    [STORE_KEYS.VIEWMODESTORE]: { rightBottomSectionOpenMode }
  } = stores;
  return {
    isLoggedIn,
    rightBottomSectionOpenMode
  };
})(OrderBookRecentTradesContainer);
