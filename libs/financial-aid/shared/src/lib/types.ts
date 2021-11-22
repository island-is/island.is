export type UploadFileType =
  | 'otherFiles'
  | 'incomeFiles'
  | 'taxReturnFiles'
  | 'spouseFiles'

export type KeyMapping<TKey extends string, TValue> = { [K in TKey]: TValue }
