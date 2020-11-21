import * as firebase from 'firebase-admin';
import Medusa from 'medusajs';

import { PathIn } from '../utils/types';
import { CACHE_LENGTH } from './constants';

import { ServerData } from './interfaces';

export class Database {
  private db: firebase.database.Reference;

  constructor() {
    const firebaseConfig = [
      'type',
      'project_id',
      'private_key_id',
      'private_key',
      'client_email',
      'client_id',
      'auth_uri',
      'token_uri',
      'auth_provider_x509_cert_url',
      'client_x509_cert_url',
    ].reduce(
      (config, key) => ({
        ...config,
        [key]: process.env[`FIREBASE_${key.toUpperCase()}`],
      }),
      {}
    );

    firebase.initializeApp({
      credential: firebase.credential.cert(firebaseConfig),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
    this.db = firebase.database().ref('/');
  }

  public get = async <T = any>(
    serverId: string,
    path?: PathIn<ServerData>
  ): Promise<T | undefined> => {
    let ref = this.resolvePath(serverId, path);

    const value = await Medusa.get<T>(
      ref.toString(),
      async (resolve) => {
        const dbSnapshot = await ref.once('value');
        resolve(dbSnapshot.val());
      },
      CACHE_LENGTH
    );

    return value;
  };

  public getArray = async <T = any>(
    serverId: string,
    path: PathIn<ServerData>
  ): Promise<T[] | undefined> => {
    const pathData = await this.get<any>(serverId, path);
    if (!pathData) {
      return undefined;
    }

    // If the array was cached, it will be returned as an array, otherwise
    // it'll be an object with ordered keys and the array values.
    if (Array.isArray(pathData)) {
      return pathData;
    } else {
      return Object.values(pathData);
    }
  };

  public set = async (
    value: any,
    serverId: string,
    path?: PathIn<ServerData>
  ) => {
    let ref = this.resolvePath(serverId, path);

    Medusa.put(ref.toString(), value, CACHE_LENGTH);
    await ref.set(value);
  };

  public push = async (
    value: any,
    serverId: string,
    path: PathIn<ServerData>
  ) => {
    let ref = this.resolvePath(serverId, path);

    const existingArray = await this.getArray(serverId, path);
    const newArray = existingArray ? [...existingArray, value] : [value];
    Medusa.put(ref.toString(), newArray, CACHE_LENGTH);

    ref.push(value);
  };

  public delete = async (serverId: string, path?: PathIn<ServerData>) => {
    let ref = this.resolvePath(serverId, path);

    Medusa.clear(ref.toString());
    await ref.remove();
  };

  private resolvePath = (serverId: string, path?: PathIn<ServerData>) => {
    let ref = this.db.child(serverId);
    if (path) {
      ref = ref.child(path.join('/'));
    }
    return ref;
  };
}
