"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = createLoggedSelector;

var _deepObjectDiff = require("deep-object-diff");

var _equals = _interopRequireDefault(require("ramda/es/equals"));

var _reselect = require("reselect");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint no-console:0 max-statements:0 */
var COLOR_PATTERN = {
  DEFAULT: 'color:#9E9E9E',
  DIFF: 'color:#881391',
  PREV: 'color:#4CAF50',
  NEXT: 'color:#03A9F4'
};

var getFormattedTime = function getFormattedTime() {
  var date = new Date();
  return "".concat(date.toLocaleTimeString().split(' ')[0], ".").concat(date.getMilliseconds());
};

var buildLogMessage = function buildLogMessage(name) {
  return function (lastArgs, lastResult, newArgs, newResult) {
    var isArgsEqual = (0, _equals["default"])(lastArgs, newArgs);
    var isResultEqual = (0, _equals["default"])(lastResult, newResult);
    console.group("%cselector %c".concat(name, " %c@ ").concat(getFormattedTime()), COLOR_PATTERN.DEFAULT, 'color:black; font-weight:bold;', COLOR_PATTERN.DEFAULT);
    console.group('%cargs', COLOR_PATTERN.DEFAULT);
    console.log('%cprev args %O', COLOR_PATTERN.PREV, lastArgs);
    console.log('%cnext args %O', COLOR_PATTERN.NEXT, newArgs);
    console.log('%cargs diff %O', COLOR_PATTERN.DIFF, isArgsEqual ? '(args are equal)' : (0, _deepObjectDiff.diff)(lastArgs, newArgs));
    console.groupEnd();
    console.group('%cresult', COLOR_PATTERN.DEFAULT);
    console.log('%cprev result %O', COLOR_PATTERN.PREV, lastResult);
    console.log('%cnext result %O', COLOR_PATTERN.NEXT, newResult);
    console.log('%cresult diff %O', COLOR_PATTERN.DIFF, isResultEqual ? '(result is equal)' : (0, _deepObjectDiff.diff)(lastResult, newResult));
    console.groupEnd();
    console.groupEnd();
  };
};

var customMemoize = function customMemoize(func, changeCallback) {
  var defaultMemoizeInstance = (0, _reselect.defaultMemoize)(func);

  if (changeCallback === undefined) {
    return defaultMemoizeInstance;
  }

  var lastArgs;
  var lastResult;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var result = defaultMemoizeInstance.apply(void 0, args);

    if (lastResult === undefined || result !== lastResult) {
      changeCallback(lastArgs, lastResult, args, result);
      lastResult = result;
      lastArgs = args;
    }

    return result;
  };
};

function createLoggedSelector() {
  var name = 'Unknown name';

  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  if (typeof args[0] === 'string') {
    name = args[0];
    args.shift();
  }

  return process.env.NODE_ENV === 'production' ? _reselect.createSelector.apply(void 0, args) : (0, _reselect.createSelectorCreator)(customMemoize, buildLogMessage(name)).apply(void 0, args);
}