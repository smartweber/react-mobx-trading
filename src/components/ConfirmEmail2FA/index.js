import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { CheckCircle as CheckCircleIcon, Error as ErrorIcon } from '@material-ui/icons';
import { STORE_KEYS } from '@/stores';
import { TextDescription, OuterWrapper } from './styles';

class ConfirmEmail2FA extends Component {
  state = {
    message: '',
    isSuccess: false,
    time: 5,
    intervalHandler: null
  };

  componentDidMount() {
    this.checkCodeStatus();
  }

  checkCodeStatus() {
    const { code } = this.props;

    if (code === '200') {
      this.setState({
        isSuccess: true,
        message: 'Email 2fa is enabled.'
      });
      return this.redirectToMainPage();
    }

    let message = 'Unknow error.';

    if (code === '406') {
      message = 'Wrong secret in email verification.';
    } else if (code === '422') {
      message = 'Enabling link is wrong.';
    } else if (code === '401') {
      message = 'Enabling link is expired.';
    }

    this.setState({
      isSuccess: false,
      message
    });
  }

  redirectToMainPage() {
    this.calculateRedirectTime();
    setTimeout(() => {
      clearInterval(this.state.intervalHandler);
      this.setState(
        {
          intervalHandler: null
        },
        () => {
          this.props.history.push('/');
        }
      );
    }, 5000);
  }

  calculateRedirectTime() {
    const intervalHandler = setInterval(() => {
      const { time } = this.state;

      if (time > 0) {
        this.setState(prevState => ({
          time: prevState.time - 1
        }));
      }
    }, 1000);
    this.setState({
      intervalHandler
    });
  }

  renderRedirectAlert() {
    const { time } = this.state;

    return (
      <>
        <TextDescription>
          <FormattedMessage
            id="modal.2fa.label_redirection"
            defaultMessage="It will be redirected to the home page in 5 seconds."
          />
        </TextDescription>

        {time}
      </>
    );
  }

  render() {
    const { message, isSuccess } = this.state;
    const variant = isSuccess ? 'success' : 'error';

    return (
      <OuterWrapper>
        <SnackbarContent
          className={variant}
          aria-describedby="client-snackbar"
          message={
            <span id="client-snackbar">
              {isSuccess ? <CheckCircleIcon /> : <ErrorIcon />}
              {message}
            </span>
          }
        />

        {isSuccess && this.renderRedirectAlert()}
      </OuterWrapper>
    );
  }
}

export default inject(STORE_KEYS.SMSAUTHSTORE)(observer(withRouter(ConfirmEmail2FA)));
