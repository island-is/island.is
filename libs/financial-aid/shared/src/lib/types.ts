export type UploadFileType = 'otherFiles' | 'incomeFiles' | 'taxReturnFiles'

export type KeyMapping<TKey extends string, TValue> = { [K in TKey]: TValue }

export type InputType = 'text' | 'number' | 'email' | 'tel'
