export type UploadFileType = 'otherFiles' | 'incomeFiles' | 'taxReturnFiles'

export type StaffRole = 'admin' | 'employee'

export type KeyMapping<TKey extends string, TValue> = { [K in TKey]: TValue }
