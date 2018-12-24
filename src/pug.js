import API from './api';
import { getPickingOrder } from './helpers';
import stringHash from 'string-hash';

export const addGameType = async ([_, noPlayers, gameName, noTeams], Pugs) => {
  try {
    if (isNaN(noPlayers) || isNaN(noTeams) || !gameName)
      return { status: false, msg: 'Invalid command' };

    if (Pugs[gameName])
      return { status: false, msg: 'Gametype already exists' };

    const pickingOrder = getPickingOrder(
      parseInt(noPlayers),
      parseInt(noTeams)
    );

    if (!pickingOrder)
      return { status: false, msg: 'Invalid No. of players/teams' };

    const uid = stringHash(gameName);
    const newGameType = { gameName, noPlayers, noTeams, pickingOrder };

    const result = await API.pushToDB('/Pugs', uid, newGameType);
    return { ...result, msg: 'Gametype added' };
  } catch (error) {
    console.log(error);
    return { status: false, msg: 'Something went wrong' };
  }
};
