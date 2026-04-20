import { Entry, EntryProps } from 'contentful-management'
import { EN_LOCALE, LOCALE } from '../../constants'

export type ContentTypeOptions = 'grant' | 'genericListItem'

export interface EntryUpdateDto {
  cmsEntry: Entry
  inputFields: Localized<EntryInputFields>
  referenceId?: string
}

export type EntryCreationDto = Omit<EntryProps, 'sys'>

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

export type EntryInputFields = Array<{ key: string; value: unknown }>

export type CmsEntryOpResult =
  | {
      status: 'success'
      entry: Entry
    }
  | {
      status: 'error'
      error?: string
    }
  | {
      status: 'noop'
      error?: string
    }
  | {
      status: 'unknown'
      error?: string
    }
