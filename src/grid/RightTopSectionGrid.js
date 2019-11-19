import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';

import { STORE_KEYS } from '@/stores';
import CoinPair from '@/components/CoinPair';
import GraphTool from '@/components/GraphTool';
import ColdStorage from '@/components/ColdStorage';
import Login from '@/components/Login';
import RightLowerSectionGrid from './RightLowerSectionGrid';
import { StyledRightTopSectionGrid, GraphGrid, SearchBarGridArea, ChartGridArea } from './styles';

const RightTopSectionGrid = ({
  arbMode,
  isMobilePortrait,
  isSmallWidth,
  rightBottomSectionFullScreenMode,
  isLoggedIn,
  tradingViewMode
}) => {
  return (
    <StyledRightTopSectionGrid id="right-side" isMobilePortrait={isMobilePortrait} isSmallWidth={isSmallWidth}>
      <GraphGrid>
        {!tradingViewMode && (
          <SearchBarGridArea rightBottomSectionFullScreenMode={rightBottomSectionFullScreenMode}>
            {isLoggedIn ? <CoinPair /> : <Login />}
          </SearchBarGridArea>
        )}
        <ChartGridArea id="right-top">
          {!arbMode ? <GraphTool isTradingView={tradingViewMode} /> : <ColdStorage />}
        </ChartGridArea>

        <RightLowerSectionGrid hasMargin />
      </GraphGrid>
    </StyledRightTopSectionGrid>
  );
};

const withStore = compose(
  inject(STORE_KEYS.VIEWMODESTORE, STORE_KEYS.TELEGRAMSTORE, STORE_KEYS.EXCHANGESSTORE),
  observer,
  withProps(
    ({
      [STORE_KEYS.VIEWMODESTORE]: { rightBottomSectionFullScreenMode, arbMode, tradingViewMode },
      [STORE_KEYS.TELEGRAMSTORE]: { isLoggedIn }
    }) => ({
      rightBottomSectionFullScreenMode,
      arbMode,
      isLoggedIn,
      tradingViewMode
    })
  )
);

export default withStore(RightTopSectionGrid);
