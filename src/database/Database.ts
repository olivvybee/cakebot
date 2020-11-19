import * as firebase from 'firebase-admin';

import { PathIn } from '../utils/types';

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

  public get = async <T extends any>(
    serverId: string,
    path?: PathIn<ServerData>
  ): Promise<T | undefined> => {
    let ref = this.resolvePath(serverId, path);
    const snapshot = await ref.once('value');
    return snapshot.val() as T;
  };

  public getArray = async <T extends any>(
    serverId: string,
    path: PathIn<ServerData>
  ): Promise<T[] | undefined> => {
    const pathData = await this.get<any>(serverId, path);
    if (!pathData) {
      return undefined;
    }
    return Object.values(pathData);
  };

  public set = async (
    value: any,
    serverId: string,
    path?: PathIn<ServerData>
  ) => {
    let ref = this.resolvePath(serverId, path);
    await ref.set(value);
  };

  public push = async (
    value: any,
    serverId: string,
    path: PathIn<ServerData>
  ) => {
    let ref = this.resolvePath(serverId, path);
    ref.push(value);
  };

  public delete = async (serverId: string, path?: PathIn<ServerData>) => {
    let ref = this.resolvePath(serverId, path);
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
