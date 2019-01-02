import Discord from 'discord.js';
import {
  getPlayerList,
  getMinutesAndSeconds,
  padNumberWithZero,
  getTeamScores,
  getTeamIndex,
} from './helpers';
import { teams } from './constants';

export const printServerStatus = ({ info, players }) => {
  let richEmbed = new Discord.RichEmbed();

  const xServerQueryProps = { remainingTime: null, teamScores: {} };
  const playerList = getPlayerList(
    players,
    parseInt(info.numplayers) || 0,
    !!info.maxteams
  );

  // If XServerQuery response, then some more coooooooooool stuff
  if (info['xserverquery']) {
    const { minutes, seconds } = getMinutesAndSeconds(
      parseInt(info['remainingtime'])
    );
    const teamScores = getTeamScores(info, info.maxteams);

    xServerQueryProps.remainingTime = `${
      (minutes === parseInt(info.timelimit) && seconds === 0) ||
      minutes < parseInt(info.timelimit)
        ? '**Remaining Time:**'
        : '**Overtime**:'
    } ${padNumberWithZero(minutes)}:${padNumberWithZero(seconds)} \n`;
    xServerQueryProps.teamScores = Object.keys(teamScores).reduce(
      (acc, curr) => {
        const index = getTeamIndex(curr);
        acc[index] = ` | Score - ${teamScores[curr]}`;
        return acc;
      },
      []
    );
  }

  Object.keys(playerList).forEach(team => {
    const teamIndex = getTeamIndex(team);
    const p = playerList[team];
    const teamPlayers = p.reduce((acc, curr) => {
      acc = acc + curr + ' ' + '\n';
      return acc;
    }, '');
    p.length > 0
      ? richEmbed.addField(
          team + (xServerQueryProps.teamScores[teamIndex] || ``),
          teamPlayers,
          team !== teams.spec
        )
      : '';
  });

  const desc =
    `**Map:** ${info.mapname} \n **Players:** ${info.numplayers}/${
      info.maxplayers
    } \n ` + (xServerQueryProps.remainingTime || ``);
  const footerText = `unreal://${info.host}:${info.port}`;

  richEmbed.setTitle(info.hostname);
  richEmbed.setColor('#838282');
  richEmbed.setDescription(desc);
  richEmbed.setFooter(footerText);
  return richEmbed;
};

export const printServerList = cachedDB => {
  let richEmbed = new Discord.RichEmbed();

  const { desc } = cachedDB.reduce(
    (acc, curr, index) => {
      acc.desc += `\`${index + 1}\`\u00A0\u00A0\u00A0${curr.name}\n`;
      return acc;
    },
    {
      desc: '',
    }
  );

  richEmbed.setTitle(`IP\u00A0\u00A0\u00A0Name`);
  richEmbed.setColor('#838282');
  richEmbed.setDescription(desc);
  richEmbed.setFooter('To query, type .q ip');
  return richEmbed;
};

export const printPugJoinStatus = statuses => {
  const { joined, missed, nf, aj, user } = statuses.reduce(
    (acc, { joinStatus, user, discriminator, activeCount, noPlayers }) => {
      switch (joinStatus) {
        case -1:
          acc.nf += `No pug found: **${discriminator}**\n`;
          break;
        case 0:
          acc.missed += `Sorry, **${discriminator.toUpperCase()}** is already filled\n`;
          break;
        case 1:
          acc.joined += `**${discriminator.toUpperCase()}** (${activeCount}/${noPlayers}) :small_blue_diamond: `;
          break;
        case 2:
          acc.aj += `**${
            user.username
          }** has already joined **${discriminator.toUpperCase()}**`;
          break;
        default:
          null;
      }
      acc.user = user;
      return acc;
    },
    { joined: ``, missed: ``, nf: ``, aj: ``, user: null }
  );
  return `${
    joined.length > 0
      ? `${user.username} joined :small_blue_diamond: ${joined}`
      : ``
  } ${missed.length > 0 ? `\n${missed}` : ``} ${
    aj.length > 0 ? `\n${aj}` : ``
  } ${nf.length > 0 ? `\n${nf}` : ``}`;
};

