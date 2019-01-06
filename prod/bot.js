'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

var onMessage = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(message) {
    var _cachedDB2, _cachedDB2$Servers, serversObj, _cachedDB2$Pugs, Pugs, user, isUserMentioned, userMentioned, roles, args, action, hasAdminCmd, isValidAdminCmd, channelId, result, Servers, _Servers, _result, _Servers2, _result2, _Servers3, _result3, _result4, _result5, _joinGameType, status, _result6, msg, filledPugs, forBroadcast, _leaveGameType2, _status, _result7, _msg2, deadPugs, _listAvailablePugs, _status2, _result8, _msg3, _pickPugPlayer, _status3, _result9, _msg4, _addCaptain, _status4, _result10, _msg5, _listCurrentPickings, _status5, _result11, _msg6, _promoteAvailablePugs, _status6, _result12, _msg7;

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
            _cachedDB2 = cachedDB, _cachedDB2$Servers = _cachedDB2.Servers, serversObj = _cachedDB2$Servers === undefined ? {} : _cachedDB2$Servers, _cachedDB2$Pugs = _cachedDB2.Pugs, Pugs = _cachedDB2$Pugs === undefined ? {} : _cachedDB2$Pugs;
            user = {
              id: message.author.id,
              username: (0, _helpers.fixSpecialCharactersInName)(message.author.username)
            };
            isUserMentioned = message.mentions.users.first();
            userMentioned = {
              id: isUserMentioned && isUserMentioned.id,
              username: isUserMentioned && (0, _helpers.fixSpecialCharactersInName)(isUserMentioned.username)
            };
            roles = message.member.roles;
            args = message.content.substring(_constants.prefix.length).split(' ').filter(Boolean);
            action = args[0].toLowerCase();
            hasAdminCmd = _constants.commands.admincmds.includes(action);
            isValidAdminCmd = hasAdminCmd && (0, _helpers.checkIfRoleIsPrivileged)(roles);
            _context.t0 = true;
            _context.next = _context.t0 === ((0, _helpers.checkIfRoleIsPrivileged)(roles) && _constants.commands.setchannel.includes(action)) ? 16 : _context.t0 === _constants.commands.servers.includes(action) ? 23 : _context.t0 === ((0, _helpers.checkIfRoleIsPrivileged)(roles) && _constants.commands.addqueryserver.includes(action)) ? 26 : _context.t0 === ((0, _helpers.checkIfRoleIsPrivileged)(roles) && _constants.commands.delqueryserver.includes(action)) ? 33 : _context.t0 === _constants.commands.queryut99server.includes(action) ? 40 : _context.t0 === _constants.commands.addgametype.includes(action) ? 46 : _context.t0 === _constants.commands.delgametype.includes(action) ? 52 : _context.t0 === _constants.commands.joingametype.includes(action) ? 58 : _context.t0 === _constants.commands.leavegametype.includes(action) ? 66 : _context.t0 === _constants.commands.listgametype.includes(action) ? 71 : _context.t0 === _constants.commands.pickplayer.includes(action) ? 74 : _context.t0 === _constants.commands.captain.includes(action) ? 80 : _context.t0 === _constants.commands.picking.includes(action) ? 86 : _context.t0 === _constants.commands.promote.includes(action) ? 89 : 92;
            break;

          case 16:
            channelId = message.channel.id;
            _context.next = 19;
            return (0, _ut99query.setPreferredChannel)(channelId);

          case 19:
            result = _context.sent;

            result.status ? updateCache('Channel', result.cache) : '';
            message.channel.send(result.msg);
            return _context.abrupt('break', 93);

          case 23:
            Servers = (0, _util.createSortedArrayFromObject)(serversObj, 'timestamp');

            message.channel.send((0, _formats.printServerList)(Servers)).catch(console.error + ':list:');
            return _context.abrupt('break', 93);

          case 26:
            _Servers = (0, _util.createSortedArrayFromObject)(serversObj);
            _context.next = 29;
            return (0, _ut99query.addQueryServer)(args, _Servers);

          case 29:
            _result = _context.sent;

            _result.status ? updateCache('Servers', _result.cache) : '';
            message.channel.send(_result.msg);
            return _context.abrupt('break', 93);

          case 33:
            _Servers2 = (0, _util.createSortedArrayFromObject)(serversObj);
            _context.next = 36;
            return (0, _ut99query.delQueryServer)(args, _Servers2);

          case 36:
            _result2 = _context.sent;

            _result2.status ? updateCache('Servers', _result2.cache) : '';
            message.channel.send(_result2.msg);
            return _context.abrupt('break', 93);

          case 40:
            _Servers3 = (0, _util.createSortedArrayFromObject)(serversObj, 'timestamp');
            _context.next = 43;
            return (0, _ut99query.queryUT99Server)(args[1], _Servers3);

          case 43:
            _result3 = _context.sent;

            message.channel.send(_result3.status ? (0, _formats.printServerStatus)(_result3) : _result3.msg).catch(console.error + ':query:');
            return _context.abrupt('break', 93);

          case 46:
            _context.next = 48;
            return (0, _pug.addGameType)(args, Pugs);

          case 48:
            _result4 = _context.sent;

            _result4.status ? updateCache('Pugs', _result4.cache) : '';
            message.channel.send(_result4.msg);
            return _context.abrupt('break', 93);

          case 52:
            _context.next = 54;
            return (0, _pug.delGameType)(args, Pugs);

          case 54:
            _result5 = _context.sent;

            _result5.status ? updateCache('Pugs', _result5.cache) : '';
            message.channel.send(_result5.msg);
            return _context.abrupt('break', 93);

          case 58:
            if (!(hasAdminCmd && !isValidAdminCmd)) {
              _context.next = 60;
              break;
            }

            return _context.abrupt('break', 93);

          case 60:
            _joinGameType = (0, _pug.joinGameType)(isValidAdminCmd ? args.slice(1) : args, isValidAdminCmd ? userMentioned : user, Pugs, PugList), status = _joinGameType.status, _result6 = _joinGameType.result, msg = _joinGameType.msg;
            filledPugs = _result6.reduce(function (acc, _ref3) {
              var pug = _ref3.pug,
                  discriminator = _ref3.discriminator;

              if (pug) {
                revisePugList(discriminator, pug, 'update');
                pug.list.length === parseInt(pug.noPlayers) ? acc.push(pug) : null;
              }
              return acc;
            }, []);

            message.channel.send(status ? (0, _formats.printPugJoinStatus)(_result6) : msg).catch(console.error + ':join:');

            forBroadcast = filledPugs.map(function (pug) {
              if (PugList[pug.discriminator].picking) {
                var allLeaveMsgs = (0, _values2.default)(PugList).reduce(function (acc, op) {
                  if (pug.discriminator !== op.discriminator) {
                    var allPugLeaveMsgs = pug.list.reduce(function (prev, user) {
                      var _leaveGameType = (0, _pug.leaveGameType)(['l', op.discriminator], user, Pugs, PugList),
                          result = _leaveGameType.result;

                      if (result[0].pug) {
                        revisePugList(op.discriminator, result[0].pug, result[0].pug.list.length === 0 ? 'remove' : 'update');
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

            forBroadcast.length > 0 ? message.channel.send((0, _formats.broadCastFilledPugs)(forBroadcast.filter(Boolean))) : null;
            return _context.abrupt('break', 93);

          case 66:
            _leaveGameType2 = (0, _pug.leaveGameType)(args, user, Pugs, PugList), _status = _leaveGameType2.status, _result7 = _leaveGameType2.result, _msg2 = _leaveGameType2.msg;
            deadPugs = _result7.reduce(function (acc, _ref4) {
              var pug = _ref4.pug,
                  discriminator = _ref4.discriminator;

              if (pug) {
                revisePugList(discriminator, pug, pug.list.length === 0 ? 'remove' : 'update');
                pug.list.length === parseInt(pug.noPlayers) - 1 ? acc.push((0, _extends3.default)({}, pug, { user: user })) : null;
              }
              return acc;
            }, []);

            message.channel.send(_status ? (0, _formats.printPugLeaveStatus)(_result7, args[1] === _constants.offline) : _msg2).catch(console.error + ':leave:');
            deadPugs.length > 0 ? message.channel.send((0, _formats.broadCastDeadPugs)(deadPugs)) : null;
            return _context.abrupt('break', 93);

          case 71:
            _listAvailablePugs = (0, _pug.listAvailablePugs)(args, PugList), _status2 = _listAvailablePugs.status, _result8 = _listAvailablePugs.result, _msg3 = _listAvailablePugs.msg;

            message.channel.send(_status2 ? (0, _formats.printPugStatuses)(_result8) : _msg3).catch(console.error + ':list:');
            return _context.abrupt('break', 93);

          case 74:
            if (!(hasAdminCmd && !isValidAdminCmd)) {
              _context.next = 76;
              break;
            }

            return _context.abrupt('break', 93);

          case 76:
            _pickPugPlayer = (0, _pug.pickPugPlayer)(isValidAdminCmd ? args.slice(1) : args, isValidAdminCmd ? userMentioned : user, PugList), _status3 = _pickPugPlayer.status, _result9 = _pickPugPlayer.result, _msg4 = _pickPugPlayer.msg;


            _status3 ? revisePugList(_result9.pug.discriminator, _result9.pug, !_result9.picking ? 'remove' : 'update') : null;
            message.channel.send(_status3 ? (0, _formats.printPickStatus)(_result9) : _msg4 || '**' + _result9.pickedPlayers.username + '** is already picked').catch(console.error + ':pick:');
            return _context.abrupt('break', 93);

          case 80:
            _addCaptain = (0, _pug.addCaptain)(user, PugList), _status4 = _addCaptain.status, _result10 = _addCaptain.result, _msg5 = _addCaptain.msg;

            _status4 ? revisePugList(_result10.pug.discriminator, _result10.pug, 'update') : null;
            _context.next = 84;
            return message.channel.send(_status4 ? (0, _formats.printAddCaptainStatus)(user, _result10) : _msg5).catch(console.error + ':pick:');

          case 84:

            _status4 && _result10.captainsReady ? _pugEvent2.default.emit(_constants.pugEvents.captainsReady, _result10.pug.discriminator) : null;
            return _context.abrupt('break', 93);

          case 86:
            _listCurrentPickings = (0, _pug.listCurrentPickings)(args, Pugs, PugList), _status5 = _listCurrentPickings.status, _result11 = _listCurrentPickings.result, _msg6 = _listCurrentPickings.msg;

            message.channel.send(_status5 ? (0, _formats.printPickingPugsStatus)(_result11.pugs) : _msg6);
            return _context.abrupt('break', 93);

          case 89:
            _promoteAvailablePugs = (0, _pug.promoteAvailablePugs)(args, PugList), _status6 = _promoteAvailablePugs.status, _result12 = _promoteAvailablePugs.result, _msg7 = _promoteAvailablePugs.msg;

            _status6 ? message.channel.send((0, _formats.printPromoteStatus)(_result12.pugs)) : null;
            return _context.abrupt('break', 93);

          case 92:
            console.log('no match');

          case 93:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function onMessage(_x) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * C A C H E
 *    S E T U P
 *       A N D
 *         M A N I P U L A T I O N
 */

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

bot.on('presenceUpdate', function (_, _ref) {
  var user = _ref.user,
      channels = _ref.guild.channels,
      status = _ref.presence.status;

  if (status === 'offline') {
    if ((0, _values2.default)(PugList).some(function (p) {
      return p.list.some(function (u) {
        return u.id === user.id;
      });
    })) {
      var _cachedDB = cachedDB,
          _cachedDB$Channel = _cachedDB.Channel,
          Channel = _cachedDB$Channel === undefined ? {} : _cachedDB$Channel;

      var channel = channels.get(Channel.preferredChannel);
      var channeluser = new _discord.User(bot, {
        bot: false,
        id: user.id,
        username: user.username
      });
      var message = new _discord.Message(channel, {
        author: channeluser,
        attachments: new _map2.default(),
        embeds: [],
        content: _constants.prefix + 'lva ' + _constants.offline
      }, bot);
      onMessage(message);
    }
  }
});

bot.on('message', onMessage);

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

/**
 * P U G
 *    E V E N T S
 */
_pugEvent2.default.on(_constants.pugEvents.captainsReady, function (discriminator) {
  var _cachedDB3 = cachedDB,
      _cachedDB3$Channel = _cachedDB3.Channel,
      Channel = _cachedDB3$Channel === undefined ? {} : _cachedDB3$Channel;

  var pug = PugList[discriminator];
  bot.channels.get(Channel.preferredChannel).send((0, _formats.broadCastCaptainsReady)(pug)).catch(console.error + ':broadCastCaptains:');
});
//# sourceMappingURL=bot.js.map