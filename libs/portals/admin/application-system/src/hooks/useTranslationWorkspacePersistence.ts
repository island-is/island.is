import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from '@island.is/island-ui/core'
import type { FormatMessage } from '@island.is/localization'
import { m } from '../lib/messages'
import {
  useBulkUpdateApplicationTranslationsMutation,
  useGoogleTranslateStringsMutation,
  usePublishApplicationTranslationsMutation,
} from '../queries/translations.generated'
import type { EditedTranslations } from '../types/translationWorkspace'
import {
  applyGoogleTranslateBatches,
  AUTOSAVE_INTERVAL_MS,
  buildTranslationsToSave,
  formatAutosaveTime,
} from '../utils/translationWorkspaceEditing'
import type {
  GoogleTranslateItem,
  PersistedByKey,
} from '../utils/translationWorkspaceEditing'
import { getTranslationSaveErrorDetail } from '../utils/translationWorkspaceErrors'

type UseTranslationWorkspacePersistenceArgs = {
  namespace: string
  editedValues: EditedTranslations
  persistedByKey: PersistedByKey
  hasUnsavedChanges: boolean
  clearEditedValues: () => void
  refetchTranslations: () => Promise<unknown>
  formatMessage: FormatMessage
  onValueChange: (messageKey: string, value: string) => void
  onBeforeDialogOpen?: () => void
}

