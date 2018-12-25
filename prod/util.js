"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSortedArrayFromObject = undefined;

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createSortedArrayFromObject = exports.createSortedArrayFromObject = function createSortedArrayFromObject(obj, sortBy) {
  return (0, _keys2.default)(obj).reduce(function (acc, curr) {
    acc.push((0, _extends3.default)({ id: curr }, obj[curr]));
    return acc;
  }, []).sort(function (a, b) {
    return a[sortBy] - b[sortBy];
  });
};
//# sourceMappingURL=util.js.map