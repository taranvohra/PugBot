'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _discord = require('discord.js');

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _pugEvent = require('./pugEvent');

var _pugEvent2 = _interopRequireDefault(_pugEvent);

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
    var _cachedDB, _cachedDB$Servers, serversObj, _cachedDB$Pugs, Pugs, user, args, action, roles, channelId, result, Servers, _Servers, _result, _Servers2, _result2, _Servers3, _result3, _result4, _result5, _joinGameType, status, _result6, msg, filledPugs, forBroadcast, _leaveGameType2, _status, _result7, _msg2, deadPugs, _listAvailablePugs, _status2, _result8, _msg3, _pickPugPlayer, _status3, _result9, _msg4, _addCaptain, _status4, _result10, _msg5;

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
            _context.next = _context.t0 === ((0, _helpers.checkIfRoleIsPrivileged)(roles) && _constants.commands.setchannel.includes(action)) ? 12 : _context.t0 === _constants.commands.servers.includes(action) ? 19 : _context.t0 === ((0, _helpers.checkIfRoleIsPrivileged)(roles) && _constants.commands.addqueryserver.includes(action)) ? 22 : _context.t0 === ((0, _helpers.checkIfRoleIsPrivileged)(roles) && _constants.commands.delqueryserver.includes(action)) ? 29 : _context.t0 === _constants.commands.queryut99server.includes(action) ? 36 : _context.t0 === _constants.commands.addgametype.includes(action) ? 42 : _context.t0 === _constants.commands.delgametype.includes(action) ? 48 : _context.t0 === _constants.commands.joingametype.includes(action) ? 54 : _context.t0 === _constants.commands.leavegametype.includes(action) ? 60 : _context.t0 === _constants.commands.listgametype.includes(action) ? 65 : _context.t0 === _constants.commands.pickplayer.includes(action) ? 68 : _context.t0 === _constants.commands.captain.includes(action) ? 72 : 78;
            break;

          case 12:
            channelId = message.channel.id;
            _context.next = 15;
            return (0, _ut99query.setPreferredChannel)(channelId);

          case 15:
            result = _context.sent;

            result.status ? updateCache('Servers', result.cache) : '';
            message.channel.send(result.msg);
            return _context.abrupt('break', 79);

          case 19:
            Servers = (0, _util.createSortedArrayFromObject)(serversObj, 'timestamp');

            message.channel.send((0, _formats.printServerList)(Servers)).catch(console.error + ':list:');
            return _context.abrupt('break', 79);

          case 22:
            _Servers = (0, _util.createSortedArrayFromObject)(serversObj);
            _context.next = 25;
            return (0, _ut99query.addQueryServer)(args, _Servers);

          case 25:
            _result = _context.sent;

            _result.status ? updateCache('Servers', _result.cache) : '';
            message.channel.send(_result.msg);
            return _context.abrupt('break', 79);

          case 29:
            _Servers2 = (0, _util.createSortedArrayFromObject)(serversObj);
            _context.next = 32;
            return (0, _ut99query.delQueryServer)(args, _Servers2);

          case 32:
            _result2 = _context.sent;

            _result2.status ? updateCache('Servers', _result2.cache) : '';
            message.channel.send(_result2.msg);
            return _context.abrupt('break', 79);

          case 36:
            _Servers3 = (0, _util.createSortedArrayFromObject)(serversObj, 'timestamp');
            _context.next = 39;
            return (0, _ut99query.queryUT99Server)(args[1], _Servers3);

          case 39:
            _result3 = _context.sent;

            message.channel.send(_result3.status ? (0, _formats.printServerStatus)(_result3) : _result3.msg).catch(console.error + ':query:');
            return _context.abrupt('break', 79);

          case 42:
            _context.next = 44;
            return (0, _pug.addGameType)(args, Pugs);

          case 44:
            _result4 = _context.sent;

            _result4.status ? updateCache('Pugs', _result4.cache) : '';
            message.channel.send(_result4.msg);
            return _context.abrupt('break', 79);

          case 48:
            _context.next = 50;
            return (0, _pug.delGameType)(args, Pugs);

          case 50:
            _result5 = _context.sent;

            _result5.status ? updateCache('Pugs', _result5.cache) : '';
            message.channel.send(_result5.msg);
            return _context.abrupt('break', 79);

          case 54:
            _joinGameType = (0, _pug.joinGameType)(args, user, Pugs, PugList), status = _joinGameType.status, _result6 = _joinGameType.result, msg = _joinGameType.msg;
            filledPugs = _result6.reduce(function (acc, _ref2) {
              var pug = _ref2.pug,
                  discriminator = _ref2.discriminator;

              if (pug) {
                revisePugList(discriminator, pug, 'update');
                pug.list.length === parseInt(pug.noPlayers) ? acc.push(pug) : null;
              }
              return acc;
            }, []);

            message.channel.send(status ? (0, _formats.printPugJoinStatus)(_result6) : msg).catch(console.error + ':join:');

            forBroadcast = filledPugs.map(function (pug) {
              if (pug.list.length === pug.noPlayers) {
                var allLeaveMsgs = (0, _values2.default)(PugList).reduce(function (acc, ap) {
                  if (pug.discriminator !== ap.discriminator) {
                    var allPugLeaveMsgs = pug.list.reduce(function (prev, user) {
                      var _leaveGameType = (0, _pug.leaveGameType)(['l', ap.discriminator], user, Pugs, PugList),
                          result = _leaveGameType.result;

                      if (result[0].pug) {
                        revisePugList(ap.discriminator, result[0].pug, result[0].pug.list.length === 0 ? 'remove' : 'update');
                        var _msg = (0, _formats.printPugLeaveStatus)(result);
                        prev += _msg + ' ';
                      }
                      return prev;
                    }, '');
                    acc += allPugLeaveMsgs + ' \n';
                  }
                  return acc;
                }, '');
                allLeaveMsgs && message.channel.send(allLeaveMsgs);
                return pug;
              }
            });

            forBroadcast.length > 0 ? message.channel.send((0, _formats.broadCastFilledPugs)(forBroadcast)) : null;
            return _context.abrupt('break', 79);

          case 60:
            _leaveGameType2 = (0, _pug.leaveGameType)(args, user, Pugs, PugList), _status = _leaveGameType2.status, _result7 = _leaveGameType2.result, _msg2 = _leaveGameType2.msg;
            deadPugs = _result7.reduce(function (acc, _ref3) {
              var pug = _ref3.pug,
                  discriminator = _ref3.discriminator;

              if (pug) {
                revisePugList(discriminator, pug, pug.list.length === 0 ? 'remove' : 'update');
                pug.list.length === parseInt(pug.noPlayers) - 1 ? acc.push((0, _extends3.default)({}, pug, { user: user })) : null;
              }
              return acc;
            }, []);

            message.channel.send(_status ? (0, _formats.printPugLeaveStatus)(_result7) : _msg2).catch(console.error + ':leave:');
            deadPugs.length > 0 ? message.channel.send((0, _formats.broadCastDeadPugs)(deadPugs)) : null;
            return _context.abrupt('break', 79);

          case 65:
            _listAvailablePugs = (0, _pug.listAvailablePugs)(args, PugList), _status2 = _listAvailablePugs.status, _result8 = _listAvailablePugs.result, _msg3 = _listAvailablePugs.msg;

            message.channel.send(_status2 ? (0, _formats.printPugStatuses)(_result8) : _msg3).catch(console.error + ':list:');
            return _context.abrupt('break', 79);

          case 68:
            _pickPugPlayer = (0, _pug.pickPugPlayer)(args, user, PugList), _status3 = _pickPugPlayer.status, _result9 = _pickPugPlayer.result, _msg4 = _pickPugPlayer.msg;

            _status3 ? revisePugList(_result9.pug.discriminator, _result9.pug, !_result9.picking ? 'remove' : 'update') : null;
            message.channel.send(_status3 ? (0, _formats.printPickStatus)(_result9) : _msg4 || '**' + _result9.pickedPlayers.username + '** is already picked').catch(console.error + ':pick:');
            return _context.abrupt('break', 79);

          case 72:
            _addCaptain = (0, _pug.addCaptain)(user, PugList), _status4 = _addCaptain.status, _result10 = _addCaptain.result, _msg5 = _addCaptain.msg;

            _status4 ? revisePugList(_result10.pug.discriminator, _result10.pug, 'update') : null;
            _context.next = 76;
            return message.channel.send(_status4 ? (0, _formats.printAddCaptainStatus)(user, _result10) : _msg5).catch(console.error + ':pick:');

          case 76:

            _status4 && _result10.captainsReady ? _pugEvent2.default.emit(_constants.pugEvents.captainsReady, _result10.pug.discriminator) : null;
            return _context.abrupt('break', 79);

          case 78:
            console.log('no match');

          case 79:
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

/*
  Events emitted for pugs
*/
_pugEvent2.default.on(_constants.pugEvents.captainsReady, function (discriminator) {
  var _cachedDB2 = cachedDB,
      _cachedDB2$Channel = _cachedDB2.Channel,
      Channel = _cachedDB2$Channel === undefined ? {} : _cachedDB2$Channel;

  var pug = PugList[discriminator];
  bot.channels.get(Channel.preferredChannel).send((0, _formats.broadCastCaptainsReady)(pug)).catch(console.error + ':broadCastCaptains:');
});
//# sourceMappingURL=bot.js.map