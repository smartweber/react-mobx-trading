import styled, { css } from 'styled-components/macro';
import QRCode from 'qrcode.react';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px 0 20px;
  width: 100%;
  height: 60px;
  font-size: 16px;
`;

export const Code = styled(QRCode)`
  pointer-events: none !important;
  position: absolute;
  left: 8px;
  top: 8px;
  width: calc(100% - 16px);
  height: calc(100% - 16px);
  transform: scale(1.27);

  & path:nth-child(1) {
    fill: none;
  }

  & path:nth-child(2) {
    fill: ${props => props.color || props.theme.palette.clrPurple};
  }
`;

export const DepositQRCodeWrapper = styled.div`
  padding: 15px;
  background: #080924;

  .public-address {
    padding: 5px;
    word-break: break-all;
    color: white;
    opacity: 0.5;
    font-size: 10px;
    line-height: 11px;
    text-align: center;
  }
`;

export const CopyButton = styled.button`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0.71px solid #04c6c0;
  border-radius: 4px;
  background: ${props => props.theme.palette.clrBackground};
  color: #04c6c0;
  margin-top: 12px;
  height: 30px;
  width: 100%;
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  padding: 9px 15px;

  &:hover {
    opacity: 0.8;
  }

  .tippy-tooltip {
    position: absolute;
    top: 35px;
    display: flex;
    justify-content: center;
    padding: 2px 5px;
    opacity: ${props => (props.isCopied ? '1' : '0')};
    transition: opacity 0.6s;
    &:before {
      content: '';
      position: absolute;
      top: -7px;
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      border-bottom: 7px solid ${props => props.theme.palette.clrBorder};
    }
  }
`;

export const DepositQRCode = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%;
  background: white;
`;

export const MenuWrapper = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  margin: 0;
  border: none;
  border-top: ${props => `${!props.isOpenMenu ? 0 : 1}px solid ${props.theme.palette.userMenuPopupBorder}`};
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .scrollbar-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
    border-radius: ${props => props.theme.palette.borderRadius};
    overflow: hidden;

    .ps__rail-y {
      opacity: 0 !important;
      border-left: 1px solid ${props => props.theme.palette.userMenuPopupBorder};
      background: ${props => props.theme.palette.userMenuPopupBg};

      .ps__thumb-y {
        &:before {
          background: ${props => props.theme.palette.userMenuPopupBorder};
        }
        cursor: pointer;
      }
    }

    .trading-section {
      border-top: ${props => `1px solid ${props.theme.palette.settingsBorderColor}`};
      padding: 12px;
      flex-shrink: 0;
    }
  }
`;

export const DropdownMenuItemWrapper = styled.div`
  flex-shrink: 0;
  position: relative;
  display: flex;
  flex-direction: ${props => (props.isColumn ? 'column' : 'row')};
  align-items: center;
  justify-content: stretch;
  margin: 0;
  border: none;
  cursor: pointer;
  & + div {
    border-top: 1px solid ${props => props.theme.palette.settingsBorderColor};
  }
  padding: ${props => (props.isColumn ? 0 : '10px 0')};
  width: 100%;
  cursor: auto;

  ${props => props.opened && props.isFullHeight && 'flex: 1;'};
  ${props => !props.opened && props.isFullHeight && `border-bottom: 1px solid ${props.theme.palette.clrSubBorder};`};

  .d-flex {
    flex-shrink: 0;
    width: 100%;
    height: 60px;
    padding: 10px 0;
    align-items: center;
    justify-content: stretch;
    background-color: ${props =>
      props.opened ? props.theme.palette.clrBorder : props.theme.palette.settingsBackgroundColor};
    transition: all 0.25s ease;
    cursor: pointer;

    svg,
    svg * {
      fill: ${props =>
        props.opened ? props.theme.palette.settingsLabelColor : props.theme.palette.settingsHeaderFontColor} !important;
    }
  }

  .icon-wrapper {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    border: none;
    padding: 0;
    width: 48px;
    height: 100%;
  }

  .label-wrapper {
    flex: 1;
    color: ${props =>
      props.opened ? props.theme.palette.settingsLabelColor : props.theme.palette.settingsHeaderFontColor};
    font-size: 20px;
    font-weight: 500;
    text-transform: uppercase;
    margin-left: 16px;
  }

  &:hover {
    .d-flex {
      color: ${props => props.theme.palette.settingsHoverColor};

      svg,
      svg * {
        fill: ${props =>
          props.opened ? props.theme.palette.settingsLabelColor : props.theme.palette.settingsHoverColor} !important;
      }
    }

    .label-wrapper {
      color: ${props =>
        props.opened ? props.theme.palette.settingsLabelColor : props.theme.palette.settingsHoverColor};
    }
  }

  > .btn_reset {
    border-radius: ${props => props.theme.palette.borderRadius};
    border: 0;
    background: ${props => props.theme.palette.clrLightRed};
    color: ${props => props.theme.palette.clrHighContrast};
    height: 31px;
    width: 78px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;
    margin-right: 25px;

    &:hover {
      opacity: 0.8;
    }
  }

  > .btn_normal {
    border-radius: ${props => props.theme.palette.borderRadius};
    border: 1px solid ${props => props.theme.palette.clrBorder};
    background: ${props => props.theme.palette.clrBackground};
    color: ${props => props.theme.palette.clrHighContrast};
    height: 31px;
    width: 78px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;

    &:hover {
      opacity: 0.8;
    }
  }
