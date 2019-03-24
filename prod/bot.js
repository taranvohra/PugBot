'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var onMessage = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(message) {
    var serverId, Servers, roles, args, action, hasAdminCmd, server, gameServers, _server, _gameServers, result, _server2, _gameServers2, _result, _server3, _gameServers3, _result2;

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
            serverId = message.channel.guild.id;
            Servers = cachedDB;
            /* Register server into cache if it wasn't already in the remote DB*/

            !Servers[serverId] ? Servers[serverId] = {} : null;

            // const user = {
            //   id: message.author.id,
            //   username: fixSpecialCharactersInName(message.author.username),
            // };

            // const isUserMentioned = message.mentions.users.first();
            // const userMentioned = {
            //   id: isUserMentioned && isUserMentioned.id,
            //   username:
            //     isUserMentioned && fixSpecialCharactersInName(isUserMentioned.username),
            // };

            roles = message.member.roles;
            args = message.content.substring(_constants.prefix.length).split(' ').filter(Boolean);
            action = args[0] ? args[0].toLowerCase() : null;
            hasAdminCmd = _constants.commands.admincmds.includes(action);
            // const isValidAdminCmd = hasAdminCmd && checkIfRoleIsPrivileged(roles);

            _context.t0 = true;
            _context.next = _context.t0 === _constants.commands.servers.includes(action) ? 14 : _context.t0 === ((0, _helpers.checkIfRoleIsPrivileged)(roles) && _constants.commands.addqueryserver.includes(action)) ? 18 : _context.t0 === ((0, _helpers.checkIfRoleIsPrivileged)(roles) && _constants.commands.delqueryserver.includes(action)) ? 26 : _context.t0 === _constants.commands.queryut99server.includes(action) ? 34 : 41;
            break;

          case 14:
            server = Servers[serverId] || {};
            gameServers = (0, _util.createSortedArrayFromObject)(server['GameServers'] || {}, 'timestamp');


            message.channel.send((0, _formats.printGameServersList)(gameServers)).catch(console.error + ':list:');
            return _context.abrupt('break', 42);

          case 18:
            _server = Servers[serverId] || {};
            _gameServers = (0, _util.createSortedArrayFromObject)(_server['GameServers'] || {}, 'timestamp');
            _context.next = 22;
            return (0, _ut99query.addQueryServer)(args, serverId, _gameServers);

          case 22:
            result = _context.sent;

            result.status ? updateCache(serverId, 'GameServers', result.cache) : '';
            message.channel.send(result.msg);
            return _context.abrupt('break', 42);

          case 26:
            _server2 = Servers[serverId] || {};
            _gameServers2 = (0, _util.createSortedArrayFromObject)(_server2['GameServers'] || {}, 'timestamp');
            _context.next = 30;
            return (0, _ut99query.delQueryServer)(args, serverId, _gameServers2);

          case 30:
            _result = _context.sent;

            _result.status ? updateCache(serverId, 'GameServers', _result.cache) : '';
            message.channel.send(_result.msg);
            return _context.abrupt('break', 42);

          case 34:
            _server3 = Servers[serverId] || {};
            _gameServers3 = (0, _util.createSortedArrayFromObject)(_server3['GameServers'] || {}, 'timestamp');
            _context.next = 38;
            return (0, _ut99query.queryUT99Server)(args[1], _gameServers3);

          case 38:
            _result2 = _context.sent;

            message.channel.send(_result2.status ? (0, _formats.printServerStatus)(_result2) : _result2.msg).catch(console.error + ':query:');
            return _context.abrupt('break', 42);

          case 41:
            console.log('no match');

          case 42:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function onMessage(_x) {
    return _ref.apply(this, arguments);
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

var _constants = require('./constants');

var _ut99query = require('./ut99query');

var _formats = require('./formats');

var _helpers = require('./helpers');

var _util = require('./util');

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import {
//   addGameType,
//   delGameType,
//   joinGameType,
//   leaveGameType,
//   listAvailablePugs,
//   pickPugPlayer,
//   addCaptain,
//   listCurrentPickings,
//   promoteAvailablePugs,
// } from './pug';

// import pugEventEmitter from './pugEvent';
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

// bot.on(
//   'presenceUpdate',
//   (_, { user, guild: { channels }, presence: { status } }) => {
//     if (status === 'offline') {
//       if (
//         Object.values(PugList).some(p => p.list.some(u => u.id === user.id))
//       ) {
//         const { Channel = {} } = cachedDB;
//         const channel = channels.get(Channel.preferredChannel);
//         const channeluser = new User(bot, {
//           bot: false,
//           id: user.id,
//           username: user.username,
//         });
//         const message = new Message(
//           channel,
//           {
//             author: channeluser,
//             attachments: new Map(),
//             embeds: [],
//             content: `${prefix}lva ${offline}`,
//           },
//           bot
//         );
//         onMessage(message);
//       }
//     }
//   }
// );

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

var updateCache = function updateCache(serverId, toUpdate, newCache) {
  return cachedDB[serverId][toUpdate] = newCache;
};

// const revisePugList = (discriminator, pug, action) => {
//   if (action === 'update') PugList[discriminator] = pug;
//   else if (action === 'remove' && PugList[discriminator])
//     delete PugList[discriminator];
// };

/**
 * P U G
 *    E V E N T S
 */
// pugEventEmitter.on(pugEvents.captainsReady, discriminator => {
//   const { Channel = {} } = cachedDB;
//   const pug = PugList[discriminator];
//   bot.channels
//     .get(Channel.preferredChannel)
//     .send(broadCastCaptainsReady(pug))
//     .catch(console.error + ':broadCastCaptains:');
// });
//# sourceMappingURL=bot.js.map