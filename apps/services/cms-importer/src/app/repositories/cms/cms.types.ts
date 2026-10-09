import { Entry, EntryProps } from 'contentful-management'
import { Document } from '@contentful/rich-text-types'
import { EN_LOCALE, LOCALE } from '../../constants'

export type ContentTypeOptions = 'grant' | 'genericListItem' | 'linkUrl'

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

export type CmsRichTextDocument = Document

export interface RichTextParagraph {
  values: Array<RichTextValue>
}

export interface RichTextValue {
  value: string
  isBold?: boolean
  link?:
    | { type: 'hyperlink'; uri: string }
    | { type: 'asset-hyperlink'; assetId: string }
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
