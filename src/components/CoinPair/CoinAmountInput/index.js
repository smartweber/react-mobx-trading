import React, { Component } from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';

import { STORE_KEYS } from '@/stores';
import { customDigitFormatWithNoTrim, formatFiatString, customDigitFormat } from '@/utils';
import { valueNormalized } from '@/stores/utils/OrderEntryUtils';

import DataLoader from '@/components-generic/DataLoader';
import InputTooltip from './InputTooltip';

import { CoinAmtInputLeft, CoinAmtInputRight, CoinAmtInputWrapper } from './Components';

const DECIMAL_DIGITS_LIMIT = 20;
const DEFAULT_DECIMAL_DIGITS = 10;

class CoinAmountInput extends Component {
  contentEditable = React.createRef();

  state = {
    amount: '',
    isAmtInputFocused: false
  };

  handleAmtInputWrapperClick = () => {
    if (this.contentEditable.current) {
      this.contentEditable.current.focus();
    }
  };

  handleAmtInputFocus = () => {
    const { onAmountChange } = this.props;
    if (onAmountChange) {
      onAmountChange(false);
    }
    this.setState({
      amount: '',
      isAmtInputFocused: true
    });
  };

  handleAmtInputBlur = () => {
    this.setState({
      isAmtInputFocused: false
    });
  };

  handleAmountChange = event => {
    const { onAmountChange, handleInputChange } = this.props;
    const value = event.target.value;
    const oldValue = String(this.state.amount);
    const newValue = valueNormalized(oldValue, value);

    handleInputChange(newValue || 0);
    if (onAmountChange) {
      onAmountChange(true);
    }
    this.setState({
      amount: newValue
    });
  };

  getLowestNonZeroDecimlPosition = () => {
    const { isRight, c1Amount, c2Amount } = this.props;
    const value = (isRight ? c2Amount : c1Amount) / 1;
    const nonExponentialValue = value.toFixed(DECIMAL_DIGITS_LIMIT);
    const splittedValue = nonExponentialValue.split('.');
    if (parseInt(splittedValue[0])) {
      return 0;
    }

    const decimalPart = splittedValue[1];
    if (!decimalPart) {
      return 0;
    }

    const trailingZerosRegex = decimalPart.match(/^0+/);
    const trailingZeros = trailingZerosRegex ? trailingZerosRegex[0] : '';
    if (DECIMAL_DIGITS_LIMIT === trailingZeros.length) {
      return 0;
    }
    // plus 1 digit for a zero on the left side of the dot
    // plus 1 digit for a meaningful decimal digit
    return trailingZeros.length + 2;
  };

  render() {
    const { isAmtInputFocused, amount: amountFromState } = this.state;
    const {
      isRight,
      isFiat,
      hasUnitPrefix,
      c1Amount,
      c2Amount,
      arbMode,
      totalBTCAmount,
      totalUSDAmount,
      btcPrice,
      usdPrice,
      isAmtChangedAfterFocus,
      isLoaded
    } = this.props;

    let value = '';
    let amountValue = 0;
    let fiatValue = '';

    if (arbMode) {
      amountValue = isRight ? totalBTCAmount : totalUSDAmount;
      const { unitValue, unitPrefix } = formatFiatString(amountValue, 6);
      value = `${(!isRight ? '$' : '') +
        customDigitFormat(
          !isRight ? `${unitValue}` : customDigitFormat(isRight ? totalBTCAmount : totalUSDAmount),
          6
        )}`;
      fiatValue = `${value}${unitPrefix}`;
    } else {
      const lowestNonZeroDecimlPosition = this.getLowestNonZeroDecimlPosition();
      const decimalNumbers = isRight ? Math.max(DEFAULT_DECIMAL_DIGITS, lowestNonZeroDecimlPosition) : 0;
      amountValue = isRight ? c2Amount : c1Amount;
      const { unitValue, unitPrefix } = formatFiatString(amountValue, 6);
      value = customDigitFormat(
        isFiat && isRight ? `${unitValue}` : customDigitFormatWithNoTrim(amountValue, decimalNumbers),
        6
      );
      fiatValue = `${value}${unitPrefix}`;
    }

    const amount = isAmtInputFocused ? (isAmtChangedAfterFocus ? amountFromState : '') : value;

    const CoinAmtInputComponentName = isRight ? CoinAmtInputRight : CoinAmtInputLeft;

    const content = (
      <CoinAmtInputComponentName
        innerRef={this.contentEditable}
        disabled={isRight || arbMode}
        html={(arbMode ? !isRight : isFiat) ? fiatValue : amount}
        onFocus={this.handleAmtInputFocus}
        onBlur={this.handleAmtInputBlur}
        onChange={this.handleAmountChange}
      />
    );

    return (
      <CoinAmtInputWrapper
        isRight={isRight}
        hasUnitPrefix={hasUnitPrefix}
        disabled={isRight || arbMode}
        onClick={this.handleAmtInputWrapperClick}
      >
        {isRight ? (
          isLoaded ? (
            <InputTooltip arbMode={arbMode} btcPrice={btcPrice} usdPrice={usdPrice} totalBTCAmount={totalBTCAmount}>
              {content}
            </InputTooltip>
          ) : (
            <DataLoader width={35} height={35} noCenter />
          )
        ) : (
          content
        )}
      </CoinAmtInputWrapper>
    );
  }
}

const enhanced = compose(
  inject(STORE_KEYS.PORTFOLIOSTORE, STORE_KEYS.VIEWMODESTORE, STORE_KEYS.ORDERBOOKBREAKDOWN),
  observer,
  withProps(
    ({
      [STORE_KEYS.PORTFOLIOSTORE]: {
        c1Amount,
        c2Amount,
        totalBTCAmount,
        totalUSDAmount,
        handleInputChange,
        btcPrice,
        usdPrice
      },
      [STORE_KEYS.VIEWMODESTORE]: { arbMode }
    }) => ({
      c1Amount,
      c2Amount,
      totalBTCAmount,
      totalUSDAmount,
      handleInputChange,
      btcPrice,
      usdPrice,
      arbMode
    })
  )
);

export default enhanced(CoinAmountInput);
