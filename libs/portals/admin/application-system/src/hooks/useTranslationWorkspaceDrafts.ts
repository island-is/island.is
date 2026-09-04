import { useCallback, useMemo, useState } from 'react'
import type { EditedTranslations } from '../types/translationWorkspace'
import {
  countUnsavedTranslationKeys,
  getPersistedForMessage,
  hasUnsavedTranslationChanges,
} from '../utils/translationWorkspaceEditing'
import { unescapePreviewMarkdownString } from '../utils/translationWorkspaceStaticText'
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
      let value: string
      if (draft !== undefined) {
        if (draft !== '') {
          value = draft
        } else if (activeLocale === 'en') {
          const icelandicDraft = editedValues.is[messageKey]
          value =
            icelandicDraft !== undefined && icelandicDraft !== ''
              ? icelandicDraft
              : getPersistedValue(messageKey, 'is') || defaultMessage || ''
        } else {
          value = defaultMessage ?? ''
        }
      } else {
        const persisted = getPersistedValue(messageKey, activeLocale)
        if (persisted !== '') {
          value = persisted
        } else if (activeLocale === 'en') {
          value = getPersistedValue(messageKey, 'is') || defaultMessage || ''
        } else {
          value = defaultMessage ?? ''
        }
      }
      return unescapePreviewMarkdownString(messageKey, value)
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

  const clearSavedEditedValues = useCallback(
    (
      saved: Array<{
        messageKey: string
        valueIs?: string
        valueEn?: string
      }>,
    ) => {
      setEditedValues((prev) => {
        const next: EditedTranslations = {
          is: { ...prev.is },
          en: { ...prev.en },
        }
        for (const item of saved) {
          if (
            item.valueIs !== undefined &&
            next.is[item.messageKey] === item.valueIs
          ) {
            delete next.is[item.messageKey]
          }
          if (
            item.valueEn !== undefined &&
            next.en[item.messageKey] === item.valueEn
          ) {
            delete next.en[item.messageKey]
          }
        }
        return next
      })
    },
    [],
  )

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
    clearSavedEditedValues,
    hasUnsavedChanges,
    unsavedCount,
  }
}
