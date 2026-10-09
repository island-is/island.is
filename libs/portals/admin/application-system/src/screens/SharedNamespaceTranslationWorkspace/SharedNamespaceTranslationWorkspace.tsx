import { useMemo, useState, type ReactNode } from 'react'
import { Navigate, useLocation, useParams } from 'react-router-dom'
import {
  Box,
  Input,
  AlertMessage,
  Text,
  ToggleSwitchButton,
} from '@island.is/island-ui/core'
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
import { TranslationWorkspaceHeaderSlot } from '../../components/TranslationWorkspaceHeader/TranslationWorkspaceHeader'
import { TranslationStringsList } from '../../components/TranslationWorkspaceStatesTabsPanel/TranslationStringsList'
import {
  TranslationWorkspaceError,
  TranslationWorkspaceLoading,
  TranslationWorkspaceNotFound,
} from '../../components/TranslationWorkspaceLoadStates/TranslationWorkspaceLoadStates'
import { TranslationPublishHistory } from '../../components/TranslationPublishHistory/TranslationPublishHistory'
import { TranslationPublishConfirmModal } from '../../components/TranslationPublishConfirmModal/TranslationPublishConfirmModal'
import { TranslationUnsavedChangesGuard } from '../../components/TranslationUnsavedChangesModal/TranslationUnsavedChangesModal'
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
    getPersistedValue,
    clearEditedValues,
    clearSavedEditedValues,
    hasUnsavedChanges,
    unsavedCount,
  } = useTranslationWorkspaceDrafts(persistedByKey)

  const {
    saving,
    publishing,
    translatingIds,
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
    clearSavedEditedValues,
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

  const headerChrome = isWorkspaceReady
    ? {
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
      }
    : null

  if (location.pathname.includes('/thydingar/shared/') && namespace) {
    return (
      <Navigate to={buildSharedNamespaceTranslationPath(namespace)} replace />
    )
  }

  const loadError = error ?? translationsError
  let workspace: ReactNode

  if (!namespace) {
    workspace = <TranslationWorkspaceNotFound />
  } else if (loading || (introspection && translationsLoading)) {
    workspace = <TranslationWorkspaceLoading />
  } else if (loadError) {
    workspace = isTranslationAccessForbiddenError(loadError) ? (
      <TranslationWorkspaceNotFound />
    ) : (
      <TranslationWorkspaceError
        loadError={loadError}
        title="Error loading shared translations"
      />
    )
  } else if (!introspection) {
    workspace = <TranslationWorkspaceNotFound />
  } else {
    const usedByCount = introspection.usedByCount ?? 0
    const usedByMessage =
      usedByCount > 0
        ? formatMessage(m.sharedTranslationUsedByCount, {
            count: usedByCount,
          })
        : formatMessage(m.sharedTranslationUsedByAllApplications)

    workspace = (
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

          <Box
            position="sticky"
            top={0}
            marginBottom={3}
            display="flex"
            alignItems="center"
            justifyContent="spaceBetween"
            columnGap={2}
            className={styles.localeStickyHeader}
          >
            <Text variant="medium" as="span">
              {formatMessage(m.translationEditIcelandicToggle)}
            </Text>
            <ToggleSwitchButton
              label={formatMessage(m.translationEditIcelandicToggle)}
              hiddenLabel
              checked={activeLocale === 'is'}
              onChange={(checked) => setActiveLocale(checked ? 'is' : 'en')}
              className={styles.toggleButton}
            />
          </Box>

          <TranslationStringsList
            descriptors={filteredDescriptors}
            editedValues={editedValues}
            activeLocale={activeLocale}
            getPersistedValue={getPersistedValue}
            onValueChange={handleValueChange}
            formatMessage={formatMessage}
            persistedByKey={persistedByKey}
            onGoogleTranslate={handleGoogleTranslate}
            onGoogleTranslateAll={handleGoogleTranslateAll}
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

  return (
    <>
      <TranslationWorkspaceHeaderSlot chrome={headerChrome} />
      <TranslationUnsavedChangesGuard
        hasUnsavedChanges={hasUnsavedChanges}
        onSave={handleSaveAll}
        onDiscard={clearEditedValues}
      />
      {workspace}
    </>
  )
}
