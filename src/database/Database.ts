import * as firebase from 'firebase-admin';

import { CACHE_LENGTH } from './constants';

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
    path?: string
  ): Promise<T | undefined> => {
    const ref = this.resolvePath(serverId, path);
    const dbSnapshot = await ref.once('value');
    return dbSnapshot.val();
  };

  public getArray = async <T = any>(
    serverId: string,
    path: string
  ): Promise<T[] | undefined> => {
    const pathData = await this.get<any>(serverId, path);
    if (!pathData) {
      return undefined;
    }
    return Object.values(pathData);
  };

  public set = async (value: any, serverId: string, path?: string) => {
    const ref = this.resolvePath(serverId, path);
    await ref.set(value);
  };

  public push = async (value: any, serverId: string, path: string) => {
    const ref = this.resolvePath(serverId, path);
    ref.push(value);
  };

  public delete = async (serverId: string, path?: string) => {
    const ref = this.resolvePath(serverId, path);
    await ref.remove();
  };

  private resolvePath = (serverId: string, path?: string) => {
    let ref = this.db.child(serverId);
    if (path) {
      ref = ref.child(path);
    }
    return ref;
  };
}
