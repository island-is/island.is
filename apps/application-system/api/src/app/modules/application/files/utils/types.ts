export type KeyMapping<TKey extends string, TValue> = { [K in TKey]: TValue }

export type SigningOptions = {
  phoneNumber: string
  title: string
  name: string
  fileContent: string
}
