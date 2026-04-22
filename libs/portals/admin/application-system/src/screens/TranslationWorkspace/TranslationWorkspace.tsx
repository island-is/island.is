import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GridContainer, GridRow, GridColumn, toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { ApplicationSystemPaths } from '../../lib/paths'
import {
  useGetApplicationTemplateIntrospectionQuery,
  useGetApplicationTranslationsQuery,
  useBulkUpdateApplicationTranslationsMutation,
  useGetApplicationTemplateRoleFormLazyQuery,
} from '../../queries/translations.generated'
import type {
  EditedTranslations,
  ScreenIntrospection,
  SidebarNavLocation,
  TemplateSectionNav,
  TemplateStateNav,
} from '../../types/translationWorkspace'
import {
  getTranslationSaveErrorDetail,
  shortenForToast,
} from '../../utils/translationWorkspaceErrors'
import { TranslationWorkspacePageHeader } from '../../components/TranslationWorkspacePageHeader/TranslationWorkspacePageHeader'
import { TranslationWorkspacePreviewArea } from '../../components/TranslationWorkspacePreviewArea/TranslationWorkspacePreviewArea'
import { TranslationWorkspaceStatesNav } from '../../components/TranslationWorkspaceStatesNav/TranslationWorkspaceStatesNav'
import { TranslationWorkspaceStringsDrawer } from '../../components/TranslationWorkspaceStringsDrawer/TranslationWorkspaceStringsDrawer'
import {
  TranslationWorkspaceError,
  TranslationWorkspaceLoading,
  TranslationWorkspaceNotFound,
} from '../../components/TranslationWorkspaceLoadStates/TranslationWorkspaceLoadStates'