`;

export const FooterButtonsWrapper = styled.div`
  display: flex;
  align-items: center;

  > * + * {
    margin-left: 30px;
  }
`;

export const FooterMenuItem = styled.div`
  color: ${props => props.theme.palette.clrPurple};
  font-size: 13px;
  transition: color 0.3s;
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.palette.clrHighContrast};
  }
`;

export const TransferSection = styled.div`
  display: flex;
  padding: 12px;
  border-top: 1px solid ${props => props.theme.palette.clrSubBorder};
  background: ${props => props.theme.palette.coinPairDropDownItemBg};
`;

export const InputTextCustom = styled.input`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border: ${props => `1px solid ${props.theme.palette.clrInnerBorder}`};
  border-radius: 3px;
  padding: 9px 15px;
  width: ${props => (props.width ? `${props.width}px` : '100%')};
  height: 40px;
  background: ${props => props.theme.palette.clrBackground};
  font-size: 14px;
  font-weight: 700;
  line-height: 1em;
  color: ${props => props.theme.palette.clrPurple};
  cursor: ${props => (props.clickable ? 'pointer' : 'initial')};
  ${props =>
    props.readOnly &&
    css`
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `}
`;

export const Item = styled.div.attrs({ className: 'settings-pop-item' })`
  font-size: 17px;
  flex-shrink: 0;
  position: relative;
  width: 100%;
  ${props => (props.isMobileDevice ? 'flex: 1;' : 'height: 60px;')}
  height: ${props => (props.UserItem ? 'auto' : 60)};
  ${props => props.settingsOpen && 'height: 400px;'};
  margin-top: -1px;
  display: flex;
  justify-content: ${props => (props.appStoreButton ? 'flex-start' : 'space-between')};
  align-items: center;
  padding-right: ${props => (props.header ? 4 : 12)}px;
  padding-left: ${props => (props.UserItem ? 0 : props.appStoreButton ? 0 : 64)}px;
  color: ${props => props.theme.palette.settingsHeaderFontColor};
  background-color: ${props => props.theme.palette.clrBorder};
  transition: all 0.25s ease;
  ${props =>
    props.btn &&
    css`
      cursor: pointer;
      &:hover {
        background-color: ${props.theme.palette.clrSubBorder};
      }
    `}

  .settings-label {
    font-size: 38px;
    font-weight: 600;
    padding-left: 12px;
  }

  >  a {
    text-decoration: none;
  }
  > a :hover{
    cursor: pointer;
    text-decoration: underline;
  }

  .symbol_i {
    background: ${props => props.theme.palette.clrMouseClick};
    border-radius: 50%;
    color: ${props => props.theme.palette.settingsHeaderFontColor};
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    margin-left: 5px;
    border: 1px solid ${props => props.theme.palette.settingsHeaderFontColor};
    &:hover {
      color: ${props => props.theme.palette.settingsLabelColor};
      border: 1px solid ${props => props.theme.palette.settingsLabelColor};
    }
  }

  .info-tooltip {
    align-items: center;
    justify-content: center;
  }

  > span {
    display: flex;
    align-items: center;

    &.clickable {
      cursor: pointer;
    }
  }

  > .btn_normal {
    border-radius: ${props => props.theme.palette.borderRadius};
    border: 1px solid ${props => props.theme.palette.clrSubBorder};
    background: ${props => props.theme.palette.clrBackground};
    color: ${props => props.theme.palette.clrHighContrast};
    height: 31px;
    min-width: 78px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;

    &:hover {
      opacity: 0.8;
    }
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    svg, svg * {
      fill: ${props => props.theme.palette.userMenuPopupMenuItemHover} !important;
    }
  }

  &:hover {
    color: #fff;
    cursor: pointer;
  }
  .spinner-wrapper {
    > svg {
      position: relative;
    }
  }
`;

export const WithdrawDepositWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  height: 100%;
  border-right: 1px solid #232746;
  background: #010518;
  width: 100%;
`;

export const WithdrawTextarea = styled.textarea`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  width: 80%;
  height: ${props => props.height}px;
  margin-left: auto;
  margin-right: auto;
  color: ${props => props.theme.palette.settingsText};
  border: 1px solid ${props => props.theme.palette.clrSubBorder};
  background-color: ${props => props.theme.palette.clrBackground};
  resize: none;

  &::placeholder {
    color: ${props => props.theme.palette.settingsText};
    opacity: 0.4;
  }
`;

