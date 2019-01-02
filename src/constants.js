export const prefix = '~';

export const commands = {
  setchannel: ['setchannel'],
  addqueryserver: ['addqueryserver'],
  delqueryserver: ['delqueryserver'],
  updatequeryserver: ['updatequeryserver'],
  queryut99server: ['q', 'query'],
  servers: ['servers'],
  addgametype: ['addgametype', 'agm'],
  delgametype: ['delgametype', 'dgm'],
  joingametype: ['j', 'join'],
  leavegametype: ['lva', 'l', 'leave'],
  listgametype: ['lsa', 'ls', 'list'],
  pickplayer: ['p', 'pick'],
  captain: ['captain'],
  adminadd: ['adminadd'],
};

export const teams = {
  team_0: 'Red Team',
  team_1: 'Blue Team',
  team_2: 'Green Team',
  team_3: 'Gold Team',
  team_255: 'Players',
  spec: 'Spectators',
};

export const privilegedRoles = ['Admins', 'Moderators'];

export const pugEvents = {
  captainsReady: 'captainsReady',
};
