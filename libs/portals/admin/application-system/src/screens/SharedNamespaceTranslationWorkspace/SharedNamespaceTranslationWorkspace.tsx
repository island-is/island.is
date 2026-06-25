import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import {
  Box,
  Button,
  Input,
  ModalBase,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import {
  ApplicationSystemPaths,
  buildSharedNamespaceTranslationPath,
} from '../../lib/paths'
import {
  useGetApplicationSharedNamespaceIntrospectionQuery,
  useGetApplicationTranslationsQuery,
  useBulkUpdateApplicationTranslationsMutation,
  usePublishApplicationTranslationsMutation,
  useGoogleTranslateStringsMutation,
} from '../../queries/translations.generated'
import type {
  EditedTranslations,
  MessageDescriptor,
} from '../../types/translationWorkspace'
import {
  getTranslationSaveErrorDetail,
  isTranslationAccessForbiddenError,
} from '../../utils/translationWorkspaceErrors'
import { useRegisterTranslationWorkspaceHeaderChrome } from '../../context/TranslationWorkspaceHeaderBridge'
import { TranslationWorkspacePageHeader } from '../../components/TranslationWorkspacePageHeader/TranslationWorkspacePageHeader'
import { TranslationStringsList } from '../../components/TranslationWorkspaceStatesTabsPanel/TranslationStringsList'
import {
  TranslationWorkspaceError,
  TranslationWorkspaceLoading,
  TranslationWorkspaceNotFound,
} from '../../components/TranslationWorkspaceLoadStates/TranslationWorkspaceLoadStates'
import { TranslationPublishHistory } from '../../components/TranslationPublishHistory/TranslationPublishHistory'
import { publishConfirmModal } from '../TranslationWorkspace/TranslationWorkspace.css'
import * as styles from './SharedNamespaceTranslationWorkspace.css'

const AUTOSAVE_INTERVAL_MS = 60_000
const GOOGLE_TRANSLATE_BATCH_SIZE = 100

export const SharedNamespaceTranslationWorkspace = () => {
  const { namespace: encodedNamespace } = useParams<{ namespace: string }>()
  const location = useLocation()
  const namespace = encodedNamespace ? decodeURIComponent(encodedNamespace) : ''
  const { formatMessage } = useLocale()

  const { data, loading, error } =
    useGetApplicationSharedNamespaceIntrospectionQuery({
      variables: { namespace },
      skip: !namespace,
    })

  const introspection = data?.applicationSharedNamespaceIntrospection ?? null

  const {
    data: translationsData,
    loading: translationsLoading,
    error: translationsError,
    refetch: refetchTranslations,
  } = useGetApplicationTranslationsQuery({
    variables: { namespace },
    skip: !namespace || !introspection,
  })

  const persistedByKey = useMemo(() => {
    const map: Record<string, { valueIs: string; valueEn?: string | null }> = {}
    for (const row of translationsData?.applicationTranslations ?? []) {
      map[row.messageKey] = {
        valueIs: row.draftValueIs ?? row.valueIs,
        valueEn: row.draftValueEn ?? row.valueEn,
      }
    }
    return map
  }, [translationsData])

  const hasDraftChanges = useMemo(() => {
    return (translationsData?.applicationTranslations ?? []).some(
      (row) => row.draftValueIs != null || row.draftValueEn != null,
    )
  }, [translationsData])

  const [activeLocale, setActiveLocale] = useState<'is' | 'en'>('en')
  const [editedValues, setEditedValues] = useState<EditedTranslations>({
    is: {},
    en: {},
  })
  const [searchValue, setSearchValue] = useState('')
  const [lastAutosaveTime, setLastAutosaveTime] = useState<string | null>(null)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [publishConfirmVisible, setPublishConfirmVisible] = useState(false)

  const messageDescriptors = useMemo(
    () => (introspection?.messageDescriptors ?? []) as MessageDescriptor[],
    [introspection],
  )

  const filteredDescriptors = useMemo(() => {
    const query = searchValue.trim().toLowerCase()
    if (!query) return messageDescriptors

    return messageDescriptors.filter(
      (descriptor) =>
        descriptor.id.toLowerCase().includes(query) ||
        (descriptor.defaultMessage ?? '').toLowerCase().includes(query),
    )
  }, [messageDescriptors, searchValue])

  const getPersistedForMessage = useCallback(
    (messageKey: string, locale: 'is' | 'en') => {
      const row = persistedByKey[messageKey]
      if (!row) return ''
      return locale === 'en' ? row.valueEn ?? '' : row.valueIs
    },
    [persistedByKey],
  )

  const getPersistedForLocale = useCallback(
    (messageKey: string) => getPersistedForMessage(messageKey, activeLocale),
    [getPersistedForMessage, activeLocale],
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

  const [bulkUpdate, { loading: saving }] =
    useBulkUpdateApplicationTranslationsMutation()

  const [publishMutation, { loading: publishing }] =
    usePublishApplicationTranslationsMutation()

  const [googleTranslate, { loading: translating }] =
    useGoogleTranslateStringsMutation()

  const handleGoogleTranslate = useCallback(
    async (descriptorId: string, sourceText: string) => {
      try {
        const { data: translateData } = await googleTranslate({
          variables: { input: { texts: [sourceText] } },
        })
        const translated =
          translateData?.googleTranslateStrings?.translations?.[0]
        if (translated) {
          handleValueChange(descriptorId, translated)
        }
      } catch (err) {
        console.error('Google Translate failed', err)
        toast.error('Translation failed')
      }
    },
    [googleTranslate, handleValueChange],
  )

  const handleGoogleTranslateAll = useCallback(
    async (items: Array<{ id: string; sourceText: string }>) => {
      if (items.length === 0) return
      try {
        for (
          let offset = 0;
          offset < items.length;
          offset += GOOGLE_TRANSLATE_BATCH_SIZE
        ) {
          const slice = items.slice(
            offset,
            offset + GOOGLE_TRANSLATE_BATCH_SIZE,
          )
          const { data: translateData } = await googleTranslate({
            variables: {
              input: { texts: slice.map((item) => item.sourceText) },
            },
          })
          const translations =
            translateData?.googleTranslateStrings?.translations ?? []
          for (let i = 0; i < slice.length; i++) {
            if (translations[i]) {
              handleValueChange(slice[i].id, translations[i])
            }
          }
        }
      } catch (err) {
        console.error('Google Translate all failed', err)
        toast.error('Translation failed')
      }
    },
    [googleTranslate, handleValueChange],
  )

  const handleSaveAll = useCallback(async (): Promise<boolean> => {
    const dirtyByKey = new Map<string, { valueIs?: string; valueEn?: string }>()

    for (const locale of ['is', 'en'] as const) {
      for (const [messageKey, value] of Object.entries(editedValues[locale])) {
        if (value === getPersistedForMessage(messageKey, locale)) continue
        const merged = dirtyByKey.get(messageKey) ?? {}
        if (locale === 'is') merged.valueIs = value
        else merged.valueEn = value
        dirtyByKey.set(messageKey, merged)
      }
    }

    const translationsToSave = Array.from(dirtyByKey.entries()).map(
      ([messageKey, fields]) => ({
        namespace,
        messageKey,
        ...fields,
      }),
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
        setEditedValues({ is: {}, en: {} })
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
    namespace,
    formatMessage,
    bulkUpdate,
    getPersistedForMessage,
    refetchTranslations,
  ])

  const hasUnsavedChanges = useMemo(
    () =>
      (['is', 'en'] as const).some((locale) =>
        Object.entries(editedValues[locale]).some(
          ([key, value]) => value !== getPersistedForMessage(key, locale),
        ),
      ),
    [editedValues, getPersistedForMessage],
  )

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
        await handleSaveAllRef.current()
        const now = new Date()
        setLastAutosaveTime(
          `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes(),
          ).padStart(2, '0')}`,
        )
      }
    }, AUTOSAVE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  const handlePublish = useCallback(async () => {
    if (!namespace) return

    if (hasUnsavedChanges) {
      await handleSaveAll()
    }

    setPublishConfirmVisible(true)
  }, [namespace, hasUnsavedChanges, handleSaveAll])

  const handlePublishConfirm = useCallback(async () => {
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
  }, [namespace, publishMutation, refetchTranslations, formatMessage])

  const handleOpenHistory = useCallback(() => {
    setHistoryOpen(true)
  }, [])

  const handleCloseHistory = useCallback(() => {
    setHistoryOpen(false)
  }, [])

  const handleRollbackComplete = useCallback(async () => {
    await refetchTranslations()
    setEditedValues({ is: {}, en: {} })
    setHistoryOpen(false)
  }, [refetchTranslations])

  const unsavedCount = useMemo(() => {
    const keysWithPending = new Set<string>()
    for (const locale of ['is', 'en'] as const) {
      for (const [messageKey, value] of Object.entries(editedValues[locale])) {
        if (value !== getPersistedForMessage(messageKey, locale)) {
          keysWithPending.add(messageKey)
        }
      }
    }
    return keysWithPending.size
  }, [editedValues, getPersistedForMessage])

  const isWorkspaceReady =
    Boolean(introspection) &&
    !(loading || Boolean(introspection && translationsLoading)) &&
    !(error ?? translationsError)

  useRegisterTranslationWorkspaceHeaderChrome({
    activeLocale,
    onLocaleChange: setActiveLocale,
    hasUnsavedChanges,
    unsavedCount,
    saving,
    onSaveAll: handleSaveAll,
    formatMessage,
    showValidationErrors: false,
    onToggleValidationErrors: () => undefined,
    showValidationToggle: false,
    hasDraftChanges,
    publishing,
    onPublish: handlePublish,
    onOpenHistory: handleOpenHistory,
    lastAutosaveTime,
    isReady: isWorkspaceReady,
  })

  if (location.pathname.includes('/thydingar/shared/') && namespace) {
    return (
      <Navigate to={buildSharedNamespaceTranslationPath(namespace)} replace />
    )
  }

  if (!namespace) {
    return <TranslationWorkspaceNotFound />
  }

  if (loading || (introspection && translationsLoading)) {
    return <TranslationWorkspaceLoading />
  }

  const loadError = error ?? translationsError
  if (loadError) {
    if (isTranslationAccessForbiddenError(loadError)) {
      return <TranslationWorkspaceNotFound />
    }
    return (
      <TranslationWorkspaceError
        loadError={loadError}
        title="Error loading shared translations"
      />
    )
  }

  if (!introspection) {
    return <TranslationWorkspaceNotFound />
  }

  return (
    <Box className={styles.sharedNamespaceShell}>
      <TranslationWorkspacePageHeader />

      <Box paddingY={3}>
        <Box marginBottom={3}>
          <Link to={ApplicationSystemPaths.Root}>
            <Button variant="text" size="small">
              {formatMessage(m.translationBackToList)}
            </Button>
          </Link>
        </Box>

        <Box marginBottom={3}>
          <Input
            name="search-shared-namespace-strings"
            placeholder={formatMessage(m.searchStrPlaceholder)}
            size="sm"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </Box>

        <TranslationStringsList
          heading={namespace}
          descriptors={filteredDescriptors}
          editedValues={editedValues}
          activeLocale={activeLocale}
          getPersistedForLocale={getPersistedForLocale}
          onValueChange={handleValueChange}
          formatMessage={formatMessage}
          persistedByKey={persistedByKey}
          onGoogleTranslate={
            activeLocale === 'en' ? handleGoogleTranslate : undefined
          }
          onGoogleTranslateAll={
            activeLocale === 'en' ? handleGoogleTranslateAll : undefined
          }
          isTranslating={translating}
          emptyMessage={formatMessage(m.sharedTranslationNamespaceEmpty)}
        />
      </Box>

      <TranslationPublishHistory
        namespace={namespace}
        isOpen={historyOpen}
        onClose={handleCloseHistory}
        onRollbackComplete={handleRollbackComplete}
        formatMessage={formatMessage}
      />

      <ModalBase
        baseId="sharedNamespacePublishConfirmModal"
        className={publishConfirmModal}
        isVisible={publishConfirmVisible}
        hideOnClickOutside
        onVisibilityChange={(visible) => {
          if (!visible) setPublishConfirmVisible(false)
        }}
      >
        {({ closeModal }: { closeModal: () => void }) => (
          <Box background="white" paddingY={[3, 6, 12]} paddingX={[3, 6, 12]}>
            <Text variant="h2" as="h2" marginBottom={1}>
              {formatMessage(m.translationPublish)}
            </Text>
            <Text paddingTop={2}>
              {formatMessage(m.translationPublishConfirm)}
            </Text>
            <Box
              marginTop={4}
              display="flex"
              flexDirection="row"
              justifyContent="spaceBetween"
            >
              <Button variant="ghost" size="small" onClick={closeModal}>
                {formatMessage(m.translationPublishCancel)}
              </Button>
              <Button
                size="small"
                onClick={handlePublishConfirm}
                loading={publishing}
              >
                {formatMessage(m.translationPublish)}
              </Button>
            </Box>
          </Box>
        )}
      </ModalBase>
    </Box>
  )
}
