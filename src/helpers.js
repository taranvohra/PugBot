import { teams, privilegedRoles } from './constants';

/**
 * @param {String} packet
 * @description Checks whether the packet is the last packet
 * @returns {Boolean}
 */
export const checkIfFinalPacket = packet =>
  packet
    .toString()
    .split('\\')
    .some(s => s === 'final');

/**
 * @param  {Array} array
 * @description Filters out falsy values from array
 * @returns {Array}
 */
export const filterFalsyValues = array => array.filter(v => Boolean(v));

/**
 * @param  {Array} array
 * @description Creates an object from an array by taking adjacent odd and even indexes
 * @returns {Object}
 */
export const createObjectFromArray = array => {
  return array.reduce((acc, item, index, arr) => {
    if (index % 2 === 0) acc[item.toLowerCase()] = arr[index + 1];
    return acc;
  }, {});
};

/**
 * @param {Object} cachedDB
 * @param {Number} index
 * @description Checks if Key exists
 */
export const checkKeyExistenceFromIndex = (cachedDB, index) =>
  !!cachedDB[index - 1];

/**
 * @param {Object} cachedDB
 * @param {Number} index
 * @description Obtains Host and Port of a server from cache
 */
export const getHostAndPortOfServerFromDB = (cachedDB, index) => [
  cachedDB[index - 1].host,
  cachedDB[index - 1].port,
];

/**
 * @param {Object} cachedDB
 * @param {Number} index
 * @description Obtains UID of a server from cache
 */
export const getUIDFromIndex = (cachedDB, index) =>
  (cachedDB.length > 0 && cachedDB[index - 1].id) || undefined;

/**
 * @param {Object} snapshot
 * @description returns a cache of database from firebase
 */
export const createCacheFromSnapshot = snapshot => {
  let cache = {};
  snapshot.forEach(child => {
    cache[child.key] = child.val();
  });
  return cache;
};

export const checkIfRoleIsPrivileged = roles =>
  privilegedRoles.some(r => roles.find(x => x.name === r));

/**
 * @param {Object} players
 * @param {Number} noOfPlayers
 * @param {Number} noOfTeams
 */
export const getPlayerList = (players, noOfPlayers, noOfTeams) => {
  let playerList = {
    [teams.team_0]: [],
    [teams.team_1]: [],
    [teams.team_2]: [],
    [teams.team_3]: [],
    [teams.team_255]: [],
    [teams.spec]: [],
  };

  for (let i = 0; i < noOfPlayers; i++) {
    const cFlag =
      !!players[`countryc_${i}`] && players[`countryc_${i}`] !== 'none'
        ? `:flag_${players[`countryc_${i}`]}:`
        : `:flag_white:`;

    const playerName =
      cFlag + ' ' + fixSpecialCharactersInName(players[`player_${i}`]);
    if (players[`mesh_${i}`] === 'Spectator') {
      playerList[teams.spec].push(playerName);
      continue;
    }

    if (noOfTeams > 0) {
      const team = parseInt(players[`team_${i}`]);
      playerList[Object.values(teams)[team]].push(playerName);
    } else playerList[teams.team_255].push(playerName);
  }
  return playerList;
};

export const getTeamScores = (info, maxTeams) => {
  let teamScores = {
    [teams.team_0]: [],
    [teams.team_1]: [],
    [teams.team_2]: [],
    [teams.team_3]: [],
  };

  for (let i = 0; i < maxTeams; i++) {
    teamScores[Object.values(teams)[i]] = info[`teamscore_${i}`];
  }
  return teamScores;
};

/**
 * @param {Number} noOfPlayers
 * @param {Number} noOfTeams
 * @description Obtains the picking order for pug. Returns 0 if invalid props. Returns [-1] for duels
 */
export const getPickingOrder = (noPlayers, noTeams) => {
  if (noPlayers < noTeams || noPlayers % noTeams !== 0) return 0;
  const pickingOrder = [];
  let idx = 0;
  let shouldSwitch = -1;
  let remainingPlayers = noPlayers - noTeams; // because captainsss
  while (remainingPlayers > 0) {
    pickingOrder.push(idx);
    shouldSwitch = (shouldSwitch + 1) % 2;
    idx = shouldSwitch === 0 ? (idx + 1) % noTeams : idx;
    remainingPlayers--;
  }
  return pickingOrder.length > 0 ? pickingOrder : [-1];
};

export const fixSpecialCharactersInName = name =>
  name.replace(/(\*|`|:)/g, c => '\\' + c);

export const padNumberWithZero = number =>
  number > -1 && number < 10 ? `0${number}` : `${number}`;

export const getMinutesAndSeconds = time => {
  const seconds = time % 60;
  const minutes = (time - seconds) / 60;
  return {
    seconds,
    minutes,
  };
};

export const getTeamIndex = teamName =>
  Object.values(teams).findIndex(t => t === teamName);
