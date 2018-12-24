'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addGameType = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _helpers = require('./helpers');

var _stringHash = require('string-hash');

var _stringHash2 = _interopRequireDefault(_stringHash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var addGameType = exports.addGameType = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref, Pugs) {
    var _ref3 = (0, _slicedToArray3.default)(_ref, 4),
        _ = _ref3[0],
        noPlayers = _ref3[1],
        gameName = _ref3[2],
        noTeams = _ref3[3];

    var pickingOrder, uid, newGameType, result;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            if (!(isNaN(noPlayers) || isNaN(noTeams) || !gameName)) {
              _context.next = 3;
              break;
            }

            return _context.abrupt('return', { status: false, msg: 'Invalid command' });

          case 3:
            if (!Pugs[gameName]) {
              _context.next = 5;
              break;
            }

            return _context.abrupt('return', { status: false, msg: 'Gametype already exists' });

          case 5:
            pickingOrder = (0, _helpers.getPickingOrder)(parseInt(noPlayers), parseInt(noTeams));

            if (pickingOrder) {
              _context.next = 8;
              break;
            }

            return _context.abrupt('return', { status: false, msg: 'Invalid No. of players/teams' });

          case 8:
            uid = (0, _stringHash2.default)(gameName);
            newGameType = { gameName: gameName, noPlayers: noPlayers, noTeams: noTeams, pickingOrder: pickingOrder };
            _context.next = 12;
            return _api2.default.pushToDB('/Pugs', uid, newGameType);

          case 12:
            result = _context.sent;
            return _context.abrupt('return', (0, _extends3.default)({}, result, { msg: 'Gametype added' }));

          case 16:
            _context.prev = 16;
            _context.t0 = _context['catch'](0);

            console.log(_context.t0);
            return _context.abrupt('return', { status: false, msg: 'Something went wrong' });

          case 20:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 16]]);
  }));

  return function addGameType(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();