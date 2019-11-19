/* eslint-disable */
import { action, observable, reaction, computed } from 'mobx';

class PortfolioStore {
  @observable.shallow data = [];
  @observable totalBTCAmount = 0;
  @observable totalUSDAmount = 0;
  @observable c1Amount = 0;
  @observable c2Amount = 0;
  @observable isFiat = false;

  @observable price = 0;
  @observable baseSymbol = '';
  @observable btcUsdtRate = 0;

  @observable walletDataLoadStatus = false;

  fiatCurrencyStoreRef = null;
  coinsInMyWallet = [];
  isSwitching = false;
  handleSwitch = null;

  constructor(yourAccountStore, fiatCurrencyStore, viewModeStore, instrumentsReaction, orderBookBreakDownStore) {
    this.fiatCurrencyStoreRef = fiatCurrencyStore;

    reaction(
      () => ({
        coinsInMyWallet: yourAccountStore.coinsInMyWallet
      }),
      walletObj => {
        this.coinsInMyWallet = walletObj.coinsInMyWallet;
        this.initPortfolioList();
      }
    );

    instrumentsReaction(async baseSymbol => {
      this.baseSymbol = baseSymbol;
      this.isFiat = (baseSymbol || '').includes('F:');
      this.c1Amount = 1;
      this.initPortfolioList();

      this.isSwitching = true;
      clearTimeout(this.handleSwitch);
      this.handleSwitch = setTimeout(() => {
        this.isSwitching = false;
      }, 2000);
    });

    orderBookBreakDownStore.priceReaction(midPrice => {
      this.price = midPrice;
      this.c2Amount = this.c1Amount * this.price;
      if (!this.isSwitching) this.updatePortfolioList();
    });

    reaction(
      () => ({
        isResetAccount: yourAccountStore.isResetAccount
      }),
      walletObj => {
        this.isResetAccount = walletObj.isResetAccount;
        if (this.isResetAccount) {
          this.coinsInMyWallet = [];
          this.data = [];
        }
      }
    );
  }

  /**
   *  Portfolio Data
   */
  initPortfolioList = async () => {
    const btcItem = this.coinsInMyWallet.find(x => x.symbol === 'BTC');
    const usdItem = this.coinsInMyWallet.find(x => x.symbol === 'F:USD');
    this.coinsInMyWallet = this.coinsInMyWallet.filter(x => x.symbol !== 'F:USD' && x.symbol !== 'BTC');
    if (usdItem) this.coinsInMyWallet.unshift(usdItem);
    if (btcItem) this.coinsInMyWallet.unshift(btcItem);

    if (!this.btcUsdtRate) {
      this.btcUsdtRate = await this.fiatCurrencyStoreRef.getPriceOf('BTC');
    }

    const promises = this.coinsInMyWallet.map(async item => {
      const coinBalance = Number(item.position);
      const coinSymbol = item.symbol;

      const rateSymUsdt = await this.fiatCurrencyStoreRef.getSpotRate(coinSymbol, 'USDT');
      let usdRate = rateSymUsdt;
      let usdValue = coinSymbol === 'USDT' || coinSymbol === 'F:USD' ? coinBalance : rateSymUsdt * coinBalance;
      if (usdValue === 0 && coinSymbol !== 'USDT') {
        // temporal
        const rate = await this.fiatCurrencyStoreRef.getPriceOf(coinSymbol);
        usdValue = rate * coinBalance;
        usdRate = rate;
      }

      const rateSymBtc = await this.fiatCurrencyStoreRef.getSpotRate(coinSymbol, 'BTC');
      let btcRate = rateSymBtc;
      let btcValue = coinSymbol === 'BTC' ? coinBalance : rateSymBtc * coinBalance;
      if (btcValue === 0 && coinSymbol !== 'BTC') {
        // temporal
        const rate = await this.fiatCurrencyStoreRef.getPriceOf(coinSymbol);
        btcRate = rate / this.btcUsdtRate;
        btcValue = coinBalance * btcRate;
      }

      const isUsd = this.baseSymbol === 'F:USD';
      const rateSym1 = await this.fiatCurrencyStoreRef.getSpotRate(coinSymbol, 'BTC');
      const rateSym2 = await this.fiatCurrencyStoreRef.getSpotRate(isUsd ? 'BTC' : this.baseSymbol, 'BTC');
      const rateSymBase = rateSym1 / rateSym2;

      return {
        ...item,
        usdValue,
        btcValue,
        usdRate,
        btcRate,
        rateSymBase
      };
    });

    const dataArray = await Promise.all(promises).catch(error => {
      console.error(error);
    });

    if (!dataArray) {
      return;
    }

    this.totalBTCAmount = dataArray.map(item => item.btcValue).reduce((result, current) => result + current, 0);
    this.totalUSDAmount = dataArray.map(item => item.usdValue).reduce((result, current) => result + current, 0);
    this.data = dataArray;
  };

  updatePortfolioList = () => {
    if (this.data && this.data.length === 0) return;
    const dataArray = this.data;
    const price = this.baseSymbol === 'F:USD' && this.price > 0 ? 1 / this.price : this.price;
    for (let i = 0; i < dataArray.length; i++) {
      if (dataArray[i].symbol === 'F:USD') {
        dataArray[i].usdRate = 1;
      } else if (this.baseSymbol !== 'F:USD' && this.baseSymbol === dataArray[i].symbol) {
        dataArray[i].usdRate = this.price;
      } else {
        dataArray[i].usdRate = dataArray[i].rateSymBase * price;
      }
      dataArray[i].usdValue = dataArray[i].usdRate * dataArray[i].position;
    }
    const tUsd = dataArray.map(item => item.usdValue).reduce((result, current) => result + current, 0);
    if (tUsd > 0) {
      this.totalUSDAmount = tUsd;
    }
    this.data = dataArray.slice(0);
  };

  @computed get usdPrice() {
    if (this.baseSymbol !== 'F:USD' && this.baseSymbol !== 'USDT') {
      return this.price;
    }
    return 1;
  }

  @computed get btcPrice() {
    if (this.baseSymbol === 'F:USD' || this.baseSymbol === 'USDT') {
      return this.price;
    }

    if (this.baseSymbol === 'BTC') {
      return 1;
    }

    return this.price / this.btcUsdtRate;
  }

  @action.bound getBTCBalanceOf(symbol) {
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].symbol === symbol) return this.data[i].btcValue;
    }
    return 0;
  }

  @action.bound getPositionOf(symbol) {
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i] && this.data[i].symbol === symbol) return this.data[i].position;
    }
    return 0;
  }

  @action.bound setWalletDataLoadStatus(status) {
    this.walletDataLoadStatus = status;
  }

  /**
   *  CoinPair
   */
  handleInputChange = amt => {
    this.c1Amount = amt;
    this.c2Amount = this.c1Amount * this.price;
  };
}

export default (yourAccountStore, fiatCurrencyStore, viewModeStore, instrumentsReaction, orderBookBreakDownStore) => {
  return new PortfolioStore(
    yourAccountStore,
    fiatCurrencyStore,
    viewModeStore,
    instrumentsReaction,
    orderBookBreakDownStore
  );
};
