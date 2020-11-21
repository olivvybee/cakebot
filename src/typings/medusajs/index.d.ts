declare module 'medusajs' {
  declare function get<T = any>(
    key: string,
    resolver: (
      resolve: (value: T) => void,
      reject: (value: any) => void
    ) => void,
    policy: number | Date
  ): Promise<T>;

  declare function put<T = any>(
    key: string,
    value: T,
    policy: number | Date
  ): void;

  declare function clear(key: string): void;

  declare function settings(newSettings: any): void;
}
