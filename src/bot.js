import { Client } from 'discord.js';
import dotenv from 'dotenv';
import { prefix, commands } from './constants';
import { addQueryServer, queryUT99Server, delQueryServer } from './ut99query';
import { addGameType } from './pug';
import { printServerStatus, printServerList } from './formats';
import { checkIfRoleIsPrivileged } from './helpers';
import { createSortedArrayFromObject } from './util';
import API from './api';

dotenv.config();
let cachedDB = {};
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

    default:
      console.log('no match');
  }
});

(async () => {
  cachedDB = await API.getCopyOfDB(`/`);
  bot.login(process.env.DISCORD_BOT_TOKEN);
})();

const updateCache = (toUpdate, newCache) => (cachedDB[toUpdate] = newCache);
