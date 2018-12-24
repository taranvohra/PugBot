import dgram from 'dgram';
import db from './db';
import util from 'util';
import {
  checkIfFinalPacket,
  createSortedDBSnapshot,
  createCacheFromSnapshot,
} from './helpers';

export default class API {
  static getUT99ServerStatus(host, port) {
    return new Promise((resolve, reject) => {
      try {
        let status = '';
        const socket = dgram.createSocket('udp4');
        const datagram = '\\status\\XServerQuery';

        socket.send(datagram, port, host, err => {
          if (err) reject(err);
        });

        socket.on('message', (message, remote) => {
          const unicodeValues = message.toJSON().data;
          const unicodeString = String.fromCharCode(...unicodeValues);
          status += unicodeString;
          if (checkIfFinalPacket(unicodeString)) {
            resolve(status);
            return socket.close();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static async getCopyOfDB(collection) {
    const snapshot = await db.ref(`${collection}`).once('value');
    return createCacheFromSnapshot(snapshot);
  }

  static async pushToDB(collection, id, payload) {
    try {
      await db.ref(`${collection}/${id}`).set(payload);
      const cache = await API.getCopyOfDB(collection);
      return { status: true, cache, msg: 'Query server added' };
    } catch (error) {
      console.log('pushToDB Error ', e);
      return { status: false, msg: 'Something went wrong' };
    }
  }

  static async deleteFromDB(collection, id) {
    try {
      await db.ref(`${collection}/${id}`).remove();
      const cache = await API.getCopyOfDB(collection);
      return { status: true, cache, msg: 'Query server removed' };
    } catch (error) {
      console.log('deleteFromDB Error ', e);
      return { status: false, msg: 'Something went wrong' };
    }
  }
}
