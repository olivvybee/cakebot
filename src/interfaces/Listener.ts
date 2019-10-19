import { Client } from '../Client';

export type ListenerCallback<Params extends any[]> = (
  client: Client,
  ...params: Params
) => Promise<void>;

export interface Listener<Params extends any[]> {
  callback: ListenerCallback<Params>;
  event: string;
  displayName: string;
}
