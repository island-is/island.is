export type KeyMapping<TKey extends string, TValue> = { [K in TKey]: TValue }

export type PdfFile = {
  content: Buffer
  name: string
}
