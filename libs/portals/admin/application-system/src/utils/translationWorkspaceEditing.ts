import { isOwnedTranslationMessageId } from '@island.is/application/utils'
import type {
  EditedTranslations,
  MessageDescriptor,
} from '../types/translationWorkspace'

export const AUTOSAVE_INTERVAL_MS = 15_000
export const GOOGLE_TRANSLATE_BATCH_SIZE = 100
/** Keep in sync with GOOGLE_TRANSLATE_MAX_CHARS_PER_REQUEST on the API. */
export const GOOGLE_TRANSLATE_MAX_CHARS_PER_REQUEST = 30_000
/** Keep in sync with GOOGLE_TRANSLATE_MAX_CHARS_PER_TEXT on the API. */
export const GOOGLE_TRANSLATE_MAX_CHARS_PER_TEXT = 5_000

export type PersistedTranslationRow = {
  valueIs: string
  valueEn?: string | null
}

export type PersistedByKey = Record<string, PersistedTranslationRow>

export type ApplicationTranslationRow = {
  messageKey: string
  valueIs: string
  valueEn?: string | null
  draftValueIs?: string | null
  draftValueEn?: string | null
}

export type TranslationLocale = 'is' | 'en'

export const buildPersistedByKey = (
  rows: ApplicationTranslationRow[] | undefined | null,
): PersistedByKey => {
  const map: PersistedByKey = {}
  for (const row of rows ?? []) {
    map[row.messageKey] = {
      valueIs: row.draftValueIs ?? row.valueIs,
      valueEn: row.draftValueEn ?? row.valueEn,
    }
  }
  return map
}

export const hasDraftChangesInRows = (
  rows: ApplicationTranslationRow[] | undefined | null,
): boolean => {
  return (rows ?? []).some(
    (row) => row.draftValueIs != null || row.draftValueEn != null,
  )
}

export const filterMessageDescriptorsBySearch = (
  descriptors: MessageDescriptor[],
  searchValue: string,
): MessageDescriptor[] => {
  const query = searchValue.trim().toLowerCase()
  if (!query) return descriptors

  return descriptors.filter(
    (descriptor) =>
      descriptor.id.toLowerCase().includes(query) ||
      (descriptor.defaultMessage ?? '').toLowerCase().includes(query),
  )
}

export const getPersistedForMessage = (
  persistedByKey: PersistedByKey,
  messageKey: string,
  locale: TranslationLocale,
): string => {
  const row = persistedByKey[messageKey]
  if (!row) return ''
  return locale === 'en' ? row.valueEn ?? '' : row.valueIs
}

export type TranslationToSave = {
  namespace: string
  messageKey: string
  valueIs?: string
  valueEn?: string
}

export const buildTranslationsToSave = (
  editedValues: EditedTranslations,
  persistedByKey: PersistedByKey,
  namespace: string,
): TranslationToSave[] => {
  const dirtyByKey = new Map<string, { valueIs?: string; valueEn?: string }>()

  for (const locale of ['is', 'en'] as const) {
    for (const [messageKey, value] of Object.entries(editedValues[locale])) {
      if (
        value === getPersistedForMessage(persistedByKey, messageKey, locale)
      ) {
        continue
      }
      const merged = dirtyByKey.get(messageKey) ?? {}
      if (locale === 'is') merged.valueIs = value
      else merged.valueEn = value
      dirtyByKey.set(messageKey, merged)
    }
  }

  return Array.from(dirtyByKey.entries())
    .filter(([messageKey]) =>
      isOwnedTranslationMessageId(messageKey, [namespace]),
    )
    .map(([messageKey, fields]) => ({
      namespace,
      messageKey,
      ...fields,
    }))
}

export const hasUnsavedTranslationChanges = (
  editedValues: EditedTranslations,
  persistedByKey: PersistedByKey,
): boolean => {
  return (['is', 'en'] as const).some((locale) =>
    Object.entries(editedValues[locale]).some(
      ([key, value]) =>
        value !== getPersistedForMessage(persistedByKey, key, locale),
    ),
  )
}

export const countUnsavedTranslationKeys = (
  editedValues: EditedTranslations,
  persistedByKey: PersistedByKey,
): number => {
  const keysWithPending = new Set<string>()
  for (const locale of ['is', 'en'] as const) {
    for (const [messageKey, value] of Object.entries(editedValues[locale])) {
      if (
        value !== getPersistedForMessage(persistedByKey, messageKey, locale)
      ) {
        keysWithPending.add(messageKey)
      }
    }
  }
  return keysWithPending.size
}

export const formatAutosaveTime = (date: Date): string => {
  return `${String(date.getHours()).padStart(2, '0')}:${String(
    date.getMinutes(),
  ).padStart(2, '0')}`
}

export type GoogleTranslateItem = { id: string; sourceText: string }

export const isTranslatingEveryId = (
  ids: readonly string[],
  translatingIds: ReadonlySet<string> | undefined,
): boolean =>
  ids.length > 0 && ids.every((id) => Boolean(translatingIds?.has(id)))

export type GoogleTranslateFn = (input: {
  texts: string[]
}) => Promise<string[] | undefined | null>

export type GoogleTranslateBatchResult = {
  completedBatches: number
  failedBatches: number
  skippedOversized: number
}

export const packGoogleTranslateBatches = (
  items: GoogleTranslateItem[],
  batchSize = GOOGLE_TRANSLATE_BATCH_SIZE,
  maxCharsPerRequest = GOOGLE_TRANSLATE_MAX_CHARS_PER_REQUEST,
  maxCharsPerText = GOOGLE_TRANSLATE_MAX_CHARS_PER_TEXT,
): { batches: GoogleTranslateItem[][]; skippedOversized: number } => {
  const batches: GoogleTranslateItem[][] = []
  let current: GoogleTranslateItem[] = []
  let currentChars = 0
  let skippedOversized = 0

  const flush = () => {
    if (current.length === 0) {
      return
    }
    batches.push(current)
    current = []
    currentChars = 0
  }

  for (const item of items) {
    const length = item.sourceText.length
    if (length > maxCharsPerText) {
      skippedOversized += 1
      continue
    }
    if (
      current.length >= batchSize ||
      (current.length > 0 && currentChars + length > maxCharsPerRequest)
    ) {
      flush()
    }
    current.push(item)
    currentChars += length
  }
  flush()

  return { batches, skippedOversized }
}

export const applyGoogleTranslateBatches = async (
  items: GoogleTranslateItem[],
  translate: GoogleTranslateFn,
  onTranslated: (id: string, text: string) => void,
  batchSize = GOOGLE_TRANSLATE_BATCH_SIZE,
): Promise<GoogleTranslateBatchResult> => {
  if (items.length === 0) {
    return { completedBatches: 0, failedBatches: 0, skippedOversized: 0 }
  }

  const { batches, skippedOversized } = packGoogleTranslateBatches(
    items,
    batchSize,
  )
  let completedBatches = 0
  let failedBatches = 0

  for (const slice of batches) {
    try {
      const translations =
        (await translate({
          texts: slice.map((item) => item.sourceText),
        })) ?? []

      for (let i = 0; i < slice.length; i++) {
        if (translations[i]) {
          onTranslated(slice[i].id, translations[i])
        }
      }
      completedBatches += 1
    } catch {
      failedBatches += 1
    }
  }

  return { completedBatches, failedBatches, skippedOversized }
}
