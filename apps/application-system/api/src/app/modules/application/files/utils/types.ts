export type KeyMapping<TKey extends string, TValue> = { [K in TKey]: TValue }

export enum Signature {
  Unsigned = 'unsigned',
  PartiallySigned = 'partiallySigned',
  Signed = 'signed',
}
