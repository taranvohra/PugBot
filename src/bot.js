import { Client, Message, User } from 'discord.js';
import dotenv from 'dotenv';
import pugEventEmitter from './pugEvent';
import { prefix, commands, pugEvents, offline } from './constants';
import {
  addQueryServer,
  queryUT99Server,
  delQueryServer,
  setPreferredChannel,
} from './ut99query';
import {
  addGameType,
  delGameType,
  joinGameType,
  leaveGameType,
  listAvailablePugs,
  pickPugPlayer,
  addCaptain,
} from './pug';
import {
  printServerStatus,
  printServerList,
  printPugJoinStatus,
  printPugLeaveStatus,
  printPugStatuses,
  broadCastFilledPugs,
  broadCastDeadPugs,
  broadCastCaptainsReady,
  printPickStatus,
  printAddCaptainStatus,
} from './formats';
import { checkIfRoleIsPrivileged, fixSpecialCharactersInName } from './helpers';
import { createSortedArrayFromObject } from './util';
import API from './api';

dotenv.config();

/**
 * PugList is list of pugs active at any moment on the server
 * Pugs are the pug(s)/gametype(s) registered on the server with their props
 */

let cachedDB = {};
let PugList = {};

const disabledEvents = ['TYPING_START', 'CHANNEL_UPDATE', 'USER_UPDATE'];
const bot = new Client({ disabledEvents });

bot.on('ready', () => {
  console.log('ready');
});

bot.on(
  'presenceUpdate',
  (_, { user, guild: { channels }, presence: { status } }) => {
    if (status === 'offline') {
      if (
        Object.values(PugList).some(p => p.list.some(u => u.id === user.id))
      ) {
        const { Channel = {} } = cachedDB;
        const channel = channels.get(Channel.preferredChannel);
        const channeluser = new User(bot, {
          bot: false,
          id: user.id,
          username: user.username,
        });
        const message = new Message(
          channel,
          {
            author: channeluser,
            attachments: new Map(),
            embeds: [],
            content: `${prefix}lva ${offline}`,
          },
          bot
        );
        onMessage(message);
      }
    }
  }
);

bot.on('message', onMessage);

