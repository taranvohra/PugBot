'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _discord = require('discord.js');

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _constants = require('./constants');

var _ut99query = require('./ut99query');

var _pug = require('./pug');

var _formats = require('./formats');

var _helpers = require('./helpers');

var _util = require('./util');

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();
var cachedDB = {};
var disabledEvents = ['TYPING_START', 'CHANNEL_UPDATE', 'USER_UPDATE'];
var bot = new _discord.Client({ disabledEvents: disabledEvents });

bot.on('ready', function () {
  console.log('ready');
});

bot.on('message', function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(message) {
    var args, action, roles, _cachedDB, _cachedDB$Servers, serversObj, Servers, _cachedDB2, _cachedDB2$Servers, _serversObj, _Servers, result, _cachedDB3, _cachedDB3$Servers, _serversObj2, _Servers2, _result, _cachedDB4, _cachedDB4$Servers, _serversObj3, _Servers3, _result2, _cachedDB5, _cachedDB5$Pugs, Pugs, _result3;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!message.author.equals(bot.user)) {
              _context.next = 2;
              break;
            }

            return _context.abrupt('return');

          case 2:
            if (message.content.startsWith(_constants.prefix)) {
              _context.next = 4;
              break;
            }

            return _context.abrupt('return');

          case 4:
            args = message.content.substring(_constants.prefix.length).split(' ');
            action = args[0].toLowerCase();
            roles = message.member.roles;
            _context.t0 = true;
            _context.next = _context.t0 === _constants.commands.servers.includes(action) ? 10 : _context.t0 === ((0, _helpers.checkIfRoleIsPrivileged)(roles) && _constants.commands.addqueryserver.includes(action)) ? 14 : _context.t0 === ((0, _helpers.checkIfRoleIsPrivileged)(roles) && _constants.commands.delqueryserver.includes(action)) ? 22 : _context.t0 === ((0, _helpers.checkIfRoleIsPrivileged)(roles) && _constants.commands.updatequeryserver) ? 30 : _context.t0 === _constants.commands.queryut99server.includes(action) ? 32 : _context.t0 === _constants.commands.addgametype.includes(action) ? 39 : 46;
            break;

          case 10:
            _cachedDB = cachedDB, _cachedDB$Servers = _cachedDB.Servers, serversObj = _cachedDB$Servers === undefined ? {} : _cachedDB$Servers;
            Servers = (0, _util.createSortedArrayFromObject)(serversObj, 'timestamp');


            message.channel.send((0, _formats.printServerList)(Servers)).catch(console.error + ':list:');
            return _context.abrupt('break', 47);

          case 14:
            _cachedDB2 = cachedDB, _cachedDB2$Servers = _cachedDB2.Servers, _serversObj = _cachedDB2$Servers === undefined ? {} : _cachedDB2$Servers;
            _Servers = (0, _util.createSortedArrayFromObject)(_serversObj);
            _context.next = 18;
            return (0, _ut99query.addQueryServer)(args, _Servers);

          case 18:
            result = _context.sent;

            result.status ? updateCache('Servers', result.cache) : '';
            message.channel.send(result.msg);
            return _context.abrupt('break', 47);

          case 22:
            _cachedDB3 = cachedDB, _cachedDB3$Servers = _cachedDB3.Servers, _serversObj2 = _cachedDB3$Servers === undefined ? {} : _cachedDB3$Servers;
            _Servers2 = (0, _util.createSortedArrayFromObject)(_serversObj2);
            _context.next = 26;
            return (0, _ut99query.delQueryServer)(args, _Servers2);

          case 26:
            _result = _context.sent;

            _result.status ? updateCache('Servers', _result.cache) : '';
            message.channel.send(_result.msg);
            return _context.abrupt('break', 47);

          case 30:
            console.log(args[0]);
            return _context.abrupt('break', 47);

          case 32:
            _cachedDB4 = cachedDB, _cachedDB4$Servers = _cachedDB4.Servers, _serversObj3 = _cachedDB4$Servers === undefined ? {} : _cachedDB4$Servers;
            _Servers3 = (0, _util.createSortedArrayFromObject)(_serversObj3, 'timestamp');
            _context.next = 36;
            return (0, _ut99query.queryUT99Server)(args[1], _Servers3);

          case 36:
            _result2 = _context.sent;

            message.channel.send(_result2.status ? (0, _formats.printServerStatus)(_result2) : _result2.msg).catch(console.error + ':query:');
            return _context.abrupt('break', 47);

          case 39:
            _cachedDB5 = cachedDB, _cachedDB5$Pugs = _cachedDB5.Pugs, Pugs = _cachedDB5$Pugs === undefined ? {} : _cachedDB5$Pugs;
            _context.next = 42;
            return (0, _pug.addGameType)(args, Pugs);

          case 42:
            _result3 = _context.sent;

            _result3.status ? updateCache('Pugs', _result3.cache) : '';
            message.channel.send(_result3.msg);
            return _context.abrupt('break', 47);

          case 46:
            console.log('no match');

          case 47:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());

(0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
  return _regenerator2.default.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return _api2.default.getCopyOfDB('/');

        case 2:
          cachedDB = _context2.sent;

          bot.login(process.env.DISCORD_BOT_TOKEN);

        case 4:
        case 'end':
          return _context2.stop();
      }
    }
  }, _callee2, undefined);
}))();

var updateCache = function updateCache(toUpdate, newCache) {
  return cachedDB[toUpdate] = newCache;
};