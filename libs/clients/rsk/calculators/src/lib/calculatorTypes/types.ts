// `keyof` over a union yields only shared keys; this distributes to get all.
export type AllKeys<T> = T extends unknown ? keyof T : never
