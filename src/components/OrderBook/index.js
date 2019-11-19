import React, { Component } from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { STORE_KEYS } from '@/stores';

import OrderBookTable from './OrderBookTable';

class OrderBook extends Component {
  setUserDropDownOpen = () => {
    const { isLoggedIn, isUserDropDownOpen, setUserDropDownOpen } = this.props;

    if (isLoggedIn) {
      setUserDropDownOpen(!isUserDropDownOpen);
    }
  };

  render() {
    return <OrderBookTable setUserDropDownOpen={this.setUserDropDownOpen} />;
  }
}

const withOrderInstruments = compose(
  inject(STORE_KEYS.VIEWMODESTORE, STORE_KEYS.TELEGRAMSTORE),
  observer,
  withProps(
    ({
      [STORE_KEYS.VIEWMODESTORE]: { isUserDropDownOpen, setUserDropDownOpen },
      [STORE_KEYS.TELEGRAMSTORE]: { isLoggedIn }
    }) => ({
      isUserDropDownOpen,
      setUserDropDownOpen,
      isLoggedIn
    })
  )
);

export default withOrderInstruments(OrderBook);
