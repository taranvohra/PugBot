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
          acc.aj += `You have already joined **${discriminator.toUpperCase()}**`;
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
  const { joined, nj, user } = statuses.reduce(
    (acc, { pug, user, discriminator }) => {
      if (pug) {
        acc.joined += `**${discriminator.toUpperCase()}** `;
        acc.user = user;
      } else acc.nj = `Cannot leave pug(s) you haven't joined :smart:`;
      return acc;
    },
    { user: null, joined: ``, nj: `` }
  );
  const msg = `${joined.length > 0 ? `${user.username} left ${joined}` : ``}${
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

  return msg || `There are currently no pugs :FeelsBadMan:, try joining one!`;
};

export const broadCastFilledPugs = filledPugs => {
  return filledPugs.reduce((acc, curr) => {
    const title = `**${curr.discriminator.toUpperCase()}** filled:`;
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
    } :joy_cat: **${curr.discriminator.toUpperCase()}** was stopped because ${
      curr.user.username
    } left :joy_cat:`;
    return acc;
  }, ``);
};