const TranslationWorkspace = () => {
  const { typeId } = useParams<{ typeId: string }>()
  const navigate = useNavigate()
  const { formatMessage } = useLocale()

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

  const persistedByKey = useMemo(() => {
    const map: Record<string, { valueIs: string; valueEn?: string | null }> = {}
    for (const row of translationsData?.applicationTranslations ?? []) {
      map[row.messageKey] = {
        valueIs: row.valueIs,
        valueEn: row.valueEn,
      }
    }
    return map
  }, [translationsData])

  const [activeLocale, setActiveLocale] = useState<'is' | 'en'>('en')
  const [selectedScreen, setSelectedScreen] =
    useState<ScreenIntrospection | null>(null)
  const [selectedLocation, setSelectedLocation] =
    useState<SidebarNavLocation | null>(null)
  const [editedValues, setEditedValues] = useState<EditedTranslations>({})
  const [stringsDrawerOpen, setStringsDrawerOpen] = useState(true)
  const [statesNavOpen, setStatesNavOpen] = useState(true)

  const getPersistedForLocale = useCallback(
    (messageKey: string) => {
      const row = persistedByKey[messageKey]
      if (!row) return ''
      return activeLocale === 'en' ? row.valueEn ?? '' : row.valueIs
    },
    [persistedByKey, activeLocale],
  )

  const resolvePreviewString = useCallback(
    (messageKey: string, defaultMessage?: string | null) => {
      if (editedValues[messageKey] !== undefined) {
        return editedValues[messageKey]
      }
      const persisted = getPersistedForLocale(messageKey)
      if (persisted !== '') {
        return persisted
      }
      return defaultMessage ?? ''
    },
    [editedValues, getPersistedForLocale],
  )

  /** Drop pending edits when switching locale so EN/IS drafts do not mix in one field. */
  useEffect(() => {
    setEditedValues({})
  }, [activeLocale])

  useEffect(() => {
    if (selectedScreen) {
      setStringsDrawerOpen(true)
    }
    // Only re-open the drawer when navigating to a different screen id.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedScreen?.id])

  useEffect(() => {
    if (!introspection) return

    const mapScreen = (screen: ScreenIntrospection) => ({
      type: screen.type,
      name: screen.id,
      label: screen.title,
    })

    const mapScreens = (screens: ScreenIntrospection[]) =>
      screens.flatMap((s) =>
        s.type === 'MULTI_FIELD' && s.children?.length
          ? s.children.map(mapScreen)
          : [mapScreen(s)],
      )

    const parsed = introspection.states.map((state) => ({
      state: state.stateKey,
      roles: state.roles.map((role) => ({
        role: role.roleId,
        form: role.form
          ? {
              sections: role.form.sections.map((section) => ({
                title: section.title ?? section.id,
                subsections: section.subSections.map((sub) => ({
                  title: sub.title ?? sub.id,
                  fields: mapScreens(sub.screens as ScreenIntrospection[]),
                })),
                fields: mapScreens(section.screens as ScreenIntrospection[]),
              })),
            }
          : null,
      })),
    }))

    console.log('[TranslationWorkspace] Parsed application structure', parsed)
  }, [introspection])

  const [bulkUpdate, { loading: saving }] =
    useBulkUpdateApplicationTranslationsMutation()

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
    if (selectedLocation.leafSourceScreenId) {
      const screen = (section.screens as ScreenIntrospection[]).find(
        (s) => s.id === selectedLocation.leafSourceScreenId,
      )
      return screen ? [screen] : []
    }
    if (selectedLocation.subsectionId) {
      const sub = section.subSections.find(
        (s) => s.id === selectedLocation.subsectionId,
      )
      return (sub?.screens ?? []) as ScreenIntrospection[]
    }
    return [
      ...(section.screens as ScreenIntrospection[]),
      ...section.subSections.flatMap(
        (s) => s.screens as ScreenIntrospection[],
      ),
    ]
  }, [selectedLocation, introspection])

  const currentDescriptors = useMemo(() => {
    if (selectedScreen) {
      const all = [...selectedScreen.messageDescriptors]
      if (selectedScreen.children) {
        for (const child of selectedScreen.children) {
          all.push(...child.messageDescriptors)
        }
      }
      return all
    }
    return introspection?.allMessageDescriptors ?? []
  }, [selectedScreen, introspection])

  const handleValueChange = useCallback((messageKey: string, value: string) => {
    setEditedValues((prev) => ({ ...prev, [messageKey]: value }))
  }, [])

  const handleSaveAll = useCallback(async () => {
    const dirtyEntries = Object.entries(editedValues).filter(
      ([messageKey, value]) => value !== getPersistedForLocale(messageKey),
    )
    if (dirtyEntries.length === 0) return

    try {
      const translationsToSave = dirtyEntries.map(([messageKey, value]) => ({
        namespace,
        messageKey,
        ...(activeLocale === 'en' ? { valueEn: value } : { valueIs: value }),
      }))

      const { data: mutationData } = await bulkUpdate({
        variables: { input: { translations: translationsToSave } },
      })

      if (
        mutationData?.bulkUpdateApplicationTranslations &&
        mutationData.bulkUpdateApplicationTranslations.length > 0
      ) {
        await refetchTranslations()
        setEditedValues({})
        toast.success(formatMessage(m.translationSave))
      } else {
        toast.error(
          formatMessage(m.translationSaveFailed, {
            detail: 'Engin gögn komu til baka frá vefþjónustu.',
          }),
        )
      }
    } catch (err) {
      const detail = getTranslationSaveErrorDetail(err)
      console.error('bulkUpdateApplicationTranslations failed', err)
      toast.error(formatMessage(m.translationSaveFailed, { detail }))
    }
  }, [
    editedValues,
    activeLocale,
    namespace,
    formatMessage,
    bulkUpdate,
    getPersistedForLocale,
    refetchTranslations,
  ])

  const hasUnsavedChanges = useMemo(
    () =>
      Object.entries(editedValues).some(
        ([k, v]) => v !== getPersistedForLocale(k),
      ),
    [editedValues, getPersistedForLocale],
  )

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

  const unsavedCount = useMemo(
    () =>
      Object.entries(editedValues).filter(
        ([k, v]) => v !== getPersistedForLocale(k),
      ).length,
    [editedValues, getPersistedForLocale],
  )

  if (loading || (introspection && translationsLoading)) {
    return <TranslationWorkspaceLoading />
  }

  const loadError = error ?? translationsError
  if (loadError) {
    return <TranslationWorkspaceError loadError={loadError} />
  }

  if (!introspection) {
    return <TranslationWorkspaceNotFound />
  }

  return (
    <GridContainer>
      <TranslationWorkspacePageHeader
        templateName={introspection.name}
        templateSlug={introspection.slug}
        formatMessage={formatMessage}
        onNavigateToTranslations={() =>
          navigate(`/stjornbord${ApplicationSystemPaths.Translations}`)
        }
        activeLocale={activeLocale}
        onLocaleChange={setActiveLocale}
        hasUnsavedChanges={hasUnsavedChanges}
        unsavedCount={unsavedCount}
        saving={saving}
        onSaveAll={handleSaveAll}
        selectedScreen={Boolean(selectedScreen)}
        stringsDrawerOpen={stringsDrawerOpen}
        onOpenStringsDrawer={() => setStringsDrawerOpen(true)}
        currentDescriptorCount={currentDescriptors.length}
      />

      <GridRow>
        <GridColumn span={statesNavOpen ? '3/12' : '1/12'}>
          <TranslationWorkspaceStatesNav
            states={introspection.states as unknown as TemplateStateNav[]}
            statesNavOpen={statesNavOpen}
            onToggleNavOpen={() => setStatesNavOpen((open) => !open)}
            selectedScreenId={selectedScreen?.id}
            onNavClick={handleSidebarNavClick}
            formatMessage={formatMessage}
          />
        </GridColumn>

        <GridColumn span={statesNavOpen ? '9/12' : '11/12'}>
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
            onSidebarNavClick={handleSidebarNavClick}
          />
        </GridColumn>
      </GridRow>

      {selectedScreen && (
        <TranslationWorkspaceStringsDrawer
          selectedScreen={selectedScreen}
          stringsDrawerOpen={stringsDrawerOpen}
          onStringsDrawerVisibilityChange={setStringsDrawerOpen}
          currentDescriptors={currentDescriptors}
          editedValues={editedValues}
          getPersistedForLocale={getPersistedForLocale}
          onValueChange={handleValueChange}
          formatMessage={formatMessage}
        />
      )}
    </GridContainer>
  )
}

export default TranslationWorkspace
