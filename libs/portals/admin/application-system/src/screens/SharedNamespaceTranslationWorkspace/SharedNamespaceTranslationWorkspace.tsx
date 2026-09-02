import { useMemo, useState } from 'react'
import { Navigate, useLocation, useParams } from 'react-router-dom'
import { Box, Input, AlertMessage } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { buildSharedNamespaceTranslationPath } from '../../lib/paths'
import {
  useGetApplicationSharedNamespaceIntrospectionQuery,
  useGetApplicationTranslationsQuery,
} from '../../queries/translations.generated'
import type { MessageDescriptor } from '../../types/translationWorkspace'
import { isTranslationAccessForbiddenError } from '../../utils/translationWorkspaceErrors'
import {
  buildPersistedByKey,
  filterMessageDescriptorsBySearch,
  hasDraftChangesInRows,
} from '../../utils/translationWorkspaceEditing'
import { useRegisterTranslationWorkspaceHeaderChrome } from '../../context/TranslationWorkspaceHeaderBridge'
import { TranslationStringsList } from '../../components/TranslationWorkspaceStatesTabsPanel/TranslationStringsList'
import {
  TranslationWorkspaceError,
  TranslationWorkspaceLoading,
  TranslationWorkspaceNotFound,
} from '../../components/TranslationWorkspaceLoadStates/TranslationWorkspaceLoadStates'
import { TranslationPublishHistory } from '../../components/TranslationPublishHistory/TranslationPublishHistory'
import { TranslationPublishConfirmModal } from '../../components/TranslationPublishConfirmModal/TranslationPublishConfirmModal'
import { useTranslationWorkspaceDrafts } from '../../hooks/useTranslationWorkspaceDrafts'
import { useTranslationWorkspacePersistence } from '../../hooks/useTranslationWorkspacePersistence'
import * as styles from './SharedNamespaceTranslationWorkspace.css'

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

  const translationRows = translationsData?.applicationTranslations

  const persistedByKey = useMemo(
    () => buildPersistedByKey(translationRows),
    [translationRows],
  )

  const hasDraftChanges = useMemo(
    () => hasDraftChangesInRows(translationRows),
    [translationRows],
  )

  const [searchValue, setSearchValue] = useState('')

  const {
    activeLocale,
    setActiveLocale,
    editedValues,
    handleValueChange,
    getPersistedForLocale,
    clearEditedValues,
    hasUnsavedChanges,
    unsavedCount,
  } = useTranslationWorkspaceDrafts(persistedByKey)

  const {
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
  } = useTranslationWorkspacePersistence({
    namespace,
    editedValues,
    persistedByKey,
    hasUnsavedChanges,
    clearEditedValues,
    refetchTranslations,
    formatMessage,
    onValueChange: handleValueChange,
  })

  const messageDescriptors = useMemo(
    () => (introspection?.messageDescriptors ?? []) as MessageDescriptor[],
    [introspection],
  )

  const filteredDescriptors = useMemo(
    () => filterMessageDescriptorsBySearch(messageDescriptors, searchValue),
    [messageDescriptors, searchValue],
  )

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
    showValidationErrors: false,
    onToggleValidationErrors: () => undefined,
    showValidationToggle: false,
    hasDraftChanges,
    publishing,
    onPublish: handlePublish,
    onOpenHistory: handleOpenHistory,
    lastAutosaveTime,
    autosaveFailed,
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

  const usedByCount = introspection.usedByCount ?? 0
  const usedByMessage =
    usedByCount > 0
      ? formatMessage(m.sharedTranslationUsedByCount, {
          count: usedByCount,
        })
      : formatMessage(m.sharedTranslationUsedByAllApplications)

  return (
    <Box className={styles.sharedNamespaceShell}>
      <Box paddingY={3}>
        <Box marginBottom={3}>
          <AlertMessage type="info" message={usedByMessage} />
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
          translatingIds={translatingIds}
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

      <TranslationPublishConfirmModal
        isVisible={publishConfirmVisible}
        publishing={publishing}
        onConfirm={handlePublishConfirm}
        onClose={handleClosePublishConfirm}
      />
    </Box>
  )
}
