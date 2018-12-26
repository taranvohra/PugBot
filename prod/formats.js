'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.broadCastDeadPugs = exports.broadCastFilledPugs = exports.printPugStatuses = exports.printPugLeaveStatus = exports.printPugJoinStatus = exports.printServerList = exports.printServerStatus = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _discord = require('discord.js');

var _discord2 = _interopRequireDefault(_discord);

var _helpers = require('./helpers');

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var printServerStatus = exports.printServerStatus = function printServerStatus(_ref) {
  var info = _ref.info,
      players = _ref.players;

  var richEmbed = new _discord2.default.RichEmbed();

  var xServerQueryProps = { remainingTime: null, teamScores: {} };
  var playerList = (0, _helpers.getPlayerList)(players, parseInt(info.numplayers) || 0, !!info.maxteams);

  // If XServerQuery response, then some more coooooooooool stuff
  if (info['xserverquery']) {
    var _getMinutesAndSeconds = (0, _helpers.getMinutesAndSeconds)(parseInt(info['remainingtime'])),
        minutes = _getMinutesAndSeconds.minutes,
        seconds = _getMinutesAndSeconds.seconds;

    var teamScores = (0, _helpers.getTeamScores)(info, info.maxteams);

    xServerQueryProps.remainingTime = (minutes === parseInt(info.timelimit) && seconds === 0 || minutes < parseInt(info.timelimit) ? '**Remaining Time:**' : '**Overtime**:') + ' ' + (0, _helpers.padNumberWithZero)(minutes) + ':' + (0, _helpers.padNumberWithZero)(seconds) + ' \n';
    xServerQueryProps.teamScores = (0, _keys2.default)(teamScores).reduce(function (acc, curr) {
      var index = (0, _helpers.getTeamIndex)(curr);
      acc[index] = ' | Score - ' + teamScores[curr];
      return acc;
    }, []);
  }

  (0, _keys2.default)(playerList).forEach(function (team) {
    var teamIndex = (0, _helpers.getTeamIndex)(team);
    var p = playerList[team];
    var teamPlayers = p.reduce(function (acc, curr) {
      acc = acc + curr + ' ' + '\n';
      return acc;
    }, '');
    p.length > 0 ? richEmbed.addField(team + (xServerQueryProps.teamScores[teamIndex] || ''), teamPlayers, team !== _constants.teams.spec) : '';
  });

  var desc = '**Map:** ' + info.mapname + ' \n **Players:** ' + info.numplayers + '/' + info.maxplayers + ' \n ' + (xServerQueryProps.remainingTime || '');
  var footerText = 'unreal://' + info.host + ':' + info.port;

  richEmbed.setTitle(info.hostname);
  richEmbed.setColor('#838282');
  richEmbed.setDescription(desc);
  richEmbed.setFooter(footerText);
  return richEmbed;
};

var printServerList = exports.printServerList = function printServerList(cachedDB) {
  var richEmbed = new _discord2.default.RichEmbed();

  var _cachedDB$reduce = cachedDB.reduce(function (acc, curr, index) {
    acc.desc += '`' + (index + 1) + '`\xA0\xA0\xA0' + curr.name + '\n';
    return acc;
  }, {
    desc: ''
  }),
      desc = _cachedDB$reduce.desc;

  richEmbed.setTitle('IP\xA0\xA0\xA0Name');
  richEmbed.setColor('#838282');
  richEmbed.setDescription(desc);
  richEmbed.setFooter('To query, type .q ip');
  return richEmbed;
};

