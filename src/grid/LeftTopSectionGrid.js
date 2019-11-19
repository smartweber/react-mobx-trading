import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';

import { STORE_KEYS } from '@/stores';
import OrderBookRecentTradesContainer from '@/components/OrderBookRecentTradesContainer';
import { StyledLeftTopSectionGrid } from './styles';

const LeftTopSectionGrid = ({
  isUserDropDownOpen,
  isCoinTransfer,
  isMobileDevice,
  isMobilePortrait,
  isSmallWidth,
  trId
}) => (
  <StyledLeftTopSectionGrid
    id="left-sidebar"
    isMobilePortrait={isMobilePortrait}
    isSmallWidth={isSmallWidth}
    isSidebarMenuOpen={isUserDropDownOpen}
  >
    <OrderBookRecentTradesContainer
      isLeftTop
      isMobileDevice={isMobileDevice}
      isCoinTransfer={isCoinTransfer}
      trId={isCoinTransfer ? trId : null}
      isUserDropDownOpen={isUserDropDownOpen}
      isSidebarMenuOpen={isUserDropDownOpen}
    />
  </StyledLeftTopSectionGrid>
);

export default compose(
  inject(STORE_KEYS.VIEWMODESTORE, STORE_KEYS.EXCHANGESSTORE),
  observer,
  withProps(({ [STORE_KEYS.VIEWMODESTORE]: { isUserDropDownOpen } }) => ({
    isUserDropDownOpen
  }))
)(LeftTopSectionGrid);
