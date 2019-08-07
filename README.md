# Description
Custom reselect selector with the ability to log all recomputations with the output similar to redux-logger

Inspired by https://github.com/kbrownlees/reselect-change-memoize and https://github.com/LogRocket/redux-logger

# Usage

Standard reselect use case example:
```js
import { createSelector } from 'reselect';

const shopItemsSelector = state => state.shop.items
const taxPercentSelector = state => state.shop.taxPercent

const subtotalSelector = createSelector(
  shopItemsSelector,
  items => items.reduce((acc, item) => acc + item.value, 0)
)
```
With logged selector:
```js
import createLoggedSelector from 'logged-selector';

const shopItemsSelector = state => state.shop.items
const taxPercentSelector = state => state.shop.taxPercent

const subtotalSelector = createLoggedSelector(
  'subtotalSelector',
  shopItemsSelector,
  items => items.reduce((acc, item) => acc + item.value, 0)
)
```