import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';

import { withSafeTimeout } from '@hocs/safe-timers';
import { CaretArrowIcon } from '@/components-generic/ArrowIcon';
import { STORE_KEYS } from '@/stores';
import TimerTools from './TimerTools';
import { ToolbarWrapper, SelectedItem, PulsateDot } from './styles';

const PriceChartToolbar = props => {
  const { onChangeFilter, selectedFilterKey, tradingViewMode } = props;
  const [isOpen, setIsOpen] = useState(false);

  const handleDropdown = value => {
    setIsOpen(value);
  };

  const handleChange = value => {
    onChangeFilter(value);
    handleDropdown(false);
  };

  const openDropdown = () => {
    handleDropdown(true);
  };

  const closeDropdown = () => {
    handleDropdown(false);
  };

  const selectedFilterName = selectedFilterKey || 'LIVE';

  return (
    <ToolbarWrapper>
      <SelectedItem onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
        {!selectedFilterKey && <PulsateDot />}
        <span>{selectedFilterName}</span>
        <CaretArrowIcon borderColor="#020518" fillColor="#454c73" />
        <div className="dropdown_wrapper_space" />
      </SelectedItem>
      <TimerTools
        onChange={handleChange}
        selected={selectedFilterKey}
        isDisabled={tradingViewMode}
        onMoveOut={handleDropdown}
        show={isOpen}
      />
    </ToolbarWrapper>
  );
};

export default compose(
  withSafeTimeout,
  inject(STORE_KEYS.HISTORICALPRICESSTORE, STORE_KEYS.VIEWMODESTORE, STORE_KEYS.SETTINGSSTORE),
  withProps(
    ({
      [STORE_KEYS.HISTORICALPRICESSTORE]: { selectedFilterKey },
      [STORE_KEYS.HISTORICALPRICESSTORE]: { onChangeFilter },
      [STORE_KEYS.VIEWMODESTORE]: { tradingViewMode }
    }) => ({
      selectedFilterKey,
      onChangeFilter,
      tradingViewMode
    })
  ),
  observer
)(PriceChartToolbar);