export const useTranslationWorkspacePersistence = ({
  namespace,
  editedValues,
  persistedByKey,
  hasUnsavedChanges,
  clearEditedValues,
  refetchTranslations,
  formatMessage,
  onValueChange,
  onBeforeDialogOpen,
}: UseTranslationWorkspacePersistenceArgs) => {
  const [lastAutosaveTime, setLastAutosaveTime] = useState<string | null>(null)
  const [autosaveFailed, setAutosaveFailed] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [publishConfirmVisible, setPublishConfirmVisible] = useState(false)

  const [bulkUpdate, { loading: saving }] =
    useBulkUpdateApplicationTranslationsMutation()
  const [publishMutation, { loading: publishing }] =
    usePublishApplicationTranslationsMutation()
  const [googleTranslate] = useGoogleTranslateStringsMutation()
  const [translatingIds, setTranslatingIds] = useState<Set<string>>(
    () => new Set(),
  )

  const translateTexts = useCallback(
    async (texts: string[]) => {
      const { data: translateData } = await googleTranslate({
        variables: { input: { texts } },
      })
      return translateData?.googleTranslateStrings?.translations
    },
    [googleTranslate],
  )

  const withTranslatingIds = useCallback(
    async (ids: string[], fn: () => Promise<void>) => {
      if (ids.length === 0) return

      setTranslatingIds((prev) => {
        const next = new Set(prev)
        ids.forEach((id) => next.add(id))
        return next
      })
      try {
        await fn()
      } finally {
        setTranslatingIds((prev) => {
          const next = new Set(prev)
          ids.forEach((id) => next.delete(id))
          return next
        })
      }
    },
    [],
  )

  const handleGoogleTranslate = useCallback(
    async (descriptorId: string, sourceText: string) => {
      await withTranslatingIds([descriptorId], async () => {
        try {
          await applyGoogleTranslateBatches(
            [{ id: descriptorId, sourceText }],
            ({ texts }) => translateTexts(texts),
            onValueChange,
          )
        } catch (err) {
          console.error('Google Translate failed', err)
          toast.error('Translation failed')
        }
      })
    },
    [withTranslatingIds, translateTexts, onValueChange],
  )

  const handleGoogleTranslateAll = useCallback(
    async (items: GoogleTranslateItem[]) => {
      await withTranslatingIds(
        items.map((item) => item.id),
        async () => {
          try {
            await applyGoogleTranslateBatches(
              items,
              ({ texts }) => translateTexts(texts),
              onValueChange,
            )
          } catch (err) {
            console.error('Google Translate all failed', err)
            toast.error('Translation failed')
          }
        },
      )
    },
    [withTranslatingIds, translateTexts, onValueChange],
  )

  const handleSaveAll = useCallback(async (): Promise<boolean> => {
    const translationsToSave = buildTranslationsToSave(
      editedValues,
      persistedByKey,
      namespace,
    )

    if (translationsToSave.length === 0) return true

    try {
      const { data: mutationData } = await bulkUpdate({
        variables: { input: { translations: translationsToSave } },
      })

      if (
        mutationData?.bulkUpdateApplicationTranslations &&
        mutationData.bulkUpdateApplicationTranslations.length > 0
      ) {
        await refetchTranslations()
        clearEditedValues()
        setAutosaveFailed(false)
        toast.success(formatMessage(m.translationSave))
        return true
      }

      toast.error(
        formatMessage(m.translationSaveFailed, {
          detail: 'Engin gögn komu til baka frá vefþjónustu.',
        }),
      )
      return false
    } catch (err) {
      const detail = getTranslationSaveErrorDetail(err)
      console.error('bulkUpdateApplicationTranslations failed', err)
      toast.error(formatMessage(m.translationSaveFailed, { detail }))
      return false
    }
  }, [
    editedValues,
    persistedByKey,
    namespace,
    formatMessage,
    bulkUpdate,
    refetchTranslations,
    clearEditedValues,
  ])

  const handleSaveAllRef = useRef(handleSaveAll)
  useEffect(() => {
    handleSaveAllRef.current = handleSaveAll
  }, [handleSaveAll])

  const hasUnsavedChangesRef = useRef(hasUnsavedChanges)
  useEffect(() => {
    hasUnsavedChangesRef.current = hasUnsavedChanges
  }, [hasUnsavedChanges])

  const savingRef = useRef(saving)
  useEffect(() => {
    savingRef.current = saving
  }, [saving])

  useEffect(() => {
    const id = setInterval(async () => {
      if (hasUnsavedChangesRef.current && !savingRef.current) {
        const ok = await handleSaveAllRef.current()
        if (ok) {
          setLastAutosaveTime(formatAutosaveTime(new Date()))
          setAutosaveFailed(false)
        } else {
          setAutosaveFailed(true)
        }
      }
    }, AUTOSAVE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  const handlePublish = useCallback(async () => {
    if (!namespace) return

    if (hasUnsavedChanges) {
      const ok = await handleSaveAll()
      if (!ok) return
    }

    onBeforeDialogOpen?.()
    setPublishConfirmVisible(true)
  }, [namespace, hasUnsavedChanges, handleSaveAll, onBeforeDialogOpen])

  const handlePublishConfirm = useCallback(async () => {
    if (hasUnsavedChanges) {
      const ok = await handleSaveAll()
      if (!ok) return
    }

    setPublishConfirmVisible(false)

    try {
      await publishMutation({
        variables: { input: { namespace } },
      })
      await refetchTranslations()
      toast.success(formatMessage(m.translationPublishSuccess))
    } catch (err) {
      const detail = err instanceof Error ? err.message : 'Unknown error'
      console.error('publishApplicationTranslations failed', err)
      toast.error(formatMessage(m.translationPublishFailed, { detail }))
    }
  }, [
    hasUnsavedChanges,
    handleSaveAll,
    namespace,
    publishMutation,
    refetchTranslations,
    formatMessage,
  ])

  const handleOpenHistory = useCallback(() => {
    onBeforeDialogOpen?.()
    setHistoryOpen(true)
  }, [onBeforeDialogOpen])

  const handleCloseHistory = useCallback(() => {
    setHistoryOpen(false)
  }, [])

  const handleClosePublishConfirm = useCallback(() => {
    setPublishConfirmVisible(false)
  }, [])

  const handleRollbackComplete = useCallback(async () => {
    await refetchTranslations()
    clearEditedValues()
    setHistoryOpen(false)
  }, [refetchTranslations, clearEditedValues])

  return {
    saving,
    publishing,
    translatingIds,
    lastAutosaveTime,
    autosaveFailed,
    historyOpen,
    publishConfirmVisible,
    handleSaveAll,
    handleGoogleTranslate,
    handleGoogleTranslateAll,
    handlePublish,
    handlePublishConfirm,
    handleOpenHistory,
    handleCloseHistory,
    handleClosePublishConfirm,
    handleRollbackComplete,
  }
}
