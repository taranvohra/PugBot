import { Client } from 'discord.js';
import dotenv from 'dotenv';
import { prefix, commands } from './constants';
import { addQueryServer, queryUT99Server, delQueryServer } from './ut99query';
import { addGameType, delGameType, joinGameType, leaveGameType } from './pug';
import {
  printServerStatus,
  printServerList,
  printPugJoinStatus,
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

  const args = message.content.substring(prefix.length).split(' ');
  const action = args[0].toLowerCase();
  const roles = message.member.roles;

  switch (true) {
    case commands.servers.includes(action): {
      const { Servers: serversObj = {} } = cachedDB;
      const Servers = createSortedArrayFromObject(serversObj, 'timestamp');

      message.channel
        .send(printServerList(Servers))
        .catch(console.error + ':list:');
      break;
    }

    case checkIfRoleIsPrivileged(roles) &&
      commands.addqueryserver.includes(action): {
      const { Servers: serversObj = {} } = cachedDB;
      const Servers = createSortedArrayFromObject(serversObj);

      const result = await addQueryServer(args, Servers);
      result.status ? updateCache('Servers', result.cache) : '';
      message.channel.send(result.msg);
      break;
    }

    case checkIfRoleIsPrivileged(roles) &&
      commands.delqueryserver.includes(action): {
      const { Servers: serversObj = {} } = cachedDB;
      const Servers = createSortedArrayFromObject(serversObj);

      const result = await delQueryServer(args, Servers);
      result.status ? updateCache('Servers', result.cache) : '';
      message.channel.send(result.msg);
      break;
    }

    case checkIfRoleIsPrivileged(roles) && commands.updatequeryserver:
      console.log(args[0]);
      break;

    case commands.queryut99server.includes(action): {
      const { Servers: serversObj = {} } = cachedDB;
      const Servers = createSortedArrayFromObject(serversObj, 'timestamp');

      const result = await queryUT99Server(args[1], Servers);
      message.channel
        .send(result.status ? printServerStatus(result) : result.msg)
        .catch(console.error + ':query:');
      break;
    }

    case commands.addgametype.includes(action): {
      const { Pugs = {} } = cachedDB;

      const result = await addGameType(args, Pugs);
      result.status ? updateCache('Pugs', result.cache) : '';
      message.channel.send(result.msg);
      break;
    }

    case commands.delgametype.includes(action): {
      const { Pugs = {} } = cachedDB;

      const result = await delGameType(args, Pugs);
      result.status ? updateCache('Pugs', result.cache) : '';
      message.channel.send(result.msg);
      break;
    }

    case commands.joingametype.includes(action): {
      const { Pugs = {} } = cachedDB;
      const user = {
        id: message.author.id,
        username: fixSpecialCharactersInName(message.author.username),
      };
      const result = joinGameType(args, user, Pugs, PugList);
      result.forEach(({ pug, discriminator }) =>
        pug ? updatePugList(discriminator, pug) : null
      );
      message.channel
        .send(result.status ? printPugJoinStatus(result) : result.msg)
        .catch(console.error + ':join:');
      break;
    }

    case commands.leavegametype.includes(action): {
      const { Pugs = {} } = cachedDB;
      const user = {
        id: message.author.id,
        username: fixSpecialCharactersInName(message.author.username),
      };
      const result = leaveGameType(args, user, Pugs, PugList);
      result.forEach(({ pug, discriminator }) =>
        pug ? updatePugList(discriminator, pug) : null
      );
      message.channel
        .send(result.status ? printPugLeaveStatus(result) : result.msg)
        .catch(console.error + ':leave:');
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
const updatePugList = (toUpdate, pug) => (PugList[toUpdate] = pug);
