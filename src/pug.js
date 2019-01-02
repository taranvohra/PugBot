import API from './api';
import { getPickingOrder } from './helpers';
import cloneDeep from 'lodash/cloneDeep';
import { getRandomInt } from './util';
import { pugEvents } from './constants';
import pugEventEmitter from './pugEvent';

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
      pickingOrder,
      discriminator,
      noPlayers: parseInt(noPlayers),
      noTeams: parseInt(noTeams),
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

    if (!user.id)
      return { status: false, result: [], msg: 'No user was mentioned' };

    const isPartOfFilledPug = Object.values(PugList).some(
      p => p.picking && p.list.some(u => u.id === user.id)
    );

    if (isPartOfFilledPug)
      return {
        status: false,
        result: [],
        msg: 'Cannot join another pug when you are a part of a filled pug',
      };

    const result = args.map(g => {
      const game = g.toLowerCase(); // game is basically the discriminator

      if (!Pugs[game]) return { user, discriminator: game, joinStatus: -1 };

      const pugProps = Pugs[game];
      const pug = !PugList[game] ? new Pug(pugProps) : cloneDeep(PugList[game]);
      const joinStatus = pug.addPlayer(user);

      PugList[game] && PugList[game].cleanup(); // because we have cloned p and will no longer be using it
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

          p.cleanup(); // because we have cloned p and will no longer be using it
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

          PugList[game].cleanup(); // because we have cloned p and will no longer be using it
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

export const pickPugPlayer = ([_, playerIndex], user, PugList) => {
  try {
    if (!playerIndex) return;
    const { activePug, team } = Object.values(PugList).reduce(
      (acc, p) => {
        if (p.picking) {
          const presentUser = p.list.filter(
            u => u.id === user.id && u.captain !== null
          );
          if (presentUser[0]) {
            acc.activePug = p;
            acc.team = presentUser[0].team;
          }
        }
        return acc;
      },
      { activePug: null, team: null }
    );

    if (!activePug) return { status: false, msg: `Invalid` };
    if (activePug.captains.length !== activePug.noTeams)
      return {
        status: false,
        msg: `Please wait for all captains to be picked`,
      };

    if (team !== activePug.pickingOrder[activePug.turn])
      return { status: false, msg: `Please wait for your turn` };

    if (playerIndex < 1 || playerIndex > activePug.list.length)
      return { status: false, msg: `Invalid pick` };

    const pug = cloneDeep(activePug);
    PugList[pug.discriminator].cleanup();
    const res = pug.pickPlayer(
      parseInt(playerIndex) - 1,
      pug.pickingOrder[pug.turn]
    );
    const result = { pug, ...res };
    return { status: result.picked, result };
  } catch (error) {
    console.log(error);
    return { status: false, msg: 'Something went wrong' };
  }
};

export const addCaptain = (user, PugList) => {
  try {
    const [activePug] = Object.values(PugList).filter(
      p =>
        p.picking &&
        p.captains.length !== p.noTeams &&
        p.list.some(u => u.id === user.id && u.captain === null)
    );
    if (!activePug) return { status: false, msg: `Invalid` };
    const pug = activePug;
    // Not cloning here because of timeout
    const res = pug.addCaptain(user);
    const result = { pug, ...res };
    return { status: result.captained, result };
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
    this.turn = 0;
    this.picking = false;
    this.list = [];
    this.captains = [];
    this.captainTimer = null;
  }

  fillPug() {
    this.picking = true;
    this.captainTimer = setTimeout(() => {
      const present = this.captains.reduce((acc, _, i) => {
        this.captains[i] ? (acc[i] = true) : null;
        return acc;
      }, {});

      for (let i = 0; i < this.noTeams; i++) {
        if (present[i]) continue;
        while (1) {
          const pIndex = getRandomInt(0, this.noPlayers - 1);
          if (this.list[pIndex]['captain'] === null) {
            this.list[pIndex]['captain'] = this.list[pIndex]['team'] = i;
            this.list[pIndex]['pick'] = 0;
            this.captains.push(this.list[pIndex]);
            break;
          }
        }
      }
      pugEventEmitter.emit(pugEvents.captainsReady, this.discriminator);
    }, 15000);
  }

  stopPug() {
    this.picking = false;
    this.turn = 0;
    this.list.forEach(user => (user.captain = user.team = user.pick = null));
    this.cleanup();
  }

  addPlayer(user) {
    if (!this.picking) {
      if (this.list.findIndex(u => u.id === user.id) > -1) return 2;
      this.list.push({ team: null, captain: null, pick: null, ...user });
      this.list.length === this.noPlayers ? this.fillPug() : null;
      return 1;
    }
    return 0;
  }

  removePlayer(index) {
    this.list.splice(index, 1);
    if (this.picking) this.stopPug();
  }

  addCaptain(user) {
    const pIndex = this.list.findIndex(u => u.id === user.id);
    if (pIndex > -1) {
      const length = this.captains.push(this.list[pIndex]);
      this.list[pIndex]['captain'] = this.list[pIndex]['team'] = length - 1;
      this.list[pIndex]['pick'] = 0;

      if (this.captains.length === this.noTeams)
        clearTimeout(this.captainTimer);

      return {
        captained: true,
        team: length - 1,
        captainsReady: this.captains.length === this.noTeams,
      };
    }
    return { captained: false };
  }

  pickPlayer(pIndex, team) {
    if (this.list[pIndex]['team'] === null) {
      this.list[pIndex]['team'] = team;
      this.turn += 1;
      this.list[pIndex]['pick'] = this.turn;

      const pickedPlayers = [{ player: this.list[pIndex], team }];
      // last pick automatically goes
      if (this.turn === this.pickingOrder.length - 1) {
        const lastPlayerIndex = this.list.findIndex(u => u.team === null);
        const lastPlayerTeam = this.pickingOrder[this.turn];

        this.list[lastPlayerIndex]['team'] = lastPlayerTeam;
        this.turn += 1;
        this.list[lastPlayerIndex]['pick'] = this.turn;
        // pug ended
        this.picking = false;
        pickedPlayers.push({
          player: this.list[lastPlayerIndex],
          team: lastPlayerTeam,
        });
      }
      return { picked: true, pickedPlayers, picking: this.picking };
    }
    return {
      picked: false,
      pickedPlayers: this.list[pIndex],
      finished: this.picking,
    };
  }

  findPlayer(user) {
    return this.list.findIndex(u => u.id === user.id);
  }

  cleanup() {
    this.picking = false;
    clearTimeout(this.captainTimer);
  }
}
