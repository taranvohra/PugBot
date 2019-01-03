'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var prefix = exports.prefix = '~';
var offline = exports.offline = '..adios..';

var commands = exports.commands = {
  setchannel: ['setchannel'],
  addqueryserver: ['addqueryserver'],
  delqueryserver: ['delqueryserver'],
  updatequeryserver: ['updatequeryserver'],
  queryut99server: ['q', 'query'],
  servers: ['servers'],
  addgametype: ['addgametype', 'agm'],
  delgametype: ['delgametype', 'dgm'],
  joingametype: ['j', 'join', 'adminadd'],
  leavegametype: ['lva', 'l', 'leave'],
  listgametype: ['lsa', 'ls', 'list'],
  pickplayer: ['p', 'pick', 'adminpick'],
  captain: ['captain'],
  admincmds: ['adminadd', 'adminpick', 'adminremove']
};

var teams = exports.teams = {
  team_0: 'Red Team',
  team_1: 'Blue Team',
  team_2: 'Green Team',
  team_3: 'Gold Team',
  team_255: 'Players',
  spec: 'Spectators'
};

var privilegedRoles = exports.privilegedRoles = ['Admins', 'Moderators'];

var pugEvents = exports.pugEvents = {
  captainsReady: 'captainsReady'
};
//# sourceMappingURL=constants.js.map