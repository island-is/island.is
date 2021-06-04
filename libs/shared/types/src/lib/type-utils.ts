/* eslint-disable @typescript-eslint/no-explicit-any */
export type Unwrap<T> = T extends Promise<infer U>
  ? U
  : T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : T

// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types
export type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never
