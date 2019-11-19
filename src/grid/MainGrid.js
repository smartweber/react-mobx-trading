import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import throttle from 'lodash.throttle';

// Child Components
import { STORE_KEYS } from '@/stores';
import ConnectionLost from '@/components-generic/ConnectionLost';
import ConfirmEmail2FA from '@/components/ConfirmEmail2FA';
import InitialLoaderContainer from '@/components/InitialLoaderContainer';
import LeftTopSectionGrid from './LeftTopSectionGrid';
import RightTopSectionGrid from './RightTopSectionGrid';
import { GridWrapper } from './styles';

// Set ReactDom
window.React = React;
window.ReactDOM = ReactDOM;

class Trading extends PureComponent {
  componentDidMount() {
    const { setRouterCoin, isHFApp, match } = this.props;
    if (!isHFApp && match && match.params && match.params.coin !== '') {
      setRouterCoin(match.params.coin.toUpperCase());
    }

    window.addEventListener('resize', throttle(this.updateDimensions, 250));
  }

  updateDimensions = () => {
    this.forceUpdate();
  };

  render() {
    const { isCoinTransfer } = this.props;

    return (
      <GridWrapper id="grid">
        <LeftTopSectionGrid isCoinTransfer={isCoinTransfer} trId={isCoinTransfer ? this.props.id : null} />

        <RightTopSectionGrid />

        <InitialLoaderContainer />

        <ConnectionLost />
      </GridWrapper>
    );
  }
}

const MainGrid = props => {
  return (
    <Router>
      <Route exact path="/HF" component={() => <Trading {...props} isHFApp />} />
      <Route
        exact
        path="/t/:id"
        component={({ match }) => <Trading {...props} isCoinTransfer id={match.params.id} />}
      />
      <Route
        exact
        path="/r/:id"
        component={({ match }) => <Trading {...props} isCoinTransfer id={match.params.id} />}
      />
      <Route exact path="/index.html" component={() => <Trading {...props} />} />
      <Route exact path="/" component={() => <Trading {...props} />} />
      <Route
        exact
        path="/2fa/confirm/:code"
        component={({ match }) => <ConfirmEmail2FA {...props} code={match.params.code} />}
      />
    </Router>
  );
};

export default compose(
  inject(STORE_KEYS.INSTRUMENTS, STORE_KEYS.VIEWMODESTORE, STORE_KEYS.MARKETMAKER),
  observer,
  withProps(({ [STORE_KEYS.INSTRUMENTS]: { setRouterCoin } }) => ({
    setRouterCoin
  }))
)(MainGrid);
