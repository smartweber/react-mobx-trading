import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';

import { IcExitFullScreen, TopRightCornerExitFullScreenWrapper } from './Components';
import { STORE_KEYS } from '@/stores';
import { MODE_KEYS } from '@/config/constants';

const ExitFullScreenButton = props => {
  const { setRightBottomSectionOpenMode } = props;

  const handleExitFullScreen = () => {
    setRightBottomSectionOpenMode(MODE_KEYS.depthChartKey);
  };

  return (
    <TopRightCornerExitFullScreenWrapper onClick={handleExitFullScreen}>
      <IcExitFullScreen />
    </TopRightCornerExitFullScreenWrapper>
  );
};

export default compose(
  inject(STORE_KEYS.VIEWMODESTORE),
  observer,
  withProps(({ [STORE_KEYS.VIEWMODESTORE]: { setRightBottomSectionOpenMode } }) => ({
    setRightBottomSectionOpenMode
  }))
)(ExitFullScreenButton);
