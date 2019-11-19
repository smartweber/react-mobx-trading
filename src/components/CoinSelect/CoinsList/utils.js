import { sortBy } from 'lodash';

const isSearched = (item, query) => {
  const symbol = item.symbol || '';
  const name = item.name || '';
  const lowerCaseQuery = query.toLowerCase();

  let weight = 9999;
  if (query) {
    const index1 = symbol
      .replace('S:', '')
      .replace('F:', '')
      .toLowerCase()
      .indexOf(lowerCaseQuery);
    if (index1 !== -1) {
      weight = index1;
    } else {
      const index2 = name.toLowerCase().indexOf(lowerCaseQuery);
      if (index2 !== -1) {
        weight = index2 + 100;
      }
    }
  } else {
    weight = 0;
  }

  return weight;
};

export const getTableItems = ({ topGroupItems = [], mainItems = [] }, { searchInputValue }) => {
  let tableItems = [];

  let searchedTopGroupItemsWeights = [];
  topGroupItems.forEach(item => {
    const weight = isSearched(item, searchInputValue);
    if (weight !== 9999) {
      searchedTopGroupItemsWeights.push({
        weight,
        item
      });
    }
  });

  searchedTopGroupItemsWeights = sortBy(searchedTopGroupItemsWeights, item => item.weight);
  tableItems = searchedTopGroupItemsWeights.map(val => val.item);

  let searchedMainItemsWeights = [];
  mainItems.forEach(item => {
    const weight = isSearched(item, searchInputValue);
    if (weight !== 9999) {
      if (!topGroupItems.find(({ symbol }) => symbol === item.symbol)) {
        searchedMainItemsWeights.push({
          weight,
          item
        });
      }
    }
  });
  searchedMainItemsWeights = searchedMainItemsWeights.sort((a, b) => {
    if (a.weight === b.weight) {
      const aCoinName = a.item.coin
        .replace('S:', '')
        .replace('F:', '')
        .toLowerCase();
      const bCoinName = b.item.coin
        .replace('S:', '')
        .replace('F:', '')
        .toLowerCase();
      return aCoinName > bCoinName ? 1 : -1;
    }
    return a.weight > b.weight ? 1 : -1;
  });
  tableItems = tableItems.concat(searchedMainItemsWeights.map(val => val.item));
  return tableItems;
};
