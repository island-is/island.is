import { Entry, EntryProps } from 'contentful-management'

export type EntryInput = Array<{
  cmsEntry: Entry
  inputFields: EntryInputFields
  referenceId?: string
}>

export type CreationType = Omit<EntryProps, 'sys'>

export type EntryInputFields = Array<{ key: string; value: unknown }>

export type EntryUpdateResult =
  | {
      ok: 'success'
      entry: Entry
    }
  | {
      ok: 'error'
      error?: string
    }
  | {
      ok: 'somewhat'
      error?: string
    }
