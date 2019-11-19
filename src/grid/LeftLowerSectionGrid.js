import React from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import { STORE_KEYS } from '@/stores';
import MarketOrderEntryForm from '@/components/OrderEntry/MarketOrder';
import SpotOrderEntryForm from '@/components/OrderEntry/SpotOrder';
import OrderTabs from '@/components/OrderTabs';
import OrderForm from '@/components/OrderForm';
import { BuySellOrderWrapper, ArbOrderWrapper, StyledLeftLowerSectionGrid } from './styles';

const MARKET_LIST = [
  [
    <FormattedMessage id="grid.label_spot_price" defaultMessage="Spot Price" />,
    <FormattedMessage id="grid.label_market" defaultMessage="Market" />,
    <FormattedMessage id="grid.label_limit" defaultMessage="Limit" />,
    <FormattedMessage id="grid.label_stop" defaultMessage="Stop" />,
    <FormattedMessage id="grid.label_stop_limit" defaultMessage="Stop Limit" />
  ]
];

const MARKET_SUB_LIST = [
  <FormattedMessage id="grid.immediate_or_cancel" defaultMessage="Immediate or Cancel" />,
  <FormattedMessage id="grid.good_till_canceled" defaultMessage="Good Till Canceled" />,
  <FormattedMessage id="grid.good_till_date" defaultMessage="Good Till Date" />,
  <FormattedMessage id="grid.fill_or_kill" defaultMessage="Fill or Kill" />,
  <FormattedMessage id="grid.day_valid_till_utc" defaultMessage="Day (Valid till 00:00 UTC)" />
];

const LeftLowerSectionGrid = ({ setArbMode, setTradingViewMode }) => {
  return (
    <StyledLeftLowerSectionGrid id="left-lower-section">
      <OrderTabs
        tabs={MARKET_LIST}
        subtabs={MARKET_SUB_LIST}
        setArbMode={setArbMode}
        setTradingViewMode={setTradingViewMode}
      >
        <BuySellOrderWrapper id="buy-sell-wrapper-spot">
          <SpotOrderEntryForm />
        </BuySellOrderWrapper>

        <BuySellOrderWrapper id="buy-sell-wrapper-market">
          <MarketOrderEntryForm />
        </BuySellOrderWrapper>

        <ArbOrderWrapper id="buy-sell-wrapper-arb2">
          <OrderForm />
        </ArbOrderWrapper>
      </OrderTabs>
    </StyledLeftLowerSectionGrid>
  );
};

export default compose(
  inject(STORE_KEYS.VIEWMODESTORE, [STORE_KEYS.MARKETMAKER]),
  observer,
  withProps(({ [STORE_KEYS.VIEWMODESTORE]: { setArbMode, setTradingViewMode } }) => ({
    setArbMode,
    setTradingViewMode
  }))
)(LeftLowerSectionGrid);
