'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Pug = exports.joinGameType = exports.delGameType = exports.addGameType = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _toArray2 = require('babel-runtime/helpers/toArray');

var _toArray3 = _interopRequireDefault(_toArray2);

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

var _cloneDeep = require('lodash/cloneDeep');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var addGameType = exports.addGameType = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref, Pugs) {
    var _ref3 = (0, _slicedToArray3.default)(_ref, 5),
        _ = _ref3[0],
        gameName = _ref3[1],
        noPlayers = _ref3[2],
        noTeams = _ref3[3],
        discriminator = _ref3[4];

    var pickingOrder, newGameType, result;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            if (!(isNaN(noPlayers) || isNaN(noTeams) || !gameName || !discriminator)) {
              _context.next = 3;
              break;
            }

            return _context.abrupt('return', { status: false, msg: 'Invalid command' });

          case 3:
            if (!Pugs[discriminator]) {
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
            newGameType = {
              gameName: gameName,
              noPlayers: noPlayers,
              noTeams: noTeams,
              pickingOrder: pickingOrder,
              discriminator: discriminator
            };
            _context.next = 11;
            return _api2.default.pushToDB('/Pugs', discriminator, newGameType);

          case 11:
            result = _context.sent;
            return _context.abrupt('return', (0, _extends3.default)({}, result, { msg: 'Gametype added' }));

          case 15:
            _context.prev = 15;
            _context.t0 = _context['catch'](0);

            console.log(_context.t0);
            return _context.abrupt('return', { status: false, msg: 'Something went wrong' });

          case 19:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 15]]);
  }));

  return function addGameType(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

var delGameType = exports.delGameType = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(_ref4, Pugs) {
    var _ref6 = (0, _toArray3.default)(_ref4),
        _ = _ref6[0],
        discriminator = _ref6[1],
        args = _ref6.slice(2);

    var result;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;

            if (Pugs[discriminator]) {
              _context2.next = 3;
              break;
            }

            return _context2.abrupt('return', { status: false, msg: "Gametype doesn't exist" });

          case 3:
            _context2.next = 5;
            return _api2.default.deleteFromDB('/Pugs', discriminator);

          case 5:
            result = _context2.sent;
            return _context2.abrupt('return', (0, _extends3.default)({}, result, { msg: 'Gametype removed' }));

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2['catch'](0);

            console.log(_context2.t0);
            return _context2.abrupt('return', { status: false, msg: 'Something went wrong' });

          case 13:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[0, 9]]);
  }));

  return function delGameType(_x3, _x4) {
    return _ref5.apply(this, arguments);
  };
}();

var joinGameType = exports.joinGameType = function joinGameType(_ref7, Pugs, PugList) {
  var _ref8 = (0, _toArray3.default)(_ref7),
      _ = _ref8[0],
      args = _ref8.slice(1);

  return args.split(' ').map(function (g) {
    var game = g.toLowerCase();

    if (!Pugs[game]) return { status: false, msg: 'No such pug found for ' + g };

    var pugProps = Pugs[game];
    var pug = !PugList[game] ? new Pug(pugProps) : (0, _cloneDeep2.default)(PugList[game]);

    return pug.list.length < pug.noPlayers ? {
      status: true,
      msg: '**' + 35344 + '** joined **' + pug.discriminator + '** (**' + pug.list.length + '/' + pug.noPlayers + ')**'
    } : {
      status: false,
      msg: 'Sorry, **' + pug.discriminator + '** is already full'
    };
  });
};

var Pug = exports.Pug = function () {
  function Pug(_ref9) {
    var discriminator = _ref9.discriminator,
        gameName = _ref9.gameName,
        noPlayers = _ref9.noPlayers,
        noTeams = _ref9.noTeams,
        pickingOrder = _ref9.pickingOrder;
    (0, _classCallCheck3.default)(this, Pug);

    this.discriminator = discriminator;
    this.gameName = gameName;
    this.noPlayers = noPlayers;
    this.noTeams = noTeams;
    this.pickingOrder = pickingOrder;
    this.list = [];
    this.captains = [];
  }

  (0, _createClass3.default)(Pug, [{
    key: 'pugFilled',
    value: function pugFilled() {}
  }, {
    key: 'addPlayer',
    value: function addPlayer(discordId) {
      this.list.push(discordId);
      if (this.list.length === noPlayers) this.pugFilled();
    }
  }, {
    key: 'destroy',
    value: function destroy() {}
  }]);
  return Pug;
}();