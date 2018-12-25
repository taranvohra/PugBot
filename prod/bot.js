'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _toArray2 = require('babel-runtime/helpers/toArray');

var _toArray3 = _interopRequireDefault(_toArray2);

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

/**
 * PugList is list of pugs active at any moment on the server
 * Pugs are the pug(s)/gametype(s) registered on the server with their props
 */

var cachedDB = {};
var PugList = {};

var disabledEvents = ['TYPING_START', 'CHANNEL_UPDATE', 'USER_UPDATE'];
var bot = new _discord.Client({ disabledEvents: disabledEvents });

bot.on('ready', function () {
  console.log('ready');
});

bot.on('message', function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(message) {
    var args, action, roles, _args, _action, rest, _cachedDB, _cachedDB$Servers, serversObj, Servers, _cachedDB2, _cachedDB2$Servers, _serversObj, _Servers, result, _cachedDB3, _cachedDB3$Servers, _serversObj2, _Servers2, _result, _cachedDB4, _cachedDB4$Servers, _serversObj3, _Servers3, _result2, _cachedDB5, _cachedDB5$Pugs, Pugs, _result3, _cachedDB6, _cachedDB6$Pugs, _Pugs, _result4, _cachedDB7, _cachedDB7$Pugs, _Pugs2, user, _result5, _cachedDB8, _cachedDB8$Pugs, _Pugs3, _user, _result6, _result7;

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
            _context.next = _context.t0 === ['topkek'].includes(action) ? 10 : _context.t0 === _constants.commands.servers.includes(action) ? 12 : _context.t0 === ((0, _helpers.checkIfRoleIsPrivileged)(roles) && _constants.commands.addqueryserver.includes(action)) ? 16 : _context.t0 === ((0, _helpers.checkIfRoleIsPrivileged)(roles) && _constants.commands.delqueryserver.includes(action)) ? 24 : _context.t0 === ((0, _helpers.checkIfRoleIsPrivileged)(roles) && _constants.commands.updatequeryserver) ? 32 : _context.t0 === _constants.commands.queryut99server.includes(action) ? 34 : _context.t0 === _constants.commands.addgametype.includes(action) ? 41 : _context.t0 === _constants.commands.delgametype.includes(action) ? 48 : _context.t0 === _constants.commands.joingametype.includes(action) ? 55 : _context.t0 === _constants.commands.leavegametype.includes(action) ? 61 : _context.t0 === _constants.commands.listgametype.includes(action) ? 66 : 67;
            break;

          case 10:
            _args = (0, _toArray3.default)(args), _action = _args[0], rest = _args.slice(1);

            console.log(_action, rest);

          case 12:
            _cachedDB = cachedDB, _cachedDB$Servers = _cachedDB.Servers, serversObj = _cachedDB$Servers === undefined ? {} : _cachedDB$Servers;
            Servers = (0, _util.createSortedArrayFromObject)(serversObj, 'timestamp');


            message.channel.send((0, _formats.printServerList)(Servers)).catch(console.error + ':list:');
            return _context.abrupt('break', 68);

          case 16:
            _cachedDB2 = cachedDB, _cachedDB2$Servers = _cachedDB2.Servers, _serversObj = _cachedDB2$Servers === undefined ? {} : _cachedDB2$Servers;
            _Servers = (0, _util.createSortedArrayFromObject)(_serversObj);
            _context.next = 20;
            return (0, _ut99query.addQueryServer)(args, _Servers);

          case 20:
            result = _context.sent;

            result.status ? updateCache('Servers', result.cache) : '';
            message.channel.send(result.msg);
            return _context.abrupt('break', 68);

          case 24:
            _cachedDB3 = cachedDB, _cachedDB3$Servers = _cachedDB3.Servers, _serversObj2 = _cachedDB3$Servers === undefined ? {} : _cachedDB3$Servers;
            _Servers2 = (0, _util.createSortedArrayFromObject)(_serversObj2);
            _context.next = 28;
            return (0, _ut99query.delQueryServer)(args, _Servers2);

          case 28:
            _result = _context.sent;

            _result.status ? updateCache('Servers', _result.cache) : '';
            message.channel.send(_result.msg);
            return _context.abrupt('break', 68);

          case 32:
            console.log(args[0]);
            return _context.abrupt('break', 68);

          case 34:
            _cachedDB4 = cachedDB, _cachedDB4$Servers = _cachedDB4.Servers, _serversObj3 = _cachedDB4$Servers === undefined ? {} : _cachedDB4$Servers;
            _Servers3 = (0, _util.createSortedArrayFromObject)(_serversObj3, 'timestamp');
            _context.next = 38;
            return (0, _ut99query.queryUT99Server)(args[1], _Servers3);

          case 38:
            _result2 = _context.sent;

            message.channel.send(_result2.status ? (0, _formats.printServerStatus)(_result2) : _result2.msg).catch(console.error + ':query:');
            return _context.abrupt('break', 68);

          case 41:
            _cachedDB5 = cachedDB, _cachedDB5$Pugs = _cachedDB5.Pugs, Pugs = _cachedDB5$Pugs === undefined ? {} : _cachedDB5$Pugs;
            _context.next = 44;
            return (0, _pug.addGameType)(args, Pugs);

          case 44:
            _result3 = _context.sent;

            _result3.status ? updateCache('Pugs', _result3.cache) : '';
            message.channel.send(_result3.msg);
            return _context.abrupt('break', 68);

          case 48:
            _cachedDB6 = cachedDB, _cachedDB6$Pugs = _cachedDB6.Pugs, _Pugs = _cachedDB6$Pugs === undefined ? {} : _cachedDB6$Pugs;
            _context.next = 51;
            return (0, _pug.delGameType)(args, _Pugs);

          case 51:
            _result4 = _context.sent;

            _result4.status ? updateCache('Pugs', _result4.cache) : '';
            message.channel.send(_result4.msg);
            return _context.abrupt('break', 68);

          case 55:
            _cachedDB7 = cachedDB, _cachedDB7$Pugs = _cachedDB7.Pugs, _Pugs2 = _cachedDB7$Pugs === undefined ? {} : _cachedDB7$Pugs;
            user = {
              id: message.author.id,
              username: (0, _helpers.fixSpecialCharactersInName)(message.author.username)
            };
            _result5 = (0, _pug.joinGameType)(args, user, _Pugs2, PugList);

            _result5.forEach(function (_ref2) {
              var pug = _ref2.pug,
                  discriminator = _ref2.discriminator;
              return pug ? updatePugList(discriminator, pug) : null;
            });
            message.channel.send(_result5.status ? (0, _formats.printPugJoinStatus)(_result5) : _result5.msg).catch(console.error + ':join:');
            return _context.abrupt('break', 68);

          case 61:
            _cachedDB8 = cachedDB, _cachedDB8$Pugs = _cachedDB8.Pugs, _Pugs3 = _cachedDB8$Pugs === undefined ? {} : _cachedDB8$Pugs;
            _user = {
              id: message.author.id,
              username: (0, _helpers.fixSpecialCharactersInName)(message.author.username)
            };
            _result6 = (0, _pug.leaveGameType)(args, _user, _Pugs3, PugList);

            _result6.forEach(function (_ref3) {
              var pug = _ref3.pug,
                  discriminator = _ref3.discriminator;
              return pug ? updatePugList(discriminator, pug) : null;
            });
            message.channel.send(_result6.status ? printPugLeaveStatus(_result6) : _result6.msg).catch(console.error + ':leave:');

          case 66:
            _result7 = (0, _pug.listAvailablePugs)(args, PugList);

          case 67:
            console.log('no match');

          case 68:
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
var updatePugList = function updatePugList(toUpdate, pug) {
  return PugList[toUpdate] = pug;
};