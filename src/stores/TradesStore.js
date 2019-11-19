import { observable, reaction } from 'mobx';
import { getTrades } from '../lib/bct-ws';

class Trades {
  @observable History = [];

  isLoggedIn = false;
  isRealTrading = false;

  constructor(settingsStore, smsAuthStore) {
    this.isLoggedIn = smsAuthStore.isLoggedIn;
    this.isRealTrading = settingsStore.isRealTrading;

    reaction(
      () => smsAuthStore.isLoggedIn,
      isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
        if (isLoggedIn) this.fetchTrades();
      },
      { fireImmediately: true }
    );

    reaction(
      () => settingsStore.isRealTrading,
      isRealTrading => {
        this.isRealTrading = isRealTrading;
        this.fetchTrades();
      },
      { fireImmediately: true }
    );
  }

  fetchTrades() {
    // reset previous history while we fetch new data
    // TODO: expose a loading flag to add a loading spinner
    this.History = [];

    const payload = {
      // will tell Back end to fetch latest trade history from exchanges
      refreshExchangeData: true,
      // will populate trade history with simulated trades
      paperTrading: this.isRealTrading !== true
    };

    getTrades(payload)
      .then(res => {
        this.History = this.formatTrades(res.data);
      })
      .catch(() => {
        this.History = [];
      });
  }

  formatTrades(exchanges) {
    const trades = Object.keys(exchanges).map(name => exchanges[name]);
    return trades;
  }
}

export default (settingsStore, smsAuthStore) => {
  return new Trades(settingsStore, smsAuthStore);
};
