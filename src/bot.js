import { Client } from 'discord.js';
import dotenv from 'dotenv';
import { prefix, commands } from './constants';
import { addQueryServer, queryUT99Server, delQueryServer } from './ut99query';
import {
  addGameType,
  delGameType,
  joinGameType,
  leaveGameType,
  listAvailablePugs,
  removePeopleFromOtherPugs,
} from './pug';
import {
  printServerStatus,
  printServerList,
  printPugJoinStatus,
  printPugLeaveStatus,
  printPugStatuses,
  broadCastFilledPugs,
  broadCastDeadPugs,
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

bot.on('message', async message => {
  if (message.author.equals(bot.user)) return;
  if (!message.content.startsWith(prefix)) return;

  const { Servers: serversObj = {}, Pugs = {} } = cachedDB;
  const user = {
    id: message.author.id,
    username: fixSpecialCharactersInName(message.author.username),
  };

  const args = message.content.substring(prefix.length).split(' ');
  const action = args[0].toLowerCase();
  const roles = message.member.roles;

  switch (true) {
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
      const { status, result, msg } = joinGameType(args, user, Pugs, PugList);
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
        if (pug.list.length === pug.noPlayers) {
          Object.values(PugList).forEach(ap => {
            if (pug.discriminator !== ap.discriminator)
              pug.list.forEach(async user => {
                const { result } = leaveGameType(
                  ['l', ap.discriminator],
                  user,
                  Pugs,
                  PugList
                );
                if (result[0].pug) {
                  revisePugList(
                    ap.discriminator,
                    result[0].pug,
                    result[0].pug.list.length === 0 ? 'remove' : 'update'
                  );
                  await message.channel.send(printPugLeaveStatus(result));
                }
              });
          });
          return pug;
        }
      });
      forBroadcast.length > 0
        ? message.channel.send(broadCastFilledPugs(forBroadcast))
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
        .send(status ? printPugLeaveStatus(result) : msg)
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
    default:
      console.log('no match');
  }
});

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
