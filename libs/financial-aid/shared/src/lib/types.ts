export type UploadFileType = 'otherFiles' | 'incomeFiles' | 'taxReturnFiles'

export type StaffRole = 'admin' | 'worker'

export type KeyMapping<TKey extends string, TValue> = { [K in TKey]: TValue }
