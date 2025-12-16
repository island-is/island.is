import { Entry, EntryProps } from 'contentful-management'
import { EN_LOCALE, LOCALE } from '../../constants'

export type EntryInput = Array<{
  cmsEntry: Entry
  inputFields: EntryInputFields
  referenceId?: string
}>

export interface LocalizedValue {
  [EN_LOCALE]: string
  [LOCALE]: string
}

export interface LocalizedContent {
  [EN_LOCALE]: Array<Paragraph>
  [LOCALE]: Array<Paragraph>
}

export interface Paragraph {
  items: Array<ContentItem>
}

export interface ContentItem {
  value: string
  isBold?: boolean
}

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
