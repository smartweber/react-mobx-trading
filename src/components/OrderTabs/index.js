import React, { Component } from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { Tooltip } from 'react-tippy';

import { MODE_KEYS } from '@/config/constants';
import { noop } from '@/utils';
import { STORE_KEYS } from '@/stores';
import ExchangesLabel from '@/components/OrderTabs/ExchangesLabel';
import { CaretArrowIcon } from '@/components-generic/ArrowIcon';
import {
  FormHeader,
  TabsWrapper,
  DropdownWrapper,
  SelectedItem,
  Dropdown,
  Item,
  SubItem,
  RowWrapper,
  SubRowWrapper,
  TooltipWrapper
} from './styles';

class OrderTabs extends Component {
  state = {
    formIndex: 0,
    isOpened: false,
    isSubItemOpened: false,
    selectedBase: this.props.selectedBase,
    arbMode: this.props.arbMode,
    showPortfolio: false,
    selectedTabIndex: -1,
    subItem: null
  };

  wrapperRef = React.createRef();

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.arbMode !== nextProps.arbMode || prevState.selectedBase !== nextProps.selectedBase) {
      return {
        arbMode: nextProps.arbMode,
        selectedBase: nextProps.selectedBase,
        formIndex: nextProps.arbMode ? 1 : 0,
        showPortfolio: nextProps.arbMode
      };
    }

    return {};
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = event => {
    if (
      this.state.isOpened &&
      this.wrapperRef.current &&
      this.wrapperRef.current.contains &&
      !this.wrapperRef.current.contains(event.target)
    ) {
      this.setState({
        isOpened: false
      });
    }
  };

  handleTabChange = (isOption, index, subItem = null) => () => {
    const { setRightBottomSectionOpenMode, setArbMode, arbMode, connectedExchanges } = this.props;
    // To disable Stop, Limit, Stop Limit forms
    if (index > 1) {
      return;
    }

    if (index > 0 && !subItem) {
      return;
    }

    if (arbMode) {
      setArbMode(false);
      this.setState({ formIndex: 0, showPortfolio: false, isOpened: false });
      setRightBottomSectionOpenMode(MODE_KEYS.depthChartKey);
    }
    // Disable toggle if there no connected exchanges
    if (connectedExchanges.length > 0) {
      if (!isOption) {
        this.setState({ formIndex: index, subItem });
      }
      this.setState({ isOpened: false });
    }
  };

  openDropdown = () => {
    this.setState({ isOpened: true });
  };

  closeDropdown = () => {
    this.setState({
      isOpened: false,
      selectedTabIndex: -1,
      isSubItemOpened: false
    });
  };

  handleTabMouseEnter = (event, index) => {
    // To disable Stop, Limit, Stop Limit forms
    if (index > 1) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.setState({ selectedTabIndex: index });
    if (index > 1) {
      this.setState({ isSubItemOpened: true });
    } else {
      this.setState({ isSubItemOpened: false });
    }
  };

  render() {
    const { formIndex: formIdx, isOpened, isSubItemOpened, showPortfolio, selectedTabIndex, subItem } = this.state;
    const { children, tabs, subtabs, arbMode, activeCoin: act, connectedExchanges } = this.props;
    const activeCoin = (act || '').replace('S:', '').replace('F:', '');
    const optionEnabled = activeCoin === 'USDT' || !arbMode || showPortfolio;
    const formIndex = arbMode ? 0 : formIdx;
    let childIndex = formIndex;
    if (arbMode) {
      childIndex += 2;
    }
    const selectedTab = tabs[0];

    return (
      <>
        <FormHeader id="form-header">
          <ExchangesLabel />
          {!arbMode && (
            <TabsWrapper>
              <DropdownWrapper ref={this.wrapperRef}>
                <SelectedItem
                  onMouseEnter={optionEnabled ? this.openDropdown : noop}
                  onMouseLeave={optionEnabled ? this.closeDropdown : noop}
                >
                  {selectedTab && selectedTab[formIndex]}
                  {subItem && <span className="sub-item">({subItem})</span>}
                </SelectedItem>
                {optionEnabled && (
                  <Dropdown
                    isHovered={isOpened}
                    onMouseEnter={optionEnabled ? this.openDropdown : noop}
                    onMouseLeave={optionEnabled ? this.closeDropdown : noop}
                  >
                    {tabs.map((tab, index) => {
                      if ((!arbMode || showPortfolio) && index < 1) {
                        return tab.map((item, mIndex) => {
                          const subItems = [];
                          if (selectedTabIndex > 0) {
                            // market, stop, limit, stop limit
                            subtabs.forEach((subItem, sIndex) => {
                              subItems.push(
                                <SubItem
                                  key={`${selectedTabIndex}-${sIndex}`}
                                  onClick={this.handleTabChange(false, mIndex, subItem)}
                                >
                                  {subItem}
                                </SubItem>
                              );
                            });
                          }
                          return (
                            <RowWrapper key={`${index}-${mIndex}`}>
                              {connectedExchanges.length < 1 && mIndex > 0 ? (
                                <Tooltip
                                  arrow
                                  html={
                                    <TooltipWrapper>
                                      {mIndex > 1
                                        ? 'Feature is not ready yet, coming soon!'
                                        : 'Please connect your exchanges to access Market Form.'}
                                    </TooltipWrapper>
                                  }
                                  position="left"
                                  theme="bct"
                                >
                                  <Item
                                    isActive={!index && formIndex === mIndex}
                                    isHovered={mIndex === selectedTabIndex}
                                    isDisabled={mIndex > 1}
                                    // To disable submenus for now.
                                    onMouseEnter={event => this.handleTabMouseEnter(event, mIndex)}
                                    onClick={this.handleTabChange(false, mIndex)}
                                  >
                                    {item}
                                  </Item>
                                </Tooltip>
                              ) : (
                                <Item
                                  isActive={!index && formIndex === mIndex}
                                  isHovered={mIndex === selectedTabIndex}
                                  isDisabled={mIndex > 1}
                                  // To disable submenus for now.
                                  onMouseEnter={event => this.handleTabMouseEnter(event, mIndex)}
                                  onClick={this.handleTabChange(false, mIndex)}
                                >
                                  {item}
                                </Item>
                              )}
                              {selectedTabIndex === mIndex && selectedTabIndex > 0 && (
                                <SubRowWrapper
                                  onMouseLeave={optionEnabled && !isSubItemOpened ? this.closeDropdown : noop}
                                >
                                  {subItems}
                                </SubRowWrapper>
                              )}
                            </RowWrapper>
                          );
                        });
                      }
                      if (arbMode && index === 2) {
                        return tab.map((item, mIndex) => {
                          return (
                            <Item
                              key={`${index}-${mIndex}`}
                              isActive={formIndex === mIndex}
                              onClick={this.handleTabChange(false, mIndex, item)}
                            >
                              {item}
                            </Item>
                          );
                        });
                      }

                      return null;
                    })}
                    <CaretArrowIcon fillColor="#454c73" borderColor="#020518" className="dropdown_arrow" />
                  </Dropdown>
                )}
              </DropdownWrapper>
            </TabsWrapper>
          )}
        </FormHeader>
        {children[childIndex]}
      </>
    );
  }
}

export default compose(
  inject(STORE_KEYS.VIEWMODESTORE, STORE_KEYS.CONVERSIONAUTOSTORE, STORE_KEYS.EXCHANGESSTORE, STORE_KEYS.INSTRUMENTS),
  observer,
  withProps(
    ({
      [STORE_KEYS.VIEWMODESTORE]: { arbMode, setRightBottomSectionOpenMode },
      [STORE_KEYS.CONVERSIONAUTOSTORE]: { activeCoin },
      [STORE_KEYS.EXCHANGESSTORE]: { connectedExchanges, exchanges },
      [STORE_KEYS.INSTRUMENTS]: { selectedBase }
    }) => ({
      arbMode,
      setRightBottomSectionOpenMode,
      activeCoin,
      connectedExchanges,
      exchanges,
      selectedBase
    })
  )
)(OrderTabs);