async function onMessage(message) {
  if (message.author.equals(bot.user)) return;
  if (!message.content.startsWith(prefix)) return;

  const { Servers: serversObj = {}, Pugs = {} } = cachedDB;

  const user = {
    id: message.author.id,
    username: fixSpecialCharactersInName(message.author.username),
  };

  const isUserMentioned = message.mentions.users.first();
  const userMentioned = {
    id: isUserMentioned && isUserMentioned.id,
    username:
      isUserMentioned && fixSpecialCharactersInName(isUserMentioned.username),
  };

  const roles = message.member.roles;
  const args = message.content
    .substring(prefix.length)
    .split(' ')
    .filter(Boolean);
  const action = args[0].toLowerCase();

  const hasAdminCmd = commands.admincmds.includes(action);
  const isValidAdminCmd = hasAdminCmd && checkIfRoleIsPrivileged(roles);

  switch (true) {
    case checkIfRoleIsPrivileged(roles) &&
      commands.setchannel.includes(action): {
      const channelId = message.channel.id;
      const result = await setPreferredChannel(channelId);
      result.status ? updateCache('Channel', result.cache) : '';
      message.channel.send(result.msg);
      break;
    }

    case commands.servers.includes(action): {
      const Servers = createSortedArrayFromObject(serversObj, 'timestamp');
      message.channel
        .send(printServerList(Servers))
        .catch(console.error + ':list:');
      break;
    }

    case checkIfRoleIsPrivileged(roles) &&
      commands.addqueryserver.includes(action): {
      const Servers = createSortedArrayFromObject(serversObj);
      const result = await addQueryServer(args, Servers);
      result.status ? updateCache('Servers', result.cache) : '';
      message.channel.send(result.msg);
      break;
    }

    case checkIfRoleIsPrivileged(roles) &&
      commands.delqueryserver.includes(action): {
      const Servers = createSortedArrayFromObject(serversObj);
      const result = await delQueryServer(args, Servers);
      result.status ? updateCache('Servers', result.cache) : '';
      message.channel.send(result.msg);
      break;
    }

    case commands.queryut99server.includes(action): {
      const Servers = createSortedArrayFromObject(serversObj, 'timestamp');
      const result = await queryUT99Server(args[1], Servers);
      message.channel
        .send(result.status ? printServerStatus(result) : result.msg)
        .catch(console.error + ':query:');
      break;
    }

    case commands.addgametype.includes(action): {
      const result = await addGameType(args, Pugs);
      result.status ? updateCache('Pugs', result.cache) : '';
      message.channel.send(result.msg);
      break;
    }

    case commands.delgametype.includes(action): {
      const result = await delGameType(args, Pugs);
      result.status ? updateCache('Pugs', result.cache) : '';
      message.channel.send(result.msg);
      break;
    }

    case commands.joingametype.includes(action): {
      if (hasAdminCmd && !isValidAdminCmd) break;

      const { status, result, msg } = joinGameType(
        isValidAdminCmd ? args.slice(1) : args,
        isValidAdminCmd ? userMentioned : user,
        Pugs,
        PugList
      );
      const filledPugs = result.reduce((acc, { pug, discriminator }) => {
        if (pug) {
          revisePugList(discriminator, pug, 'update');
          pug.list.length === parseInt(pug.noPlayers) ? acc.push(pug) : null;
        }
        return acc;
      }, []);
      message.channel
        .send(status ? printPugJoinStatus(result) : msg)
        .catch(console.error + ':join:');

      const forBroadcast = filledPugs.map(pug => {
        if (PugList[pug.discriminator].picking) {
          const allLeaveMsgs = Object.values(PugList).reduce((acc, op) => {
            if (pug.discriminator !== op.discriminator) {
              const allPugLeaveMsgs = pug.list.reduce((prev, user) => {
                const { result } = leaveGameType(
                  ['l', op.discriminator],
                  user,
                  Pugs,
                  PugList
                );
                if (result[0].pug) {
                  revisePugList(
                    op.discriminator,
                    result[0].pug,
                    result[0].pug.list.length === 0 ? 'remove' : 'update'
                  );
                  const msg = printPugLeaveStatus(result);
                  prev += `${msg} `;
                }
                return prev;
              }, ``);
              acc += `${allPugLeaveMsgs} \n`;
            }
            return acc;
          }, ``);
          allLeaveMsgs && message.channel.send(allLeaveMsgs);
          return pug;
        }
      });
      forBroadcast.length > 0
        ? message.channel.send(
            broadCastFilledPugs(forBroadcast.filter(Boolean))
          )
        : null;
      break;
    }

    case commands.leavegametype.includes(action): {
      const { status, result, msg } = leaveGameType(args, user, Pugs, PugList);
      const deadPugs = result.reduce((acc, { pug, discriminator }) => {
        if (pug) {
          revisePugList(
            discriminator,
            pug,
            pug.list.length === 0 ? 'remove' : 'update'
          );
          pug.list.length === parseInt(pug.noPlayers) - 1
            ? acc.push({ ...pug, user })
            : null;
        }
        return acc;
      }, []);
      message.channel
        .send(status ? printPugLeaveStatus(result, args[1] === offline) : msg)
        .catch(console.error + ':leave:');
      deadPugs.length > 0
        ? message.channel.send(broadCastDeadPugs(deadPugs))
        : null;
      break;
    }

    case commands.listgametype.includes(action): {
      const { status, result, msg } = listAvailablePugs(args, PugList);
      message.channel
        .send(status ? printPugStatuses(result) : msg)
        .catch(console.error + ':list:');
      break;
    }

    case commands.pickplayer.includes(action): {
      if (hasAdminCmd && !isValidAdminCmd) break;

      const { status, result, msg } = pickPugPlayer(
        isValidAdminCmd ? args.slice(1) : args,
        isValidAdminCmd ? userMentioned : user,
        PugList
      );

      status
        ? revisePugList(
            result.pug.discriminator,
            result.pug,
            !result.picking ? 'remove' : 'update'
          )
        : null;
      message.channel
        .send(
          status
            ? printPickStatus(result)
            : msg || `**${result.pickedPlayers.username}** is already picked`
        )
        .catch(console.error + ':pick:');
      break;
    }

    case commands.captain.includes(action): {
      const { status, result, msg } = addCaptain(user, PugList);
      status
        ? revisePugList(result.pug.discriminator, result.pug, 'update')
        : null;
      await message.channel
        .send(status ? printAddCaptainStatus(user, result) : msg)
        .catch(console.error + ':pick:');

      status && result.captainsReady
        ? pugEventEmitter.emit(
            pugEvents.captainsReady,
            result.pug.discriminator
          )
        : null;
      break;
    }

    default:
      console.log('no match');
  }
}

/**
 * C A C H E
 *    S E T U P
 *       A N D
 *         M A N I P U L A T I O N
 */

(async () => {
  cachedDB = await API.getCopyOfDB(`/`);
  bot.login(process.env.DISCORD_BOT_TOKEN);
})();

const updateCache = (toUpdate, newCache) => (cachedDB[toUpdate] = newCache);
const revisePugList = (discriminator, pug, action) => {
  if (action === 'update') PugList[discriminator] = pug;
  else if (action === 'remove' && PugList[discriminator])
    delete PugList[discriminator];
};

/**
 * P U G
 *    E V E N T S
 */
pugEventEmitter.on(pugEvents.captainsReady, discriminator => {
  const { Channel = {} } = cachedDB;
  const pug = PugList[discriminator];
  bot.channels
    .get(Channel.preferredChannel)
    .send(broadCastCaptainsReady(pug))
    .catch(console.error + ':broadCastCaptains:');
});
