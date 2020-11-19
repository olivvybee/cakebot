// Creates [A, ...B] if B is an array, otherwise never
export type Join<A, B> = B extends any[]
  ? ((a: A, ...b: B) => any) extends (...args: infer U) => any
    ? U
    : never
  : never;

// Creates a union of tuples descending into an object.
export type PathIn<T> = {
  [K in keyof T]: [K] | Join<K, PathIn<NonNullable<T[K]>>>;
}[keyof T];