export const printPugLeaveStatus = statuses => {
  const { left, nj, user } = statuses.reduce(
    (acc, { pug, user, discriminator }) => {
      if (pug) {
        acc.left += `**${discriminator.toUpperCase()}** (${pug.list.length}/${
          pug.noPlayers
        })  `;
        acc.user = user;
      } else acc.nj = `Cannot leave pug(s) you haven't joined :smart:`;
      return acc;
    },
    { user: null, left: ``, nj: `` }
  );
  const msg = `${left.length > 0 ? `${user.username} left  ${left}` : ``}${
    nj.length > 0 ? `\n${nj}` : ``
  }`;

  return msg || `There are no pugs to leave`;
};

export const printPugStatuses = statuses => {
  const msg = statuses.reduce(
    (acc, { discriminator, noPlayers, list, picking, withList }, i) => {
      if (withList) {
        const base = `**${discriminator.toUpperCase()}** :fire: Players (${
          picking ? noPlayers : list.length
        }/${noPlayers}):`;
        const players = list.reduce((acc, u) => {
          acc += `*${u.username}* `;
          return acc;
        }, ``);
        acc += `${base} ${players}\n`;
        return acc;
      } else {
        acc += `${
          i === 0 ? `:small_blue_diamond:` : ``
        } **${discriminator.toUpperCase()}** (${
          picking ? noPlayers : list.length
        }/${noPlayers}) :small_blue_diamond: `;
        return acc;
      }
    },
    ``
  );

  return msg || `There are currently no pugs :FeelsBadMan: , try joining one!`;
};

export const broadCastFilledPugs = filledPugs => {
  return filledPugs.reduce((acc, curr) => {
    const title = `**${curr.discriminator.toUpperCase()}** filled: `;
    const body = curr.list.reduce((prev, player) => {
      prev += `<@${player.id}> `;
      return prev;
    }, ``);
    const footer = `Type \`.captain\` to become a captain. Random capts will be picked in 30 seconds`;
    acc += `${title}\n${body}\n${footer}\n`;
    return acc;
  }, ``);
};

export const broadCastDeadPugs = deadPugs => {
  return deadPugs.reduce((acc, curr, i) => {
    acc += `${
      i > 0 ? `\n` : ``
    } :joy_cat: **${curr.discriminator.toUpperCase()}** was stopped because **${
      curr.user.username
    }** left :joy_cat:`;
    return acc;
  }, ``);
};

export const broadCastCaptainsReady = ({ list, captains }) => {
  const pugCaptains = captains.reduce((acc, curr, index) => {
    acc += `<@${curr.id}> is the captain for **${teams[`team_${index}`]}**\n`;
    return acc;
  }, ``);
  const turn = `<@${captains[0]['id']}> pick one for **${teams[`team_0`]}**`;
  const { players } = list.reduce(
    (acc, curr, index) => {
      if (curr.captain === null)
        acc.players += `**${index + 1}**) *${curr.username}*  `;
      return acc;
    },
    { players: `Players: ` }
  );
  return `${pugCaptains}\n${turn}\n${players}`;
};

export const printPickStatus = ({ pug, pickedPlayers, picking }) => {
  const picked = pickedPlayers.reduce((acc, curr) => {
    acc += `<@${curr.player.id}> was picked for **${
      teams[`team_${curr.team}`]
    }**\n`;
    return acc;
  }, ``);

  const next = pug.captains[pug.pickingOrder[pug.turn]];
  const turn = picking
    ? `<@${next.id}> pick one for **${teams[`team_${next.team}`]}**`
    : `**Picking has finished**`;

  const pugTeams = Array(pug.noTeams)
    .fill(0)
    .reduce((acc, curr, i) => {
      acc[i] = `**${teams[`team_${i}`]}**: `;
      return acc;
    }, {});

  const players = pug.list.reduce((acc, curr, index) => {
    if (curr.team === null) acc += `**${index + 1}**) *${curr.username}*  `;
    return acc;
  }, `Players: `);

  const currTeams = [...pug.list]
    .sort((a, b) => a.pick - b.pick)
    .reduce((acc, curr) => {
      if (curr.team !== null) acc[curr.team] += `*${curr.username}*  `;
      return acc;
    }, pugTeams);

  const activeTeams = Object.values(currTeams).reduce((acc, curr) => {
    acc += `${curr}\n`;
    return acc;
  }, ``);

  return `${picked}\n${turn}\n${picking ? `${players}\n` : ``}\n${activeTeams}`;
};

export const printAddCaptainStatus = (user, { pug, team }) => {
  return `**${user.username}** became captain for **${teams[
    `team_${team}`
  ].toUpperCase()}**`;
};
