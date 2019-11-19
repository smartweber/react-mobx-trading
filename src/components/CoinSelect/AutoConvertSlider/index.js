import React, { Component } from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import Slider from 'rc-slider';
import partial from 'lodash.partial';

import { STORE_KEYS } from '@/stores';
import { withValueFromEvent } from '@/utils';
import { TradeSlider, RailStyle, HandleStyle, TrackStyle, ProgressValue } from './styles';

const MULTIPLIER = 10000;

class AutoConvertSlider extends Component {
  state = {
    coin: '',
    isTrading: false,
    isBuy: false,
    isHovered: false
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.coin !== nextProps.coin) {
      nextProps.updatHashArray(nextProps.coin);
      return {
        coin: nextProps.coin
      };
    }

    return null;
  }

  setAmount = amount => {
    const { setAmountOf, coin } = this.props;
    setAmountOf(amount / MULTIPLIER, coin);
    this.forceUpdate();
  };

  handleTrading = (isTrading, percentage) => () => {
    const { isWallet } = this.props;
    const { isHovered } = this.state;

    // prevent start trading in coin search slider when slider isn't hovered
    if (!isWallet && !isHovered && isTrading) {
      return;
    }

    this.setState({ isTrading });
    if (this.props.handleTrading) {
      this.props.handleTrading(isTrading);
    }

    if (!isTrading) {
      const isFullMode = Number(percentage) === 100;
      this.props.proceedAutoTrade(isFullMode);
    }
  };

  handleChange = value => {
    partial(withValueFromEvent, this.setAmount)({ target: { value } });
  };

  stopPropagation = e => e.stopPropagation();

  handleMounseEnter = () => {
    this.setState({ isHovered: true });
  };

  handleMounseLeave = () => {
    this.setState({ isHovered: false });
  };

  render() {
    const { slidersHash, coin, disabled, color, isWallet } = this.props;
    const { isTrading, isBuy } = this.state;

    const maxSlide = slidersHash[coin] ? slidersHash[coin].maxSlider : 0;
    const amount = slidersHash[coin] ? slidersHash[coin].valueSlider : 0;
    let sliderValue = amount * MULTIPLIER;
    let percentage = maxSlide > 0 ? (amount / maxSlide) * 100 : 0;
    if (isWallet) {
      percentage = percentage.toFixed(0);
    } else if (percentage > 0 && percentage < 10) {
      percentage = percentage.toFixed(1);
    } else {
      percentage = percentage.toFixed(2);
    }
    if (percentage < 0.1) {
      percentage = 0;
      sliderValue = 0;
    }

    const isShow = maxSlide > 0 && Boolean(percentage);

    return (
      <TradeSlider
        onClick={this.stopPropagation}
        isTrading={isTrading}
        isWallet={isWallet}
        onMouseEnter={this.handleMounseEnter}
        onMouseLeave={this.handleMounseLeave}
      >
        <Slider
          trackStyle={[
            isTrading
              ? isBuy
                ? TrackStyle.buy
                : TrackStyle.sell
              : isWallet
              ? { ...TrackStyle.wallet, backgroundColor: color }
              : TrackStyle.default
          ]}
          railStyle={isWallet ? RailStyle.wallet : disabled ? RailStyle.default : RailStyle.search}
          activeDotStyle={{ backgroundColor: 'gray' }}
          handleStyle={[
            isWallet
              ? { ...HandleStyle.wallet, backgroundColor: color }
              : disabled
              ? { ...HandleStyle.default, backgroundColor: color }
              : isTrading
              ? HandleStyle.selected
              : isBuy
              ? HandleStyle.buy
              : HandleStyle.sell
          ]}
          disabled={disabled}
          min={0}
          max={maxSlide * MULTIPLIER}
          step={0.01}
          value={sliderValue}
          onChange={this.handleChange}
          onAfterChange={this.handleTrading(false, percentage)}
          onBeforeChange={this.handleTrading(true, percentage)}
        />

        {isShow && isTrading && <ProgressValue isWallet={isWallet}>{percentage} %</ProgressValue>}
      </TradeSlider>
    );
  }
}

const enhanced = compose(
  inject(STORE_KEYS.AUTOSLIDERSTORE),
  observer,
  withProps(
    ({
      [STORE_KEYS.AUTOSLIDERSTORE]: {
        slidersHash,
        setAmountOf,
        baseSymbol,
        quoteSymbol,
        proceedAutoTrade,
        updatHashArray
      }
    }) => ({
      slidersHash,
      setAmountOf,
      baseSymbol,
      quoteSymbol,
      proceedAutoTrade,
      updatHashArray
    })
  )
);

export default enhanced(AutoConvertSlider);
