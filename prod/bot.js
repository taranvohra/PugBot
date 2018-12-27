'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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
    var _cachedDB, _cachedDB$Servers, serversObj, _cachedDB$Pugs, Pugs, user, args, action, roles, Servers, _Servers, result, _Servers2, _result, _Servers3, _result2, _result3, _result4, _joinGameType, status, _result5, msg, filledPugs, _leaveGameType, _status, _result6, _msg, deadPugs, _listAvailablePugs, _status2, _result7, _msg2;

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
            _cachedDB = cachedDB, _cachedDB$Servers = _cachedDB.Servers, serversObj = _cachedDB$Servers === undefined ? {} : _cachedDB$Servers, _cachedDB$Pugs = _cachedDB.Pugs, Pugs = _cachedDB$Pugs === undefined ? {} : _cachedDB$Pugs;
            user = {
              id: message.author.id,
              username: (0, _helpers.fixSpecialCharactersInName)(message.author.username)
            };
            args = message.content.substring(_constants.prefix.length).split(' ');
            action = args[0].toLowerCase();
            roles = message.member.roles;
            _context.t0 = true;
            _context.next = _context.t0 === _constants.commands.servers.includes(action) ? 12 : _context.t0 === ((0, _helpers.checkIfRoleIsPrivileged)(roles) && _constants.commands.addqueryserver.includes(action)) ? 15 : _context.t0 === ((0, _helpers.checkIfRoleIsPrivileged)(roles) && _constants.commands.delqueryserver.includes(action)) ? 22 : _context.t0 === _constants.commands.queryut99server.includes(action) ? 29 : _context.t0 === _constants.commands.addgametype.includes(action) ? 35 : _context.t0 === _constants.commands.delgametype.includes(action) ? 41 : _context.t0 === _constants.commands.joingametype.includes(action) ? 47 : _context.t0 === _constants.commands.leavegametype.includes(action) ? 52 : _context.t0 === _constants.commands.listgametype.includes(action) ? 57 : 60;
            break;

          case 12:
            Servers = (0, _util.createSortedArrayFromObject)(serversObj, 'timestamp');

            message.channel.send((0, _formats.printServerList)(Servers)).catch(console.error + ':list:');
            return _context.abrupt('break', 61);

          case 15:
            _Servers = (0, _util.createSortedArrayFromObject)(serversObj);
            _context.next = 18;
            return (0, _ut99query.addQueryServer)(args, _Servers);

          case 18:
            result = _context.sent;

            result.status ? updateCache('Servers', result.cache) : '';
            message.channel.send(result.msg);
            return _context.abrupt('break', 61);

          case 22:
            _Servers2 = (0, _util.createSortedArrayFromObject)(serversObj);
            _context.next = 25;
            return (0, _ut99query.delQueryServer)(args, _Servers2);

          case 25:
            _result = _context.sent;

            _result.status ? updateCache('Servers', _result.cache) : '';
            message.channel.send(_result.msg);
            return _context.abrupt('break', 61);

          case 29:
            _Servers3 = (0, _util.createSortedArrayFromObject)(serversObj, 'timestamp');
            _context.next = 32;
            return (0, _ut99query.queryUT99Server)(args[1], _Servers3);

          case 32:
            _result2 = _context.sent;

            message.channel.send(_result2.status ? (0, _formats.printServerStatus)(_result2) : _result2.msg).catch(console.error + ':query:');
            return _context.abrupt('break', 61);

          case 35:
            _context.next = 37;
            return (0, _pug.addGameType)(args, Pugs);

          case 37:
            _result3 = _context.sent;

            _result3.status ? updateCache('Pugs', _result3.cache) : '';
            message.channel.send(_result3.msg);
            return _context.abrupt('break', 61);

          case 41:
            _context.next = 43;
            return (0, _pug.delGameType)(args, Pugs);

          case 43:
            _result4 = _context.sent;

            _result4.status ? updateCache('Pugs', _result4.cache) : '';
            message.channel.send(_result4.msg);
            return _context.abrupt('break', 61);

          case 47:
            _joinGameType = (0, _pug.joinGameType)(args, user, Pugs, PugList), status = _joinGameType.status, _result5 = _joinGameType.result, msg = _joinGameType.msg;
            filledPugs = _result5.reduce(function (acc, _ref2) {
              var pug = _ref2.pug,
                  discriminator = _ref2.discriminator;

              if (pug) {
                revisePugList(discriminator, pug, 'update');
                pug.list.length === parseInt(pug.noPlayers) ? acc.push(pug) : null;
              }
              return acc;
            }, []);

            message.channel.send(status ? (0, _formats.printPugJoinStatus)(_result5) : msg).catch(console.error + ':join:');
            filledPugs.length > 0 ? message.channel.send((0, _formats.broadCastFilledPugs)(filledPugs)) : null;
            return _context.abrupt('break', 61);

          case 52:
            _leaveGameType = (0, _pug.leaveGameType)(args, user, Pugs, PugList), _status = _leaveGameType.status, _result6 = _leaveGameType.result, _msg = _leaveGameType.msg;
            deadPugs = _result6.reduce(function (acc, _ref3) {
              var pug = _ref3.pug,
                  discriminator = _ref3.discriminator;

              if (pug) {
                revisePugList(discriminator, pug, pug.list.length === 0 ? 'remove' : 'update');
                pug.list.length === parseInt(pug.noPlayers) - 1 ? acc.push((0, _extends3.default)({}, pug, { user: user })) : null;
              }
              return acc;
            }, []);

            message.channel.send(_status ? (0, _formats.printPugLeaveStatus)(_result6) : _msg).catch(console.error + ':leave:');
            deadPugs.length > 0 ? message.channel.send((0, _formats.broadCastDeadPugs)(deadPugs)) : null;
            return _context.abrupt('break', 61);

          case 57:
            _listAvailablePugs = (0, _pug.listAvailablePugs)(args, PugList), _status2 = _listAvailablePugs.status, _result7 = _listAvailablePugs.result, _msg2 = _listAvailablePugs.msg;

            message.channel.send(_status2 ? (0, _formats.printPugStatuses)(_result7) : _msg2).catch(console.error + ':list:');
            return _context.abrupt('break', 61);

          case 60:
            console.log('no match');

          case 61:
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

var revisePugList = function revisePugList(discriminator, pug, action) {
  if (action === 'update') PugList[discriminator] = pug;else if (action === 'remove' && PugList[discriminator]) delete PugList[discriminator];
};
//# sourceMappingURL=bot.js.map