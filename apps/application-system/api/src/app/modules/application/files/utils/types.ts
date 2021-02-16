export type KeyMapping<TKey extends string, TValue> = { [K in TKey]: TValue }

export enum Signature {
  'unsigned',
  'partiallySigned',
  'signed',
}
