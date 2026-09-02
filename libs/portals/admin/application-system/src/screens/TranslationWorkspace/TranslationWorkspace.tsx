import { Navigate, useLocation, useParams } from 'react-router-dom'
import { useMemo } from 'react'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { ApplicationSystemPaths } from '../../lib/paths'
import { TranslationWorkspacePreviewArea } from '../../components/TranslationWorkspacePreviewArea/TranslationWorkspacePreviewArea'
import { TranslationWorkspaceStatesTabsPanel } from '../../components/TranslationWorkspaceStatesTabsPanel/TranslationWorkspaceStatesTabsPanel'
import {
  TranslationWorkspaceError,
  TranslationWorkspaceLoading,
  TranslationWorkspaceNotFound,
} from '../../components/TranslationWorkspaceLoadStates/TranslationWorkspaceLoadStates'
import { TranslationPublishHistory } from '../../components/TranslationPublishHistory/TranslationPublishHistory'
import { TranslationPublishConfirmModal } from '../../components/TranslationPublishConfirmModal/TranslationPublishConfirmModal'
import { useRegisterTranslationWorkspaceHeaderChrome } from '../../context/TranslationWorkspaceHeaderBridge'
import { useTranslationWorkspaceData } from '../../hooks/useTranslationWorkspaceData'
import { useTranslationWorkspaceDerivedView } from '../../hooks/useTranslationWorkspaceDerivedView'
import { useTranslationWorkspaceDrafts } from '../../hooks/useTranslationWorkspaceDrafts'
import { useTranslationWorkspaceNavigation } from '../../hooks/useTranslationWorkspaceNavigation'
import { useTranslationWorkspacePersistence } from '../../hooks/useTranslationWorkspacePersistence'
import { useTranslationWorkspacePreviewUi } from '../../hooks/useTranslationWorkspacePreviewUi'
import { useViewportMaxWidth } from '../../hooks/useViewportMaxWidth'
import { isTranslationAccessForbiddenError } from '../../utils/translationWorkspaceErrors'
import { TranslationWorkspaceLayout } from './TranslationWorkspaceLayout'

const NAV_DRAWER_COMPACT_MAX_PX = theme.breakpoints.xl - 1

