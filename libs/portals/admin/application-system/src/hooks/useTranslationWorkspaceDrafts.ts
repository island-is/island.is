import { useCallback, useMemo, useState } from 'react'
import type { EditedTranslations } from '../types/translationWorkspace'
import {
  countUnsavedTranslationKeys,
  getPersistedForMessage,
  hasUnsavedTranslationChanges,
} from '../utils/translationWorkspaceEditing'
import type {
  PersistedByKey,
  TranslationLocale,
} from '../utils/translationWorkspaceEditing'

const createEmptyEditedValues = (): EditedTranslations => ({ is: {}, en: {} })

export const useTranslationWorkspaceDrafts = (
  persistedByKey: PersistedByKey,
) => {
  const [activeLocale, setActiveLocale] = useState<TranslationLocale>('en')
  const [editedValues, setEditedValues] = useState<EditedTranslations>(
    createEmptyEditedValues,
  )

  const getPersistedValue = useCallback(
    (messageKey: string, locale: TranslationLocale) =>
      getPersistedForMessage(persistedByKey, messageKey, locale),
    [persistedByKey],
  )

  const getPersistedForLocale = useCallback(
    (messageKey: string) => getPersistedValue(messageKey, activeLocale),
    [getPersistedValue, activeLocale],
  )

  const resolvePreviewString = useCallback(
    (messageKey: string, defaultMessage?: string | null) => {
      const draft = editedValues[activeLocale][messageKey]
      if (draft !== undefined && draft !== '') {
        return draft
      }
      const persisted = getPersistedValue(messageKey, activeLocale)
      if (persisted !== '') {
        return persisted
      }
      return defaultMessage ?? ''
    },
    [editedValues, activeLocale, getPersistedValue],
  )

  const handleValueChange = useCallback(
    (messageKey: string, value: string) => {
      setEditedValues((prev) => ({
        ...prev,
        [activeLocale]: { ...prev[activeLocale], [messageKey]: value },
      }))
    },
    [activeLocale],
  )

  const clearEditedValues = useCallback(() => {
    setEditedValues(createEmptyEditedValues())
  }, [])

  const hasUnsavedChanges = useMemo(
    () => hasUnsavedTranslationChanges(editedValues, persistedByKey),
    [editedValues, persistedByKey],
  )

  const unsavedCount = useMemo(
    () => countUnsavedTranslationKeys(editedValues, persistedByKey),
    [editedValues, persistedByKey],
  )

  return {
    activeLocale,
    setActiveLocale,
    editedValues,
    handleValueChange,
    getPersistedForLocale,
    resolvePreviewString,
    clearEditedValues,
    hasUnsavedChanges,
    unsavedCount,
  }
}
