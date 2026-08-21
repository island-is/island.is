import type {
  EditedTranslations,
  MessageDescriptor,
} from '../types/translationWorkspace'

export const AUTOSAVE_INTERVAL_MS = 60_000
export const GOOGLE_TRANSLATE_BATCH_SIZE = 100

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

  return Array.from(dirtyByKey.entries()).map(([messageKey, fields]) => ({
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

export type GoogleTranslateFn = (input: {
  texts: string[]
}) => Promise<string[] | undefined | null>

export const applyGoogleTranslateBatches = async (
  items: GoogleTranslateItem[],
  translate: GoogleTranslateFn,
  onTranslated: (id: string, text: string) => void,
  batchSize = GOOGLE_TRANSLATE_BATCH_SIZE,
): Promise<void> => {
  if (items.length === 0) return

  for (let offset = 0; offset < items.length; offset += batchSize) {
    const slice = items.slice(offset, offset + batchSize)
    const translations =
      (await translate({
        texts: slice.map((item) => item.sourceText),
      })) ?? []

    for (let i = 0; i < slice.length; i++) {
      if (translations[i]) {
        onTranslated(slice[i].id, translations[i])
      }
    }
  }
}