export const SwitchItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 24px;
  color: ${props => props.theme.palette.userMenuPopupMenuItem};
  font-size: 20px;
  & > div:first-child {
    color: ${props =>
      props.isChecked ? props.theme.palette.userMenuPopupMenuItem : props.theme.palette.settingsHoverColor};
    ${props =>
      !props.isChecked &&
      css`
        &:hover {
          text-decoration: underline;
        }
      `}
  }
  & > div:last-child {
    color: ${props =>
      props.isChecked ? props.theme.palette.settingsHoverColor : props.theme.palette.userMenuPopupMenuItem};
    ${props =>
      props.isChecked &&
      css`
        &:hover {
          text-decoration: underline;
        }
      `}
  }
`;

export const IconWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &.exchange-wrapper {
    height: 400px;

    & > div:first-child {
      span {
        width: auto;
      }
    }
  }
`;

export const DropdownFullHeight = styled.div`
  width: 100%;
  height: 400px;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  background: ${props => props.theme.palette.clrBackground};
`;

export const ItemList = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  flex-grow: 1;
  flex-shrink: 1;
  display: flex;
  background: transparent;
  border-top: 1px solid ${props => props.theme.palette.clrSubBorder};
  .hide {
    display: none;
  }
`;

export const ListStyleWrapper = styled.div`
  width: ${props => props.width - 2}px;
  height: ${props => props.height}px;

  .scrollbar-container {
    height: min-content;
    max-height: 100%;
    overflow: hidden;

    &.d-flex {
      flex-wrap: wrap;
    }
  }

  .ps__rail-y {
    right: 0 !important;
    background-color: ${props => props.theme.palette.clrBackground} !important;
    border-left: 1px solid ${props => props.theme.palette.clrInnerBorder};
    border-bottom-right-radius: ${props => props.theme.palette.borderRadius};
    opacity: 0 !important;

    .ps__thumb-y {
      z-index: 9999;
      cursor: pointer;

      &:before {
        background-color: ${props => props.theme.palette.clrBorder};
      }
    }
  }

  .ReactVirtualized__Table__rowColumn {
    height: 100%;
    margin: 0;
  }

  .ReactVirtualized__Table__row {
    background: ${props => props.theme.palette.coinPairDropDownItemBg};
    border-bottom: 1px solid ${props => props.theme.palette.clrSubBorder};
    color: ${props => props.theme.palette.settingsLabelColor};

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: ${props => props.theme.palette.clrMouseHover};
    }

    &:hover,
    &:active {
      .deposit-dropdown-name {
        color: ${props => props.theme.palette.clrHighContrast} !important;
      }
    }
  }
`;

export const SwitchLabel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 15;
  color: ${props => props.theme.palette.settingsLabelColor};
  padding-right: 2;
`;

export const ModeMainWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #232746;
  width: 100%;

  .dropdown_arrow {
    position: absolute;
    bottom: -10px;
    left: calc(50% - 8px);
  }
`;

export const WithdrawButton = styled.div`
  position: relative;
  font-size: 20px;
  line-height: 24px;
  padding-bottom: 5px;
  color: ${props => (props.isActive ? '#04c6c0' : 'white')};
  ${props => props.isActive && `font-weight: bold;`};
  ${props => !props.isActive && `border-bottom: 1px dotted white;`};

  .dropdown_arrow {
    position: absolute;
    bottom: -10px;
    left: calc(50% - 8px);
  }
`;

export const DepositButton = styled.div`
  position: relative;
  font-size: 20px;
  line-height: 24px;
  padding-bottom: 5px;
  margin-right: 14px;
  color: ${props => (props.isActive ? '#04c6c0' : 'white')};
  ${props => props.isActive && `font-weight: bold;`};
  ${props => !props.isActive && `border-bottom: 1px dotted white;`};
`;

export const ModeContentWrapper = styled.div`
  padding: 21px;
  padding-top: 0px;
  width: 100%;

  .content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    height: 100%;

    .title {
      color: white;
      opacity: 0.7;
      font-size: 14px;
      line-height: 16px;
      margin-bottom: 9px;
    }

    .input {
      position: relative;
      width: 100%;
      margin-bottom: 15px;

      .coin-icon {
        position: absolute;
        left: 9px;
        top: calc(50% - 13px);
        border: 1.5px solid #7f8bc2;
        border-radius: 15px;
        padding-left: 4px;
        padding-top: 3px;
      }
    }

    .sub-title {
      font-size: 11px;
      line-height: 16px;

      .deposit-sub-title {
        display: flex;
        flex-direction: column;
      }
    }
  }
`;

export const ModeSwitchWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 21px;
`;

export const ModeInputWrapper = styled.input`
  height: 40px;
  width: 100%;
  border: 0.71px solid #454c73;
  background: #141b44;
  padding-left: 40px;
  border-radius: 6px;
  font-size: 16px;
  line-height: 20px;
  color: #7f8bc2;

  ::placeholder {
    color: #7f8bc2;
  }
`;
