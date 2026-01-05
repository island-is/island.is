import { Entry, EntryProps } from 'contentful-management'
import { EN_LOCALE, LOCALE } from '../../constants'

export type EntryInput = Array<{
  cmsEntry: Entry
  inputFields: EntryInputFields
  referenceId?: string
}>

export interface Localized<T> {
  [EN_LOCALE]?: T
  [LOCALE]: T
}

export interface CmsRichTextDocument {
  data: object
  nodeType: 'document'
  content: Array<{
    data: object
    nodeType: 'paragraph'
    content: Array<{
      marks: Array<{
        type: string
      }>
      value: string
      nodeType: 'text'
    }>
  }>
}

export interface RichTextParagraph {
  values: Array<RichTextValue>
}

export interface RichTextValue {
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
      ok: 'noop'
      error?: string
    }
  | {
      ok: 'unknown'
      error?: string
    }