export const TranslationWorkspace = () => {
  const { typeId } = useParams<{ typeId: string }>()
  const location = useLocation()
  const { formatMessage } = useLocale()
  const isCompactNav = useViewportMaxWidth(NAV_DRAWER_COMPACT_MAX_PX)

  const {
    introspection,
    namespace,
    customFields,
    previewApplication,
    persistedByKey,
    hasDraftChanges,
    isLoading,
    loadError,
    refetchTranslations,
  } = useTranslationWorkspaceData(typeId)

  const {
    activeLocale,
    setActiveLocale,
    editedValues,
    handleValueChange,
    getPersistedForLocale,
    resolvePreviewString,
    clearEditedValues,
    hasUnsavedChanges,
    unsavedCount,
  } = useTranslationWorkspaceDrafts(persistedByKey)

  const {
    selectedScreen,
    selectedLocation,
    navDrawerOpen,
    openNavDrawer,
    closeNavDrawer,
    handleSidebarNavClick,
    handleNavDrawerVisibilityChange,
  } = useTranslationWorkspaceNavigation({
    introspection,
    typeId,
    isCompactNav,
  })

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
    onBeforeDialogOpen: closeNavDrawer,
  })

  const {
    showValidationErrors,
    focusedFieldId,
    fieldsTabActive,
    fieldErrorOverrides,
    previewFieldValues,
    handleToggleValidationErrors,
    handleFocusedFieldChange,
    handleSetPreviewFieldValue,
    handleToggleFieldError,
    handleFieldsTabChange,
  } = useTranslationWorkspacePreviewUi()

  const derivedView = useTranslationWorkspaceDerivedView({
    introspection,
    selectedLocation,
    selectedScreen,
  })

  const previewApplicationForState = useMemo(
    () => ({
      ...previewApplication,
      state: derivedView.activeStateKey || previewApplication.state,
    }),
    [previewApplication, derivedView.activeStateKey],
  )

  const isWorkspaceReady = Boolean(introspection) && !isLoading && !loadError

  useRegisterTranslationWorkspaceHeaderChrome({
    activeLocale,
    onLocaleChange: setActiveLocale,
    hasUnsavedChanges,
    unsavedCount,
    saving,
    onSaveAll: handleSaveAll,
    showValidationErrors,
    onToggleValidationErrors: handleToggleValidationErrors,
    hasDraftChanges,
    publishing,
    onPublish: handlePublish,
    onOpenHistory: handleOpenHistory,
    lastAutosaveTime,
    autosaveFailed,
    isReady: isWorkspaceReady,
  })

  if (typeId === 'shared' || typeId === 'namespaces') {
    const suffix = location.pathname.split(`/thydingar/${typeId}/`)[1]
    if (suffix) {
      return (
        <Navigate
          to={`${ApplicationSystemPaths.Translations}/namespaces/${suffix}`}
          replace
        />
      )
    }
  }

  if (isLoading) {
    return <TranslationWorkspaceLoading />
  }

  if (loadError) {
    if (isTranslationAccessForbiddenError(loadError)) {
      return <TranslationWorkspaceNotFound />
    }
    return <TranslationWorkspaceError loadError={loadError} />
  }

  if (!introspection) {
    return <TranslationWorkspaceNotFound />
  }

  const {
    activeForm,
    activeSections,
    activeFormTitle,
    previewScreens,
    footerSubmitScreen,
    screenMessageDescriptors,
    allApplicationMessageDescriptors,
    validationDescriptors,
    validationDescriptorsByPath,
    activeStateKey,
    activeStateName,
    activeRoleId,
  } = derivedView

  const navPanel = (
    <TranslationWorkspaceStatesTabsPanel
      states={introspection.states}
      selectedScreenId={selectedScreen?.id}
      selectedLocation={selectedLocation}
      onNavClick={handleSidebarNavClick}
      formatMessage={formatMessage}
      selectedScreen={selectedScreen}
      screenMessageDescriptors={screenMessageDescriptors}
      allApplicationMessageDescriptors={allApplicationMessageDescriptors}
      editedValues={editedValues}
      activeLocale={activeLocale}
      getPersistedForLocale={getPersistedForLocale}
      onValueChange={handleValueChange}
      showValidationErrors={showValidationErrors}
      validationDescriptors={validationDescriptors}
      persistedByKey={persistedByKey}
      previewScreens={previewScreens}
      resolvePreviewString={resolvePreviewString}
      validationDescriptorsByPath={validationDescriptorsByPath}
      focusedFieldId={focusedFieldId}
      onFocusedFieldChange={handleFocusedFieldChange}
      fieldErrorOverrides={fieldErrorOverrides}
      onToggleFieldError={handleToggleFieldError}
      onSetPreviewFieldValue={handleSetPreviewFieldValue}
      onActiveTabChange={handleFieldsTabChange}
      onGoogleTranslate={
        activeLocale === 'en' ? handleGoogleTranslate : undefined
      }
      onGoogleTranslateAll={
        activeLocale === 'en' ? handleGoogleTranslateAll : undefined
      }
      translatingIds={translatingIds}
    />
  )

  return (
    <TranslationWorkspaceLayout
      preview={
        <TranslationWorkspacePreviewArea
          previewScreens={previewScreens}
          resolvePreviewString={resolvePreviewString}
          formatMessage={formatMessage}
          templateName={introspection.name}
          activeFormTitle={activeFormTitle}
          activeSections={activeSections}
          selectedLocation={selectedLocation}
          activeStateKey={activeStateKey}
          activeStateName={activeStateName}
          activeRoleId={activeRoleId}
          formLogoKey={activeForm?.logoKey}
          onSidebarNavClick={handleSidebarNavClick}
          showValidationErrors={showValidationErrors}
          validationDescriptorsByPath={validationDescriptorsByPath}
          focusedFieldId={fieldsTabActive ? focusedFieldId : null}
          fieldErrorOverrides={fieldErrorOverrides}
          previewFieldValues={previewFieldValues}
          customFields={customFields}
          previewApplication={previewApplicationForState}
          activeLocale={activeLocale}
          footerSubmitScreen={footerSubmitScreen}
          extraMessageDescriptors={allApplicationMessageDescriptors}
        />
      }
      navPanel={navPanel}
      isCompactNav={isCompactNav}
      navDrawerOpen={navDrawerOpen}
      openPanelLabel={formatMessage(m.translationWorkspacePanelOpen)}
      navDrawerAriaLabel={formatMessage(m.translationStatesNavDrawerAriaLabel)}
      onOpenNavDrawer={openNavDrawer}
      onNavDrawerVisibilityChange={handleNavDrawerVisibilityChange}
    >
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
    </TranslationWorkspaceLayout>
  )
}