var printPugJoinStatus = exports.printPugJoinStatus = function printPugJoinStatus(statuses) {
  var _statuses$reduce = statuses.reduce(function (acc, _ref2) {
    var joinStatus = _ref2.joinStatus,
        user = _ref2.user,
        discriminator = _ref2.discriminator,
        activeCount = _ref2.activeCount,
        noPlayers = _ref2.noPlayers;

    switch (joinStatus) {
      case -1:
        acc.nf += 'No pug found: **' + discriminator + '**\n';
        break;
      case 0:
        acc.missed += 'Sorry, **' + discriminator.toUpperCase() + '** is already filled\n';
        break;
      case 1:
        acc.joined += '**' + discriminator.toUpperCase() + '** (' + activeCount + '/' + noPlayers + ') :small_blue_diamond: ';
        break;
      case 2:
        acc.aj += 'You have already joined **' + discriminator.toUpperCase() + '**';
        break;
      default:
        null;
    }
    acc.user = user;
    return acc;
  }, { joined: '', missed: '', nf: '', aj: '', user: null }),
      joined = _statuses$reduce.joined,
      missed = _statuses$reduce.missed,
      nf = _statuses$reduce.nf,
      aj = _statuses$reduce.aj,
      user = _statuses$reduce.user;

  return (joined.length > 0 ? user.username + ' joined :small_blue_diamond: ' + joined : '') + ' ' + (missed.length > 0 ? '\n' + missed : '') + ' ' + (aj.length > 0 ? '\n' + aj : '') + ' ' + (nf.length > 0 ? '\n' + nf : '');
};

var printPugLeaveStatus = exports.printPugLeaveStatus = function printPugLeaveStatus(statuses) {
  var _statuses$reduce2 = statuses.reduce(function (acc, _ref3) {
    var pug = _ref3.pug,
        user = _ref3.user,
        discriminator = _ref3.discriminator;

    if (pug) {
      acc.joined += '**' + discriminator.toUpperCase() + '** ';
      acc.user = user;
    } else acc.nj = 'Cannot leave pug(s) you haven\'t joined :smart:';
    return acc;
  }, { user: null, joined: '', nj: '' }),
      joined = _statuses$reduce2.joined,
      nj = _statuses$reduce2.nj,
      user = _statuses$reduce2.user;

  var msg = '' + (joined.length > 0 ? user.username + ' left ' + joined : '') + (nj.length > 0 ? '\n' + nj : '');

  return msg || 'There are no pugs to leave';
};

var printPugStatuses = exports.printPugStatuses = function printPugStatuses(statuses) {
  var msg = statuses.reduce(function (acc, _ref4, i) {
    var discriminator = _ref4.discriminator,
        noPlayers = _ref4.noPlayers,
        list = _ref4.list,
        picking = _ref4.picking,
        withList = _ref4.withList;

    if (withList) {
      var base = '**' + discriminator.toUpperCase() + '** :fire: Players (' + (picking ? noPlayers : list.length) + '/' + noPlayers + '):';
      var players = list.reduce(function (acc, u) {
        acc += '*' + u.username + '* ';
        return acc;
      }, '');
      acc += base + ' ' + players + '\n';
      return acc;
    } else {
      acc += (i === 0 ? ':small_blue_diamond' : '') + ' **' + discriminator.toUpperCase() + '** (' + (picking ? noPlayers : list.length) + '/' + noPlayers + ') :small_blue_diamond: ';
      return acc;
    }
  }, '');

  return msg || 'There are currently no pugs :FeelsBadMan:, try joining one!';
};

var broadCastFilledPugs = exports.broadCastFilledPugs = function broadCastFilledPugs(filledPugs) {
  return filledPugs.reduce(function (acc, curr) {
    var title = '**' + curr.discriminator.toUpperCase() + '** filled:';
    var body = curr.list.reduce(function (prev, player) {
      prev += '<@' + player.id + '> ';
      return prev;
    }, '');
    var footer = 'Type `.captain` to become a captain. Random capts will be picked in 30 seconds';
    acc += title + '\n' + body + '\n' + footer + '\n';
    return acc;
  }, '');
};

var broadCastDeadPugs = exports.broadCastDeadPugs = function broadCastDeadPugs(deadPugs) {
  return deadPugs.reduce(function (acc, curr, i) {
    acc += (i > 0 ? '\n' : '') + ' :joy_cat: **' + curr.discriminator.toUpperCase() + '** was stopped because ' + curr.user.username + ' left :joy_cat:';
    return acc;
  }, '');
};
//# sourceMappingURL=formats.js.map