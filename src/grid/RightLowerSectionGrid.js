import React from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';

import { STORE_KEYS } from '@/stores';
import OrderHistoryAdv from '@/components/OrderHistoryAdv';
import ModeSwitchMenu from '@/components/ModeSwitchMenu';
import { MODE_KEYS } from '@/config/constants';
import { StyledRightLowerSectionGrid } from './styles';

const RightLowerSectionGrid = ({
  hasMargin,
  arbMode,
  rightBottomSectionFullScreenMode,
  rightBottomSectionOpenMode,
  isLoggedIn,
  walletDataLoadStatus
}) => (
  <StyledRightLowerSectionGrid
    arbMode={arbMode}
    fullScreen={rightBottomSectionFullScreenMode}
    hasMargin={hasMargin}
    id="rightLowerSectionGrid"
  >
    <OrderHistoryAdv
      arbMode={arbMode}
      rightBottomSectionOpenMode={isLoggedIn ? rightBottomSectionOpenMode : MODE_KEYS.depthChartKey}
    />
    {walletDataLoadStatus && <ModeSwitchMenu />}
  </StyledRightLowerSectionGrid>
);

export default compose(
  inject(STORE_KEYS.VIEWMODESTORE, STORE_KEYS.TELEGRAMSTORE, STORE_KEYS.PORTFOLIOSTORE),
  observer,
  withProps(
    ({
      [STORE_KEYS.VIEWMODESTORE]: { arbMode, rightBottomSectionFullScreenMode, rightBottomSectionOpenMode },
      [STORE_KEYS.TELEGRAMSTORE]: { isLoggedIn },
      [STORE_KEYS.PORTFOLIOSTORE]: { walletDataLoadStatus }
    }) => ({
      arbMode,
      rightBottomSectionFullScreenMode,
      rightBottomSectionOpenMode,
      isLoggedIn,
      walletDataLoadStatus
    })
  )
)(RightLowerSectionGrid);
