export const DEFAULT_LOCALE = 'is-IS'
export const ENGLISH_LOCALE = 'en'

export interface NamespaceEntryFields {
  namespace?: Record<string, string>
  strings?: Record<string, Record<string, string>>
  defaults?: Record<
    string,
    Record<string, { defaultMessage: string; description?: string }>
  >
}

export interface ContentfulTranslationRow {
  id: string
  namespace: string
  messageKey: string
  valueIs: string
  valueEn?: string
  defaultMessage?: string
  isReviewed: boolean
  translatedBy?: string
  reviewedBy?: string
  draftValueIs?: string | null
  draftValueEn?: string | null
  created: Date
  modified: Date
}
