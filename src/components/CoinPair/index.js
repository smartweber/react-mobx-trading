import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';

import { STORE_KEYS } from '@/stores';
import { MODE_KEYS } from '@/config/constants';
import CoinIcon from '@/components-generic/CoinIcon';
import CoinMetaDropdown from '@/components/CoinSelect/CoinWrapper/CoinMetaDropdown';
import CoinAmountInput from './CoinAmountInput';
import LanguageDropdownWithLanguages from './LanguageDropdownWithLanguages';
import { StyledWrapper, CoinItemWrapper, CurrencyName, EqualSymbol } from './styles';
import { formatFiatString } from '@/utils';

class CoinPair extends Component {
  state = {
    selectedBase: this.props.selectedBase,
    openCoinMetaDropdown: false,
    rightPairChosen: false,
    leftPairValue: this.props.c1Amount,
    isLeftAmtChangedAfterFocus: false
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { c2Amount, selectedQuote } = nextProps;
    const isQuoteFiat = (selectedQuote || '').includes('F:');

    if (prevState.selectedBase !== nextProps.selectedBase) {
      return {
        selectedBase: nextProps.selectedBase,
        rightPairChosen: false,
        isLeftAmtChangedAfterFocus: false,
        unitPrefix: ''
      };
    }
    if (!prevState.rightPairChosen) {
      if (c2Amount > 0) {
        const { unitPrefix } = formatFiatString(c2Amount, 2);
        return {
          rightPairChosen: true,
          unitPrefix: isQuoteFiat ? unitPrefix : ''
        };
      }
    }
    if (prevState.leftPairValue !== nextProps.c1Amount) {
      const { unitPrefix } = formatFiatString(c2Amount, 2);

      return {
        leftPairValue: nextProps.c1Amount,
        unitPrefix: isQuoteFiat ? unitPrefix : ''
      };
    }
    return null;
  }

  handleLeftAmountChangedAfterFocus = isChanged => {
    this.setState({
      isLeftAmtChangedAfterFocus: isChanged
    });
  };

  toggleCoinMetaDropdown = open => () => {
    this.setState({ openCoinMetaDropdown: open });
  };

  getLeftValue = (isIcon = false) => {
    const { selectedBase, arbMode } = this.props;

    if (arbMode) {
      return 'PORTFOLIO';
    }

    if (!isIcon) {
      return (selectedBase || '').replace('F:', '').replace('S:', '');
    }

    return selectedBase;
  };

  getRightValue = (isIcon = false) => {
    const { selectedQuote, arbMode } = this.props;

    if (arbMode) {
      return 'BTC';
    }

    if (!isIcon) {
      return (selectedQuote || '').replace('F:', '').replace('S:', '');
    }

    return selectedQuote;
  };

  render() {
    const { openCoinMetaDropdown, isLeftAmtChangedAfterFocus } = this.state;
    const { isLoggedIn, selectedQuote, selectedBase, c2Amount } = this.props;
    const leftValue = this.getLeftValue();
    const leftIconValue = this.getLeftValue(true);
    const rightValue = this.getRightValue();
    const rightIconValue = this.getRightValue(true);
    const isLeftFiat = (selectedBase || '').includes('F:');
    const isRightFiat = (selectedQuote || '').includes('F:');

    const isLoaded = (!!c2Amount && !isLeftAmtChangedAfterFocus) || isLeftAmtChangedAfterFocus;

    return (
      <StyledWrapper>
        <CoinItemWrapper>
          <div
            role="button"
            tabIndex={0}
            onMouseLeave={this.toggleCoinMetaDropdown(false)}
            onClick={this.toggleCoinMetaDropdown(true)}
          >
            <CoinIcon size={38} value={leftIconValue} />
            {openCoinMetaDropdown && <CoinMetaDropdown />}
          </div>
          <CurrencyName>{leftValue}</CurrencyName>
          <CoinAmountInput
            isFiat={isLeftFiat}
            onAmountChange={this.handleLeftAmountChangedAfterFocus}
            isAmtChangedAfterFocus={isLeftAmtChangedAfterFocus}
          />
        </CoinItemWrapper>

        <EqualSymbol>=</EqualSymbol>

        <CoinItemWrapper>
          <CoinAmountInput isRight isFiat={isRightFiat} isLoaded={isLoaded} />
          <CurrencyName>{`${rightValue}`}</CurrencyName>
          {isLoggedIn ? <CoinIcon size={38} value={rightIconValue} /> : <LanguageDropdownWithLanguages />}
        </CoinItemWrapper>
      </StyledWrapper>
    );
  }
}

const enhanced = compose(
  inject(
    STORE_KEYS.INSTRUMENTS,
    STORE_KEYS.ORDERBOOKBREAKDOWN,
    STORE_KEYS.TELEGRAMSTORE,
    STORE_KEYS.VIEWMODESTORE,
    STORE_KEYS.PORTFOLIOSTORE
  ),
  observer,
  withProps(
    ({
      [STORE_KEYS.INSTRUMENTS]: { selectedBase, selectedQuote },
      [STORE_KEYS.TELEGRAMSTORE]: { isLoggedIn },
      [STORE_KEYS.VIEWMODESTORE]: { rightBottomSectionOpenMode, arbMode },
      [STORE_KEYS.PORTFOLIOSTORE]: { c1Amount, c2Amount, handleInputChange }
    }) => ({
      selectedBase,
      selectedQuote,
      isLoggedIn,
      arbMode,
      isColdStorage: rightBottomSectionOpenMode === MODE_KEYS.coldStorage,
      c1Amount,
      c2Amount,
      handleInputChange
    })
  )
);

export default enhanced(CoinPair);
