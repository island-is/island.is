import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useLocation, useParams } from 'react-router-dom'
import { Box, Button, ModalBase, Text, toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import {
  useGetApplicationTemplateIntrospectionQuery,
  useGetApplicationTranslationsQuery,
  useBulkUpdateApplicationTranslationsMutation,
  useGetApplicationTemplateRoleFormLazyQuery,
  usePublishApplicationTranslationsMutation,
  useGoogleTranslateStringsMutation,
} from '../../queries/translations.generated'
import type {
  EditedTranslations,
  MessageDescriptor,
  ScreenIntrospection,
  SidebarNavLocation,
  TemplateSectionNav,
  TemplateStateNav,
  ValidationMessageDescriptor,
} from '../../types/translationWorkspace'
import {
  getTranslationSaveErrorDetail,
  isTranslationAccessForbiddenError,
  shortenForToast,
} from '../../utils/translationWorkspaceErrors'
import { ApplicationSystemPaths } from '../../lib/paths'
import { PREVIEW_EXCLUDED_FIELD_TYPES } from '../../utils/translationWorkspaceFieldConstants'
import { findFooterSubmitScreen } from '../../utils/translationWorkspaceFooterSubmit'
import {
  buildSectionNavigationScreen,
  buildSubSectionNavigationScreen,
} from '../../utils/translationWorkspaceNavigation'
import { useRegisterTranslationWorkspaceHeaderChrome } from '../../context/TranslationWorkspaceHeaderBridge'
import { TranslationWorkspacePageHeader } from '../../components/TranslationWorkspacePageHeader/TranslationWorkspacePageHeader'
import { TranslationWorkspacePreviewArea } from '../../components/TranslationWorkspacePreviewArea/TranslationWorkspacePreviewArea'
import { TranslationWorkspaceStatesTabsPanel } from '../../components/TranslationWorkspaceStatesTabsPanel/TranslationWorkspaceStatesTabsPanel'
import {
  TranslationWorkspaceError,
  TranslationWorkspaceLoading,
  TranslationWorkspaceNotFound,
} from '../../components/TranslationWorkspaceLoadStates/TranslationWorkspaceLoadStates'
import { TranslationPublishHistory } from '../../components/TranslationPublishHistory/TranslationPublishHistory'
import { createWorkspacePreviewApplication } from '../../components/TranslationWorkspaceFieldPreview/TranslationWorkspaceFieldPreview'
import { useTemplateCustomFields } from '../../hooks/useTemplateCustomFields'
import * as workspaceStyles from './TranslationWorkspace.css'

const AUTOSAVE_INTERVAL_MS = 60_000

export const TranslationWorkspace = () => {
  const { typeId } = useParams<{ typeId: string }>()
  const location = useLocation()
  const { formatMessage } = useLocale()
  const {
    customFields,
    loading: customFieldsLoading,
    error: customFieldsError,
  } = useTemplateCustomFields(typeId)

  const previewApplication = useMemo(
    () => createWorkspacePreviewApplication(typeId),
    [typeId],
  )

  const { data, loading, error } = useGetApplicationTemplateIntrospectionQuery({
    variables: { typeId: typeId ?? '' },
    skip: !typeId,
  })

  const introspection = data?.applicationTemplateIntrospection ?? null

  const namespace = introspection?.translationNamespaces[0] ?? typeId ?? ''

  const {
    data: translationsData,
    loading: translationsLoading,
    error: translationsError,
    refetch: refetchTranslations,
  } = useGetApplicationTranslationsQuery({
    variables: { namespace },
    skip: !typeId || !introspection,
  })

  /**
   * persistedByKey uses draft values when available so the admin workspace
   * always shows the latest draft. Published values are only used as fallback.
   */
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

  /**
   * hasDraftChanges is true when any row in the namespace has non-null draft values,
   * meaning there are unpublished changes stored in the DB.
   */
  const hasDraftChanges = useMemo(() => {
    return (translationsData?.applicationTranslations ?? []).some(
      (row) => row.draftValueIs != null || row.draftValueEn != null,
    )
  }, [translationsData])

  const [activeLocale, setActiveLocale] = useState<'is' | 'en'>('en')
  const [showValidationErrors, setShowValidationErrors] = useState(false)
  const [selectedScreen, setSelectedScreen] =
    useState<ScreenIntrospection | null>(null)
  const [selectedLocation, setSelectedLocation] =
    useState<SidebarNavLocation | null>(null)
  const [editedValues, setEditedValues] = useState<EditedTranslations>({
    is: {},
    en: {},
  })
  const [focusedFieldId, setFocusedFieldId] = useState<string | null>(null)
  const [fieldsTabActive, setFieldsTabActive] = useState(false)
  const [fieldErrorOverrides, setFieldErrorOverrides] = useState<Set<string>>(
    () => new Set(),
  )
  const [previewFieldValues, setPreviewFieldValues] = useState<
    Record<string, string>
  >({})
  const [lastAutosaveTime, setLastAutosaveTime] = useState<string | null>(null)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [publishConfirmVisible, setPublishConfirmVisible] = useState(false)

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

  const resolvePreviewString = useCallback(
    (messageKey: string, defaultMessage?: string | null) => {
      const draft = editedValues[activeLocale][messageKey]
      if (draft !== undefined && draft !== '') {
        return draft
      }
      const persisted = getPersistedForMessage(messageKey, activeLocale)
      if (persisted !== '') {
        return persisted
      }
      return defaultMessage ?? ''
    },
    [editedValues, activeLocale, getPersistedForMessage],
  )

  const [bulkUpdate, { loading: saving }] =
    useBulkUpdateApplicationTranslationsMutation()

  const [publishMutation, { loading: publishing }] =
    usePublishApplicationTranslationsMutation()

  const [googleTranslate, { loading: translating }] =
    useGoogleTranslateStringsMutation()

  const [fetchRoleForm] = useGetApplicationTemplateRoleFormLazyQuery()

  const activeStateKey = selectedLocation?.stateKey ?? ''
  const activeStateName = selectedLocation?.stateName ?? ''
  const activeRoleId = selectedLocation?.roleId ?? ''

  const activeForm = useMemo(() => {
    if (!selectedLocation || !introspection) return null
    const state = introspection.states.find(
      (s) => s.stateKey === selectedLocation.stateKey,
    )
    const role = state?.roles.find((r) => r.roleId === selectedLocation.roleId)
    return role?.form ?? null
  }, [selectedLocation, introspection])

  const activeSections = useMemo(
    () => (activeForm?.sections ?? []) as TemplateSectionNav[],
    [activeForm],
  )
  const activeFormTitle = activeForm?.title ?? null

  const previewScreens = useMemo((): ScreenIntrospection[] => {
    if (!selectedLocation || !introspection) return []
    const state = introspection.states.find(
      (s) => s.stateKey === selectedLocation.stateKey,
    )
    const role = state?.roles.find((r) => r.roleId === selectedLocation.roleId)
    const section = role?.form?.sections.find(
      (s) => s.id === selectedLocation.sectionId,
    )
    if (!section) return []

    const excludeHidden = (screens: ScreenIntrospection[]) =>
      screens.filter((s) => !PREVIEW_EXCLUDED_FIELD_TYPES.has(s.type))

    if (selectedLocation.leafSourceScreenId) {
      const screen = (section.screens as ScreenIntrospection[]).find(
        (s) => s.id === selectedLocation.leafSourceScreenId,
      )
      return screen && !PREVIEW_EXCLUDED_FIELD_TYPES.has(screen.type)
        ? [screen]
        : []
    }
    if (selectedLocation.subsectionId) {
      const sub = section.subSections.find(
        (s) => s.id === selectedLocation.subsectionId,
      )
      return excludeHidden((sub?.screens ?? []) as ScreenIntrospection[])
    }
    return excludeHidden([
      ...(section.screens as ScreenIntrospection[]),
      ...section.subSections.flatMap((s) => s.screens as ScreenIntrospection[]),
    ])
  }, [selectedLocation, introspection])

  const footerSubmitScreen = useMemo(
    () => findFooterSubmitScreen(previewScreens),
    [previewScreens],
  )

  const screenMessageDescriptors = useMemo((): MessageDescriptor[] => {
    if (!selectedScreen) return []
    const all = [...selectedScreen.messageDescriptors]
    if (selectedScreen.children) {
      for (const child of selectedScreen.children) {
        all.push(...child.messageDescriptors)
      }
    }
    return all
  }, [selectedScreen])

  const allApplicationMessageDescriptors = useMemo(
    () => (introspection?.allMessageDescriptors ?? []) as MessageDescriptor[],
    [introspection],
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

  const handleToggleValidationErrors = useCallback(() => {
    setShowValidationErrors((prev) => !prev)
  }, [])

  const handleFocusedFieldChange = useCallback((fieldId: string | null) => {
    setFocusedFieldId(fieldId)
  }, [])

  const handleSetPreviewFieldValue = useCallback(
    (fieldId: string, value: string) => {
      setPreviewFieldValues((prev) => ({ ...prev, [fieldId]: value }))
    },
    [],
  )

  const handleToggleFieldError = useCallback((fieldId: string) => {
    setFieldErrorOverrides((prev) => {
      const next = new Set(prev)
      if (next.has(fieldId)) {
        next.delete(fieldId)
      } else {
        next.add(fieldId)
      }
      return next
    })
  }, [])

  const handleGoogleTranslate = useCallback(
    async (descriptorId: string, sourceText: string) => {
      try {
        const { data } = await googleTranslate({
          variables: { input: { texts: [sourceText] } },
        })
        const translated = data?.googleTranslateStrings?.translations?.[0]
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

  const GOOGLE_TRANSLATE_BATCH_SIZE = 100

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
          const { data } = await googleTranslate({
            variables: { input: { texts: slice.map((i) => i.sourceText) } },
          })
          const translations = data?.googleTranslateStrings?.translations ?? []
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

  const validationDescriptors = useMemo(
    (): ValidationMessageDescriptor[] =>
      (introspection?.validationMessageDescriptors ??
        []) as ValidationMessageDescriptor[],
    [introspection],
  )

  const validationDescriptorsByPath = useMemo(() => {
    const map: Record<string, ValidationMessageDescriptor[]> = {}
    for (const d of validationDescriptors) {
      const key = d.fieldPath
      if (!map[key]) map[key] = []
      map[key].push(d)
    }
    return map
  }, [validationDescriptors])

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
          ([k, v]) => v !== getPersistedForMessage(k, locale),
        ),
      ),
    [editedValues, getPersistedForMessage],
  )

  // --- Autosave every 60 seconds ---
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

  // --- Publish ---
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

  const handleSidebarNavClick = useCallback(
    (nav: ScreenIntrospection, location: SidebarNavLocation) => {
      if (!introspection) return

      const resolvedTypeId = introspection.typeId ?? typeId ?? ''

      void fetchRoleForm({
        variables: {
          typeId: resolvedTypeId,
          stateKey: location.stateKey,
          roleId: location.roleId,
        },
        fetchPolicy: 'network-only',
      }).then((result) => {
        if (result.error) {
          console.error(
            '[TranslationWorkspace] loadRoleForm (formLoader) failed',
            result.error,
          )
          toast.error(
            shortenForToast(
              result.error.message ?? 'Could not load form from server',
            ),
          )
          return
        }
        console.log(
          '[TranslationWorkspace] form from formLoader (serialized JSON)',
          {
            template: {
              typeId: resolvedTypeId,
              name: introspection.name,
              slug: introspection.slug,
            },
            location,
            nav,
            form: result.data?.applicationTemplateRoleForm,
          },
        )
      })

      setSelectedScreen(nav)
      setSelectedLocation(location)
    },
    [introspection, typeId, fetchRoleForm],
  )

  useEffect(() => {
    if (!introspection || selectedScreen) return

    for (const state of introspection.states) {
      for (const role of state.roles) {
        if (!role.form) continue
        for (const section of role.form.sections) {
          const subs = section.subSections as Array<{
            id: string
            title?: string | null
            titleMessageDescriptor?: MessageDescriptor | null
            screens: ScreenIntrospection[]
          }>
          if (subs.length > 0) {
            const firstSub = subs.find(
              (s) => (s.screens as ScreenIntrospection[]).length > 0,
            )
            if (firstSub) {
              const screens = firstSub.screens as ScreenIntrospection[]
              const nav = buildSubSectionNavigationScreen(
                firstSub.id,
                firstSub.title,
                firstSub.titleMessageDescriptor,
                screens,
              )
              handleSidebarNavClick(nav, {
                stateKey: state.stateKey,
                stateName: state.stateName,
                roleId: role.roleId,
                sectionId: section.id,
                sectionTitle: section.title,
                subsectionId: firstSub.id,
                subsectionTitle: firstSub.title,
              })
              return
            }
          }
          const screens = section.screens as ScreenIntrospection[]
          if (screens.length > 0) {
            const nav = buildSectionNavigationScreen(
              section.id,
              section.title,
              section.titleMessageDescriptor,
              screens,
            )
            handleSidebarNavClick(nav, {
              stateKey: state.stateKey,
              stateName: state.stateName,
              roleId: role.roleId,
              sectionId: section.id,
              sectionTitle: section.title,
            })
            return
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [introspection, handleSidebarNavClick])

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
    showValidationErrors,
    onToggleValidationErrors: handleToggleValidationErrors,
    hasDraftChanges,
    publishing,
    onPublish: handlePublish,
    onOpenHistory: handleOpenHistory,
    lastAutosaveTime,
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

  if (loading || (introspection && translationsLoading)) {
    return <TranslationWorkspaceLoading />
  }

  const loadError = error ?? translationsError
  if (loadError) {
    if (isTranslationAccessForbiddenError(loadError)) {
      return <TranslationWorkspaceNotFound />
    }
    return <TranslationWorkspaceError loadError={loadError} />
  }

  if (!introspection) {
    return <TranslationWorkspaceNotFound />
  }

  return (
    <Box className={workspaceStyles.workspaceShell}>
      <TranslationWorkspacePageHeader />

      <div className={workspaceStyles.workspaceMainRow}>
        <div className={workspaceStyles.workspacePreviewAside}>
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
            previewApplication={previewApplication}
            activeLocale={activeLocale}
            footerSubmitScreen={footerSubmitScreen}
          />
        </div>
        <div className={workspaceStyles.workspaceNavAside}>
          <TranslationWorkspaceStatesTabsPanel
            states={introspection.states as unknown as TemplateStateNav[]}
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
            onActiveTabChange={(tab) => setFieldsTabActive(tab === 'fields')}
            onGoogleTranslate={
              activeLocale === 'en' ? handleGoogleTranslate : undefined
            }
            onGoogleTranslateAll={
              activeLocale === 'en' ? handleGoogleTranslateAll : undefined
            }
            isTranslating={translating}
          />
        </div>
      </div>

      <TranslationPublishHistory
        namespace={namespace}
        isOpen={historyOpen}
        onClose={handleCloseHistory}
        onRollbackComplete={handleRollbackComplete}
        formatMessage={formatMessage}
      />

      <ModalBase
        baseId="publishConfirmModal"
        className={workspaceStyles.publishConfirmModal}
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
