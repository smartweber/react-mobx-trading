import { observable, action, reaction } from 'mobx';
import { darkTheme } from '../theme/core';
import { MODE_KEYS } from '@/config/constants';

export const viewModeKeys = {
  basicModeKey: 'basic', // Wallet Table view mode
  friendModeKey: 'friend', // Telegram Friend list view mode
  publicChatModeKey: 'chat', // Telegram Public Coin's channel view mode
  advancedModeKey: 'advanced', // Global Order Book view mode
  settingsModeKey: 'settings', // Settings view mode
  historyModeKey: 'history', // History view mode
  depositModeKey: 'deposit' // Deposit view mode
};

const StateSequence = new Set([
  viewModeKeys.basicModeKey,
  viewModeKeys.friendModeKey,
  viewModeKeys.publicChatModeKey,
  viewModeKeys.advancedModeKey,
  viewModeKeys.settingsModeKey,
  viewModeKeys.historyModeKey,
  viewModeKeys.depositModeKey
]);

export const graphViewModeKeys = {
  valueMode: 'valueMode',
  numberMode: 'numberMode',
  unfixedMode: 'unfixedMode'
};

class ViewModeStore {
  @observable viewMode;
  @observable theme = darkTheme;
  @observable tradingViewMode = false;
  @observable isUserDropDownOpen = false;
  @observable isLogoutModalOpen = false;
  @observable isFirstLoad = true; // true: first-loading
  @observable rightBottomSectionOpenMode = MODE_KEYS.myPortfolioModeKey; // default is my trades mode
  @observable rightBottomSectionFullScreenMode = false;
  @observable arbMode = false;

  statesSequence = null;

  constructor(exchangesStore) {
    this.__initStateSequence();
    this.viewMode = this.__nextState();

    this.exchangesStore = exchangesStore;

    reaction(
      () => ({
        exchanges: exchangesStore.exchanges
      }),
      ({ exchanges = {} }) => {
        this.setTradingViewMode(!exchanges.Global.active);
        if (!exchanges.Global.active) {
          this.setRightBottomSectionOpenMode(MODE_KEYS.depthChartKey);
        }
      }
    );
  }

  /**
   *  ViewMode State Control
   */
  __initStateSequence() {
    this.statesSequence = StateSequence.values();
  }

  __nextState() {
    const nextState = this.statesSequence.next();

    if (nextState.done) {
      this.__initStateSequence();
      return this.statesSequence.next().value;
    }

    return nextState.value;
  }

  /**
   *  Observable actions
   */
  @action.bound setViewMode(viewMode) {
    if (viewMode === this.viewMode) {
      return;
    }
    this.viewMode = viewMode;

    let state = '';
    do {
      state = this.__nextState();
    } while (state !== viewMode);
  }

  @action.bound setTradingViewMode(mode) {
    this.tradingViewMode = mode;
  }

  @action.bound setRightBottomSectionOpenMode(mode) {
    const oldFullScreenMode = this.rightBottomSectionFullScreenMode;
    if (this.rightBottomSectionOpenMode === mode) {
      return;
    }

    const dontGoFullScreenModes = [MODE_KEYS.depthChartKey, MODE_KEYS.myPortfolioModeKey, MODE_KEYS.coldStorage];
    this.rightBottomSectionFullScreenMode = !dontGoFullScreenModes.includes(mode);
    if (oldFullScreenMode && !this.rightBottomSectionFullScreenMode) {
      setTimeout(() => {
        this.rightBottomSectionOpenMode = mode;
      }, 500);
    } else {
      this.rightBottomSectionOpenMode = mode;
    }
  }

  @action.bound setUserDropDownOpen(mode) {
    this.isUserDropDownOpen = mode;
  }

  @action.bound setLogoutModalOpen(mode) {
    this.isLogoutModalOpen = mode;
  }

  @action.bound setIsFirstLoad(mode) {
    this.isFirstLoad = mode;
  }

  @action.bound setArbMode(mode) {
    this.arbMode = mode;

    if (mode) {
      this.exchangesStore.fetchRealMarketExchanges();
    }
  }
}

export default exchangesStore => new ViewModeStore(exchangesStore);
