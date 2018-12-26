'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Pug = exports.listAvailablePugs = exports.leaveGameType = exports.joinGameType = exports.delGameType = exports.addGameType = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

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
        uid = _ref3[4];

    var discriminator, pickingOrder, newGameType, result;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            if (!(isNaN(noPlayers) || isNaN(noTeams) || !gameName || !uid)) {
              _context.next = 3;
              break;
            }

            return _context.abrupt('return', { status: false, msg: 'Invalid command' });

          case 3:
            discriminator = uid.toLowerCase();

            if (!Pugs[discriminator]) {
              _context.next = 6;
              break;
            }

            return _context.abrupt('return', { status: false, msg: 'Gametype already exists' });

          case 6:
            pickingOrder = (0, _helpers.getPickingOrder)(parseInt(noPlayers), parseInt(noTeams));

            if (pickingOrder) {
              _context.next = 9;
              break;
            }

            return _context.abrupt('return', { status: false, msg: 'Invalid No. of players/teams' });

          case 9:
            newGameType = {
              gameName: gameName,
              pickingOrder: pickingOrder,
              discriminator: discriminator,
              noPlayers: parseInt(noPlayers),
              noTeams: parseInt(noTeams)
            };
            _context.next = 12;
            return _api2.default.pushToDB('/Pugs', discriminator, newGameType);

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

var joinGameType = exports.joinGameType = function joinGameType(_ref7, user, Pugs, PugList) {
  var _ref8 = (0, _toArray3.default)(_ref7),
      _ = _ref8[0],
      args = _ref8.slice(1);

  try {
    if (args.length === 0) return { status: false, result: [], msg: 'Invalid command' };

    var result = args.map(function (g) {
      var game = g.toLowerCase(); // game is basically the discriminator

      if (!Pugs[game]) return { user: user, discriminator: game, joinStatus: -1 };

      var pugProps = Pugs[game];
      var pug = !PugList[game] ? new Pug(pugProps) : (0, _cloneDeep2.default)(PugList[game]);
      var joinStatus = pug.addPlayer(user);
      return {
        pug: pug,
        user: user,
        discriminator: pug.discriminator,
        noPlayers: pug.noPlayers,
        activeCount: pug.list.length,
        joinStatus: joinStatus
      };
    });
    return { status: true, result: result };
  } catch (error) {
    console.log(error);
    return { status: false, msg: 'Something went wrong' };
  }
};

var leaveGameType = exports.leaveGameType = function leaveGameType(_ref9, user, Pugs, PugList) {
  var _ref10 = (0, _toArray3.default)(_ref9),
      action = _ref10[0],
      args = _ref10.slice(1);

  try {
    if (action === 'lva') {
      var result = (0, _values2.default)(PugList).map(function (p) {
        var pug = (0, _cloneDeep2.default)(p);
        var playerIndex = pug.findPlayer(user);
        if (playerIndex > -1) {
          pug.removePlayer(playerIndex);
          return { pug: pug, user: user, discriminator: pug.discriminator };
        }
        return {};
      });
      return { status: true, result: result };
    } else {
      if (args.length === 0) return { status: false, result: [], msg: 'Invalid command' };

      var _result = args.map(function (g) {
        var game = g.toLowerCase(); // game is basically the discriminator

        if (!Pugs[game]) return {};
        var pug = PugList[game] ? (0, _cloneDeep2.default)(PugList[game]) : null;
        if (!pug) return {};

        var playerIndex = pug.findPlayer(user);
        if (playerIndex > -1) {
          pug.removePlayer(playerIndex);
          return { pug: pug, user: user, discriminator: pug.discriminator };
        }
        return {};
      });
      return { status: true, result: _result };
    }
  } catch (error) {
    console.log(error);
    return { status: false, msg: 'Something went wrong' };
  }
};

// TODO: Use constants for commands for better DX and maybe separate them in methods
var listAvailablePugs = exports.listAvailablePugs = function listAvailablePugs(_ref11, PugList) {
  var _ref12 = (0, _toArray3.default)(_ref11),
      action = _ref12[0],
      forGame = _ref12[1],
      args = _ref12.slice(2);

  try {
    if (action === 'lsa') {
      var result = (0, _values2.default)(PugList).map(function (p) {
        return {
          discriminator: p.discriminator,
          noPlayers: p.noPlayers,
          list: [].concat((0, _toConsumableArray3.default)(p.list)),
          picking: p.picking,
          withList: true
        };
      });
      return { status: true, result: result };
    } else {
      if (!forGame) {
        var _result3 = (0, _values2.default)(PugList).map(function (p) {
          return {
            discriminator: p.discriminator,
            noPlayers: p.noPlayers,
            list: [].concat((0, _toConsumableArray3.default)(p.list)),
            picking: p.picking,
            withList: false
          };
        });
        return { status: true, result: _result3 };
      }

      var game = forGame.toLowerCase(); // game is basically the discriminator
      if (!PugList[game]) return null;
      var pug = PugList[game];
      var _result2 = [{
        discriminator: pug.discriminator,
        noPlayers: pug.noPlayers,
        list: [].concat((0, _toConsumableArray3.default)(pug.list)),
        picking: pug.picking,
        withList: true
      }];
      return { status: true, result: _result2 };
    }
  } catch (error) {
    console.log(error);
    return { status: false, msg: 'Something went wrong' };
  }
};

var Pug = exports.Pug = function () {
  function Pug(_ref13) {
    var discriminator = _ref13.discriminator,
        gameName = _ref13.gameName,
        noPlayers = _ref13.noPlayers,
        noTeams = _ref13.noTeams,
        pickingOrder = _ref13.pickingOrder;
    (0, _classCallCheck3.default)(this, Pug);

    this.discriminator = discriminator;
    this.gameName = gameName;
    this.noPlayers = noPlayers;
    this.noTeams = noTeams;
    this.pickingOrder = pickingOrder;
    this.picking = false;
    this.list = [];
    this.captains = [];
    this.teams = {};
  }

  (0, _createClass3.default)(Pug, [{
    key: 'fillPug',
    value: function fillPug() {
      this.picking = true;
    }
  }, {
    key: 'stopPug',
    value: function stopPug() {
      this.picking = false;
    }
  }, {
    key: 'addPlayer',
    value: function addPlayer(user) {
      if (!this.picking) {
        if (this.list.findIndex(function (u) {
          return u.id === user.id;
        }) > -1) return 2;
        this.list.push((0, _extends3.default)({ team: null }, user));
        this.list.length === this.noPlayers ? this.fillPug() : null;
        return 1;
      }
      return 0;
    }
  }, {
    key: 'removePlayer',
    value: function removePlayer(index) {
      this.list.splice(index, 1);
      if (this.picking) this.stopPug();
    }
  }, {
    key: 'findPlayer',
    value: function findPlayer(user) {
      return this.list.findIndex(function (u) {
        return u.id === user.id;
      });
    }
  }, {
    key: 'cleanup',
    value: function cleanup() {}
  }]);
  return Pug;
}();
//# sourceMappingURL=pug.js.map