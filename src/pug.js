import API from './api';
import { getPickingOrder } from './helpers';
import cloneDeep from 'lodash/cloneDeep';

export const addGameType = async (
  [_, gameName, noPlayers, noTeams, uid],
  Pugs
) => {
  try {
    if (isNaN(noPlayers) || isNaN(noTeams) || !gameName || !uid)
      return { status: false, msg: 'Invalid command' };

    const discriminator = uid.toLowerCase();
    if (Pugs[discriminator])
      return { status: false, msg: 'Gametype already exists' };

    const pickingOrder = getPickingOrder(
      parseInt(noPlayers),
      parseInt(noTeams)
    );

    if (!pickingOrder)
      return { status: false, msg: 'Invalid No. of players/teams' };

    const newGameType = {
      gameName,
      noPlayers,
      noTeams,
      pickingOrder,
      discriminator,
    };

    const result = await API.pushToDB('/Pugs', discriminator, newGameType);
    return { ...result, msg: 'Gametype added' };
  } catch (error) {
    console.log(error);
    return { status: false, msg: 'Something went wrong' };
  }
};

export const delGameType = async ([_, discriminator, ...args], Pugs) => {
  //TODO: To remove existing references of this game type(?)
  try {
    if (!Pugs[discriminator])
      return { status: false, msg: "Gametype doesn't exist" };

    const result = await API.deleteFromDB('/Pugs', discriminator);
    return { ...result, msg: 'Gametype removed' };
  } catch (error) {
    console.log(error);
    return { status: false, msg: 'Something went wrong' };
  }
};

export const joinGameType = ([_, ...args], user, Pugs, PugList) => {
  try {
    if (args.length === 0)
      return { status: false, result: [], msg: 'Invalid command' };

    const result = args.map(g => {
      const game = g.toLowerCase(); // game is basically the discriminator

      if (!Pugs[game]) return { user, discriminator: game, joinStatus: -1 };

      const pugProps = Pugs[game];
      const pug = !PugList[game] ? new Pug(pugProps) : cloneDeep(PugList[game]);
      const joinStatus = pug.addPlayer(user);
      return {
        pug,
        user,
        discriminator: pug.discriminator,
        noPlayers: pug.noPlayers,
        activeCount: pug.list.length,
        joinStatus,
      };
    });
    return { status: true, result };
  } catch (error) {
    console.log(error);
    return { status: false, msg: 'Something went wrong' };
  }
};

export const leaveGameType = ([action, ...args], user, Pugs, PugList) => {
  try {
    if (action === 'lva') {
      const result = Object.values(PugList).map(p => {
        const pug = cloneDeep(p);
        const playerIndex = pug.findPlayer(user);
        if (playerIndex > -1) {
          pug.removePlayer(playerIndex);
          return { pug, user, discriminator: pug.discriminator };
        }
        return {};
      });
      return { status: true, result };
    } else {
      if (args.length === 0)
        return { status: false, result: [], msg: 'Invalid command' };

      const result = args.map(g => {
        const game = g.toLowerCase(); // game is basically the discriminator

        if (!Pugs[game]) return {};
        const pug = PugList[game] ? cloneDeep(PugList[game]) : null;
        if (!pug) return {};

        const playerIndex = pug.findPlayer(user);
        if (playerIndex > -1) {
          pug.removePlayer(playerIndex);
          return { pug, user, discriminator: pug.discriminator };
        }
        return {};
      });
      return { status: true, result };
    }
  } catch (error) {
    console.log(error);
    return { status: false, msg: 'Something went wrong' };
  }
};

// TODO: Use constants for commands for better DX and maybe separate them in methods
export const listAvailablePugs = ([action, forGame, ...args], PugList) => {
  try {
    if (action === 'lsa') {
      const result = Object.values(PugList).map(p => ({
        discriminator: p.discriminator,
        noPlayers: p.noPlayers,
        list: [...p.list],
        picking: p.picking,
        withList: true,
      }));
      return { status: true, result };
    } else {
      if (!forGame) {
        const result = Object.values(PugList).map(p => ({
          discriminator: p.discriminator,
          noPlayers: p.noPlayers,
          list: [...p.list],
          picking: p.picking,
          withList: false,
        }));
        return { status: true, result };
      }

      const game = forGame.toLowerCase(); // game is basically the discriminator
      if (!PugList[game]) return null;
      const pug = PugList[game];
      const result = [
        {
          discriminator: pug.discriminator,
          noPlayers: pug.noPlayers,
          list: [...pug.list],
          picking: pug.picking,
          withList: true,
        },
      ];
      return { status: true, result };
    }
  } catch (error) {
    console.log(error);
    return { status: false, msg: 'Something went wrong' };
  }
};

export class Pug {
  constructor({ discriminator, gameName, noPlayers, noTeams, pickingOrder }) {
    this.discriminator = discriminator;
    this.gameName = gameName;
    this.noPlayers = noPlayers;
    this.noTeams = noTeams;
    this.pickingOrder = pickingOrder;
    this.picking = false;
    this.list = [];
    this.captains = [];
    this.team = {};
  }

  fillPug() {
    this.picking = true;
  }

  addPlayer(user) {
    if (!this.picking) {
      if (this.list.findIndex(u => u.id === user.id) > -1) return 2;
      this.list.push({ team: null, ...user });
      this.list.length === this.noPlayers ? this.fillPug() : null;
      return 1;
    }
    return 0;
  }

  removePlayer(index) {
    this.list.splice(index, 1);
  }

  findPlayer(user) {
    return this.list.findIndex(u => u.id === user.id);
  }

  destroy() {}
}
