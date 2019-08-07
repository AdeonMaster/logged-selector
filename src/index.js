/* eslint no-console:0 max-statements:0 */

import { diff } from 'deep-object-diff';
import { equals } from 'ramda';
import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect';

const COLOR_PATTERN = {
  DEFAULT: 'color:#9E9E9E',
  DIFF: 'color:#881391',
  PREV: 'color:#4CAF50',
  NEXT: 'color:#03A9F4',
};

const getFormattedTime = () => {
  const date = new Date();

  return `${date.toLocaleTimeString().split(' ')[0]}.${date.getMilliseconds()}`;
};

const buildLogMessage = name => (lastArgs, lastResult, newArgs, newResult) => {
  const isArgsEqual = equals(lastArgs, newArgs);
  const isResultEqual = equals(lastResult, newResult);

  console.group(
    `%cselector %c${name} %c@ ${getFormattedTime()}`,
    COLOR_PATTERN.DEFAULT,
    'color:black; font-weight:bold;',
    COLOR_PATTERN.DEFAULT,
  );

  console.group('%cargs', COLOR_PATTERN.DEFAULT);
  console.log('%cprev args %O', COLOR_PATTERN.PREV, lastArgs);
  console.log('%cnext args %O', COLOR_PATTERN.NEXT, newArgs);
  console.log('%cargs diff %O', COLOR_PATTERN.DIFF, isArgsEqual ? '(args are equal)' : diff(lastArgs, newArgs));
  console.groupEnd();

  console.group('%cresult', COLOR_PATTERN.DEFAULT);
  console.log('%cprev result %O', COLOR_PATTERN.PREV, lastResult);
  console.log('%cnext result %O', COLOR_PATTERN.NEXT, newResult);
  console.log('%cresult diff %O', COLOR_PATTERN.DIFF, isResultEqual ? '(result is equal)' : diff(lastResult, newResult));
  console.groupEnd();

  console.groupEnd();
};

const customMemoize = (func, changeCallback) => {
  const defaultMemoizeInstance = defaultMemoize(func);

  if (changeCallback === undefined) {
    return defaultMemoizeInstance;
  }

  let lastArgs;
  let lastResult;

  return (...args) => {
    const result = defaultMemoizeInstance(...args);

    if (lastResult === undefined || result !== lastResult) {
      changeCallback(lastArgs, lastResult, args, result);
      lastResult = result;
      lastArgs = args;
    }

    return result;
  };
};

export default function createLoggedSelector(...args) {
  let name = 'Unknown name';

  if (typeof args[0] === 'string') {
    [name] = args;
    args.shift();
  }

  return process.env.NODE_ENV === 'production'
    ? createSelector(...args)
    : createSelectorCreator(customMemoize, buildLogMessage(name))(...args);
}
