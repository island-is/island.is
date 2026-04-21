import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ApolloError, gql, useLazyQuery } from '@apollo/client'
import { findProblemInApolloError } from '@island.is/shared/problem'
import {
  Box,
  Text,
  Button,
  Breadcrumbs,
  GridContainer,
  GridRow,
  GridColumn,
  SkeletonLoader,
  Tabs,
  Input,
  Tag,
  Divider,
  AccordionItem,
  Accordion,
  toast,
  Checkbox,
  DatePicker,
  Select,
  RadioButton,
  FormStepperV2,
  Section,
} from '@island.is/island-ui/core'
import type { BoxProps } from '@island.is/island-ui/core/types'
import { useLocale } from '@island.is/localization'
import { Markdown } from '@island.is/shared/components'
import { m } from '../../lib/messages'
import { ApplicationSystemPaths } from '../../lib/paths'
import {
  useGetApplicationTemplateIntrospectionQuery,
  useGetApplicationTranslationsQuery,
  useBulkUpdateApplicationTranslationsMutation,
  useGetApplicationTemplateRoleFormLazyQuery,
} from '../../queries/translations.generated'

interface MessageDescriptor {
  id: string
  defaultMessage?: string | null
  description?: string | null
}

interface ScreenIntrospection {
  id: string
  type: string
  title: string | null
  description?: string | null
  width?: string | null
  space?: number | null
  marginTop?: unknown
  marginBottom?: unknown
  paddingTop?: unknown
  messageDescriptors: MessageDescriptor[]
  children?: ScreenIntrospection[] | null
}

/** Where in the template tree a sidebar row was clicked (for debugging / tooling). */
interface SidebarNavLocation {
  stateKey: string
  stateName: string
  roleId: string
  sectionId: string
  sectionTitle?: string | null
  subsectionId?: string
  subsectionTitle?: string | null
  leafSourceScreenId?: string
}

/** Deduped union of `messageDescriptors` on each screen (already flattened for multifields on the API). */
const mergeScreensMessageDescriptors = (
  screens: ScreenIntrospection[],
): MessageDescriptor[] => {
  const seen = new Set<string>()
  const out: MessageDescriptor[] = []
  for (const screen of screens) {
    for (const d of screen.messageDescriptors) {
      if (!seen.has(d.id)) {
        seen.add(d.id)
        out.push(d)
      }
    }
  }
  return out
}

/** One sidebar entry for a whole section (matches stepper when there are no subsections). */
const buildSectionNavigationScreen = (
  sectionId: string,
  title: string | null | undefined,
  screens: ScreenIntrospection[],
): ScreenIntrospection => ({
  id: `__navigation:section:${sectionId}`,
  type: 'SECTION_NAV_GROUP',
  title: title ?? sectionId,
  description: null,
  width: null,
  space: null,
  messageDescriptors: mergeScreensMessageDescriptors(screens),
})

/** One sidebar entry per subsection (matches stepper subsection tabs). */
const buildSubSectionNavigationScreen = (
  subSectionId: string,
  title: string | null | undefined,
  screens: ScreenIntrospection[],
): ScreenIntrospection => ({
  id: `__navigation:subsection:${subSectionId}`,
  type: 'SUBSECTION_NAV_GROUP',
  title: title ?? subSectionId,
  description: null,
  width: null,
  space: null,
  messageDescriptors: mergeScreensMessageDescriptors(screens),
})

/**
 * Section-level leaf not under a subsection (uncommon). Keeps translations for that leaf only,
 * labeled by the leaf title so the sidebar stays usable if both patterns appear in one section.
 */
const buildSectionLeafNavigationScreen = (
  sectionId: string,
  screen: ScreenIntrospection,
): ScreenIntrospection => ({
  id: `__navigation:sectionLeaf:${sectionId}:${screen.id}`,
  type: 'SECTION_LEAF_NAV_GROUP',
  title: screen.title ?? screen.id,
  description: null,
  width: null,
  space: null,
  messageDescriptors: mergeScreensMessageDescriptors([screen]),
})

const AI_TRANSLATE_QUERY = gql`
  query aiTranslateStrings(
    $namespace: String!
    $messageKeys: [String!]!
    $sourceLocale: String!
    $targetLocale: String!
  ) {
    aiTranslateStrings(
      namespace: $namespace
      messageKeys: $messageKeys
      sourceLocale: $sourceLocale
      targetLocale: $targetLocale
    ) {
      translations
    }
  }
`

type EditedTranslations = Record<string, string>

/** Toasts should not show multi-line stack traces or huge Sequelize messages. */
const TOAST_ERROR_MAX_LENGTH = 240

const shortenForToast = (text: string): string => {
  const firstLine = text.trim().split(/\r?\n/)[0] ?? ''
  if (firstLine.length <= TOAST_ERROR_MAX_LENGTH) {
    return firstLine
  }
  return `${firstLine.slice(0, TOAST_ERROR_MAX_LENGTH)}…`
}

/** Sidebar label for a template role's form (accordion). */
const getRoleFormAccordionLabel = (roleId: string): string => {
  switch (roleId.toLowerCase()) {
    case 'applicant':
      return 'Applicant form'
    case 'delegate':
      return 'Delegate form'
    default: {
      const rest = roleId.slice(1)
      const initial = roleId.charAt(0).toUpperCase()
      return `${initial}${rest} form`
    }
  }
}

const getTranslationSaveErrorDetail = (err: unknown): string => {
  let raw = ''
  if (err instanceof ApolloError) {
    const problem = findProblemInApolloError(err)
    if (problem?.detail) {
      raw = problem.detail
    } else if (err.graphQLErrors?.length) {
      raw = err.graphQLErrors.map((e) => e.message).join('; ')
    } else if (err.networkError) {
      raw = err.networkError.message
    }
  }
  if (!raw && err instanceof Error) {
    raw = err.message
  }
  if (!raw) {
    raw = String(err)
  }
  return shortenForToast(raw)
}

const INPUT_FIELD_TYPES = new Set([
  'TEXT',
  'PHONE',
  'EMAIL',
  'NATIONAL_ID_WITH_NAME',
  'BANK_ACCOUNT',
  'COMPANY_SEARCH',
  'ASYNC_SELECT',
  'COPY_LINK',
  'HIDDEN_INPUT',
  'HIDDEN_INPUT_WITH_WATCHED_VALUE',
  'FIND_VEHICLE',
  'VEHICLE_PERMNO_WITH_INFO',
])

const TEXT_DISPLAY_TYPES = new Set([
  'DESCRIPTION',
  'TITLE',
  'ALERT_MESSAGE',
  'EXPANDABLE_DESCRIPTION',
  'LINK',
  'MESSAGE_WITH_LINK_BUTTON_FIELD',
  'INFORMATION_CARD',
  'DISPLAY',
  'ACCORDION',
])

const PLACEHOLDER_TYPES = new Set([
  'KEY_VALUE',
  'STATIC_TABLE',
  'TABLE_REPEATER',
  'FIELDS_REPEATER',
  'PAGINATED_SEARCHABLE_TABLE',
  'ACTION_CARD_LIST',
  'SLIDER',
  'IMAGE',
  'PDF_LINK_BUTTON',
  'OVERVIEW',
])

const noop = () => {
  /* intentionally empty */
}

const HALF_WIDTH_IGNORED_TYPES = new Set(['RADIO', 'CHECKBOX'])

/** Matches `*FormField` wrappers that pass `marginTop` / `marginBottom` / `space` → `paddingTop`. */
const fieldPreviewLayoutProps = (
  screen: ScreenIntrospection,
): Pick<BoxProps, 'marginTop' | 'marginBottom' | 'paddingTop'> => {
  const props: Pick<BoxProps, 'marginTop' | 'marginBottom' | 'paddingTop'> = {}
  if (screen.marginTop != null) {
    props.marginTop = screen.marginTop as BoxProps['marginTop']
  }
  if (screen.marginBottom != null) {
    props.marginBottom = screen.marginBottom as BoxProps['marginBottom']
  }
  if (screen.paddingTop != null) {
    props.paddingTop = screen.paddingTop as BoxProps['paddingTop']
  }
  return props
}

type ResolvePreviewString = (
  messageKey: string,
  defaultMessage?: string | null,
) => string

/**
 * Introspection copies default language strings into `title` / `description` while
 * `messageDescriptors` holds the real message ids. Match on defaultMessage so labels
 * and headings use the same strings as the translation editor (including live edits).
 */
const resolveTranslatableStaticText = (
  staticText: string | null | undefined,
  descriptors: MessageDescriptor[],
  resolvePreviewString: ResolvePreviewString,
): string => {
  if (staticText == null || staticText === '') {
    return ''
  }
  const match = descriptors.find((d) => d.defaultMessage === staticText)
  if (match) {
    return resolvePreviewString(match.id, match.defaultMessage)
  }
  return staticText
}

const resolvePreviewLabel = (
  screen: ScreenIntrospection,
  resolvePreviewString: ResolvePreviewString,
): string => {
  if (screen.title != null && screen.title !== '') {
    return resolveTranslatableStaticText(
      screen.title,
      screen.messageDescriptors,
      resolvePreviewString,
    )
  }
  if (screen.description != null && screen.description !== '') {
    return resolveTranslatableStaticText(
      screen.description,
      screen.messageDescriptors,
      resolvePreviewString,
    )
  }
  return screen.id
}

const MARKDOWN_MESSAGE_ID_SUFFIX = '#markdown'

const isMarkdownMessageId = (messageId: string) =>
  messageId.endsWith(MARKDOWN_MESSAGE_ID_SUFFIX)

/**
 * Preview copy for static/read-only field types. Uses the same message keys as
 * the translation editor so description-only fields (no title) don't fall back
 * to the field id, and pending/persisted strings show in the preview.
 * Message ids ending with `#markdown` render like production description fields.
 */
const renderTextDisplayPreviewNodes = (
  screen: ScreenIntrospection,
  resolvePreviewString: ResolvePreviewString,
): ReactNode => {
  if (screen.messageDescriptors.length > 0) {
    const resolvedParts = screen.messageDescriptors
      .map((d) => ({
        id: d.id,
        text: resolvePreviewString(d.id, d.defaultMessage).trim(),
      }))
      .filter((p) => p.text.length > 0)

    if (resolvedParts.length > 0) {
      return (
        <Box>
          {resolvedParts.map((p, i) =>
            isMarkdownMessageId(p.id) ? (
              <Box key={p.id} marginTop={i > 0 ? 2 : 0}>
                <Markdown>{p.text}</Markdown>
              </Box>
            ) : (
              <Text
                key={p.id}
                as="div"
                whiteSpace="preLine"
                marginTop={i > 0 ? 2 : 0}
              >
                {p.text}
              </Text>
            ),
          )}
        </Box>
      )
    }
  }
  const fallback = screen.title ?? screen.description ?? screen.id
  return (
    <Text as="div" whiteSpace="preLine">
      {fallback}
    </Text>
  )
}

/** Renders a single leaf field as an island-ui preview component. */
const renderLeafFieldPreview = (
  screen: ScreenIntrospection,
  resolvePreviewString: ResolvePreviewString,
): JSX.Element => {
  const label = resolvePreviewLabel(screen, resolvePreviewString)
  const key = screen.id
  const layout = fieldPreviewLayoutProps(screen)

  if (screen.type === 'EXTERNAL_DATA_PROVIDER') {
    return (
      <Box
        key={key}
        marginBottom={2}
        padding={3}
        border="standard"
        borderRadius="large"
        background="white"
        {...layout}
      >
        <Text variant="small" color="dark300">
          External data provider
        </Text>
        <Text variant="h5">{label}</Text>
      </Box>
    )
  }

  if (INPUT_FIELD_TYPES.has(screen.type)) {
    return (
      <Box key={key} {...layout}>
        <Input label={label} name={key} placeholder={label} disabled />
      </Box>
    )
  }

  if (screen.type === 'CHECKBOX') {
    return (
      <Box key={key} {...layout}>
        <Checkbox label={label} name={key} onChange={noop} />
      </Box>
    )
  }

  if (screen.type === 'DATE') {
    return (
      <Box key={key} {...layout}>
        <DatePicker
          label={label}
          placeholderText="dd.mm.yyyy"
          handleChange={noop}
        />
      </Box>
    )
  }

  if (
    screen.type === 'SELECT' ||
    screen.type === 'VEHICLE_SELECT' ||
    screen.type === 'VEHICLE_RADIO'
  ) {
    return (
      <Box key={key} {...layout}>
        <Select label={label} name={key} options={[]} isDisabled />
      </Box>
    )
  }

  if (screen.type === 'RADIO') {
    return (
      <Box key={key} {...layout}>
        <Text variant="small" fontWeight="semiBold" marginBottom={1}>
          {label}
        </Text>
        <Box display="flex" flexDirection="column" rowGap={1}>
          <RadioButton label="Option 1" name={key} value="1" onChange={noop} />
          <RadioButton label="Option 2" name={key} value="2" onChange={noop} />
        </Box>
      </Box>
    )
  }

  if (screen.type === 'FILEUPLOAD') {
    return (
      <Box
        key={key}
        padding={3}
        border="standard"
        borderRadius="large"
        background="white"
        style={{ borderStyle: 'dashed' }}
        {...layout}
      >
        <Text variant="small" color="dark300">
          {label}
        </Text>
        <Text variant="small" color="blue400">
          Upload file
        </Text>
      </Box>
    )
  }

  if (TEXT_DISPLAY_TYPES.has(screen.type)) {
    return (
      <Box key={key} {...layout}>
        {renderTextDisplayPreviewNodes(screen, resolvePreviewString)}
      </Box>
    )
  }

  if (screen.type === 'DIVIDER') {
    return (
      <Box key={key} {...layout}>
        <Divider />
      </Box>
    )
  }

  if (screen.type === 'SUBMIT') {
    return (
      <Box key={key} {...layout}>
        <Button size="small">{label}</Button>
      </Box>
    )
  }

  if (PLACEHOLDER_TYPES.has(screen.type)) {
    return (
      <Box
        key={key}
        padding={2}
        border="standard"
        borderRadius="standard"
        background="white"
        {...layout}
      >
        <Text variant="eyebrow" color="dark300">
          {screen.type}
        </Text>
        <Text variant="small">{label}</Text>
      </Box>
    )
  }

  return (
    <Box
      key={key}
      padding={2}
      border="standard"
      borderRadius="standard"
      background="white"
      {...layout}
    >
      <Text variant="eyebrow" color="dark300">
        {screen.type}
      </Text>
      <Text variant="small">{label}</Text>
    </Box>
  )
}

/**
 * Renders a screen matching the real application form layout.
 * MULTI_FIELD screens use GridRow/GridColumn with width-based spans.
 */
const renderFieldPreview = (
  screen: ScreenIntrospection,
  resolvePreviewString: ResolvePreviewString,
): JSX.Element => {
  if (screen.type === 'MULTI_FIELD') {
    const space = (screen.space ?? 0) as 0 | 1 | 2 | 3 | 4 | 5 | 6
    return (
      <Box key={screen.id}>
        {screen.description && (
          <Box marginBottom={3}>
            <Text color="dark400">
              {resolveTranslatableStaticText(
                screen.description,
                screen.messageDescriptors,
                resolvePreviewString,
              )}
            </Text>
          </Box>
        )}
        <Box width="full" marginTop={screen.description ? 3 : 4} />
        <GridRow>
          {screen.children?.map((child, index) => {
            const isHalfColumn =
              !HALF_WIDTH_IGNORED_TYPES.has(child.type) &&
              child.width === 'half'
            const span = isHalfColumn ? '1/2' : '1/1'
            const isLast = index === (screen.children?.length ?? 0) - 1
            return (
              <GridColumn
                key={child.id || index}
                span={['1/1', '1/1', '1/1', span]}
                paddingBottom={isLast ? 0 : space}
              >
                <Box>
                  {renderLeafFieldPreview(child, resolvePreviewString)}
                </Box>
              </GridColumn>
            )
          })}
        </GridRow>
      </Box>
    )
  }

  return renderLeafFieldPreview(screen, resolvePreviewString)
}

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

  const [fetchAiTranslation, { loading: aiTranslating }] =
    useLazyQuery(AI_TRANSLATE_QUERY)

  const [fetchRoleForm] = useGetApplicationTemplateRoleFormLazyQuery()

  const allScreens = useMemo(() => {
    if (!introspection) return []
    const screens: ScreenIntrospection[] = []
    for (const state of introspection.states) {
      for (const role of state.roles) {
        if (role.form) {
          for (const section of role.form.sections) {
            screens.push(...(section.screens as ScreenIntrospection[]))
            for (const subSection of section.subSections) {
              screens.push(...(subSection.screens as ScreenIntrospection[]))
            }
          }
        }
      }
    }
    return screens
  }, [introspection])

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
    () => activeForm?.sections ?? [],
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

  const handleAiTranslate = useCallback(async () => {
    const descriptorsToTranslate = currentDescriptors.filter((d) => {
      if (activeLocale !== 'en') return false
      const hasPending = editedValues[d.id] !== undefined
      const hasEn = (persistedByKey[d.id]?.valueEn ?? '').trim().length > 0
      return !hasPending && !hasEn
    })

    if (descriptorsToTranslate.length === 0) {
      toast.info('No untranslated strings to translate')
      return
    }

    try {
      const namespace = introspection?.translationNamespaces[0] ?? typeId ?? ''

      const { data: aiData } = await fetchAiTranslation({
        variables: {
          namespace,
          messageKeys: descriptorsToTranslate.map((d) => d.id),
          sourceLocale: 'is',
          targetLocale: 'en',
        },
      })

      const translations = aiData?.aiTranslateStrings?.translations ?? {}
      setEditedValues((prev) => ({ ...prev, ...translations }))
      toast.success(
        `AI suggested ${Object.keys(translations).length} translations`,
      )
    } catch {
      toast.error('AI translation failed')
    }
  }, [
    currentDescriptors,
    editedValues,
    activeLocale,
    introspection,
    persistedByKey,
    typeId,
    fetchAiTranslation,
  ])

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
    return (
      <GridContainer>
        <Box marginTop={4}>
          <SkeletonLoader height={400} />
        </Box>
      </GridContainer>
    )
  }

  const loadError = error ?? translationsError
  if (loadError) {
    const fromGraphQl = loadError.graphQLErrors
      ?.map((e) => e.message)
      .filter(Boolean)
      .join('\n')
    const fromNetwork =
      loadError.networkError instanceof Error
        ? loadError.networkError.message
        : loadError.networkError
        ? String(loadError.networkError)
        : ''
    const detailMessage =
      fromGraphQl || fromNetwork || loadError.message || 'Unknown error'

    return (
      <GridContainer>
        <Box marginTop={4}>
          <Text variant="h4" color="red600">
            Error loading template
          </Text>
          <Text marginTop={1} whiteSpace="preLine">
            {detailMessage}
          </Text>
        </Box>
      </GridContainer>
    )
  }

  if (!introspection) {
    return (
      <GridContainer>
        <Box marginTop={4}>
          <Text>Template not found</Text>
        </Box>
      </GridContainer>
    )
  }

  return (
    <GridContainer>
      <Breadcrumbs
        items={[
          { title: 'Ísland.is', href: '/stjornbord' },
          {
            title: formatMessage(m.applicationSystem),
            href: `/stjornbord${ApplicationSystemPaths.Root}`,
          },
          {
            title: formatMessage(m.translations),
            href: `/stjornbord${ApplicationSystemPaths.Translations}`,
          },
          { title: introspection.name },
        ]}
      />

      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        marginTop={3}
        marginBottom={3}
      >
        <Box display="flex" alignItems="center" columnGap={2}>
          <Button
            variant="ghost"
            size="small"
            onClick={() =>
              navigate(`/stjornbord${ApplicationSystemPaths.Translations}`)
            }
          >
            {formatMessage(m.translationBackToList)}
          </Button>
          <Text variant="h3">{introspection.name}</Text>
          <Tag variant="blue">{introspection.slug}</Tag>
        </Box>

        <Box display="flex" columnGap={2}>
          {/* This functionality has to be implemented later */}
          {/* {activeLocale === 'en' && (
            <Button
              variant="ghost"
              size="small"
              loading={aiTranslating}
              onClick={handleAiTranslate}
            >
              {formatMessage(
                selectedScreen
                  ? m.translationAiTranslateScreen
                  : m.translationAiTranslateAll,
              )}
            </Button>
          )} */}
          <Tabs
            label="Language"
            contentBackground="white"
            selected={activeLocale}
            tabs={[
              { id: 'is', label: 'IS', content: <></> },
              { id: 'en', label: 'EN', content: <></> },
            ]}
            onChange={(id: string) => setActiveLocale(id as 'is' | 'en')}
          />
          {hasUnsavedChanges && (
            <Button size="small" loading={saving} onClick={handleSaveAll}>
              {formatMessage(m.translationSaveAll)} ({unsavedCount})
            </Button>
          )}
        </Box>
      </Box>

      <GridRow>
        <GridColumn span="3/12">
          <Box
            background="white"
            borderRadius="large"
            padding={2}
            style={{ maxHeight: '75vh', overflow: 'auto' }}
          >
            <Box marginTop={2}>
              <Text variant="h3" marginBottom={2}>
                States
              </Text>
              <Accordion singleExpand={false}>
                {introspection.states.map((state) => (
                  <AccordionItem
                    key={state.stateKey}
                    id={state.stateKey}
                    label={`${state.stateName}`}
                  >
                    <Box paddingLeft={2}>
                      <Accordion singleExpand={false}>
                        {state.roles.map((role) => (
                          <AccordionItem
                            key={`${state.stateKey}-${role.roleId}`}
                            id={`${state.stateKey}-${role.roleId}`}
                            label={getRoleFormAccordionLabel(role.roleId)}
                            labelVariant="medium"
                            labelUse="div"
                            iconVariant="small"
                          >
                            {role.form?.sections.map((section) => {
                              const screens =
                                section.screens as ScreenIntrospection[]
                              const { subSections } = section

                              if (
                                subSections.length === 0 &&
                                screens.length === 0
                              ) {
                                return null
                              }

                              const navRow = (
                                nav: ScreenIntrospection,
                                key: string,
                                location: SidebarNavLocation,
                                labelWeight?: 'semiBold',
                              ) => (
                                <Box
                                  key={key}
                                  marginLeft={2}
                                  marginTop={1}
                                  cursor="pointer"
                                  onClick={() =>
                                    handleSidebarNavClick(nav, location)
                                  }
                                  background={
                                    selectedScreen?.id === nav.id
                                      ? 'blue100'
                                      : undefined
                                  }
                                  borderRadius="standard"
                                  padding={1}
                                >
                                  <Text
                                    variant="small"
                                    fontWeight={labelWeight}
                                  >
                                    {nav.title}
                                  </Text>
                                </Box>
                              )

                              if (subSections.length === 0) {
                                const nav = buildSectionNavigationScreen(
                                  section.id,
                                  section.title,
                                  screens,
                                )
                                return (
                                  <Box key={section.id} marginBottom={1}>
                                    {navRow(
                                      nav,
                                      section.id,
                                      {
                                        stateKey: state.stateKey,
                                        stateName: state.stateName,
                                        roleId: role.roleId,
                                        sectionId: section.id,
                                        sectionTitle: section.title,
                                      },
                                      'semiBold',
                                    )}
                                  </Box>
                                )
                              }

                              return (
                                <Box key={section.id} marginBottom={1}>
                                  <Text variant="small" fontWeight="semiBold">
                                    {section.title ?? section.id}
                                  </Text>
                                  {subSections.map((sub) => {
                                    const subScreens =
                                      sub.screens as ScreenIntrospection[]
                                    if (subScreens.length === 0) {
                                      return null
                                    }
                                    const nav = buildSubSectionNavigationScreen(
                                      sub.id,
                                      sub.title,
                                      subScreens,
                                    )
                                    return navRow(nav, sub.id, {
                                      stateKey: state.stateKey,
                                      stateName: state.stateName,
                                      roleId: role.roleId,
                                      sectionId: section.id,
                                      sectionTitle: section.title,
                                      subsectionId: sub.id,
                                      subsectionTitle: sub.title,
                                    })
                                  })}
                                  {screens.map((screen) => {
                                    const nav =
                                      buildSectionLeafNavigationScreen(
                                        section.id,
                                        screen,
                                      )
                                    return navRow(nav, screen.id, {
                                      stateKey: state.stateKey,
                                      stateName: state.stateName,
                                      roleId: role.roleId,
                                      sectionId: section.id,
                                      sectionTitle: section.title,
                                      leafSourceScreenId: screen.id,
                                    })
                                  })}
                                </Box>
                              )
                            })}
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </Box>
                  </AccordionItem>
                ))}
              </Accordion>
            </Box>
          </Box>
        </GridColumn>

        <GridColumn span="9/12">
          {previewScreens.length > 0 ? (
            <GridRow>
              <GridColumn span={['12/12', '12/12', '9/12', '9/12']}>
                <Box
                  paddingTop={[3, 6, 10]}
                  height="full"
                  borderRadius="large"
                  background="white"
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="spaceBetween"
                    height="full"
                  >
                    <GridColumn
                      span={['12/12', '12/12', '10/12', '7/9']}
                      offset={['0', '0', '1/12', '1/9']}
                    >
                      <Text variant="h2" as="h2" marginBottom={1}>
                        {previewScreens[0]
                          ? resolveTranslatableStaticText(
                              previewScreens[0].title,
                              previewScreens[0].messageDescriptors,
                              resolvePreviewString,
                            )
                          : ''}
                      </Text>
                      {previewScreens.map((screen) =>
                        renderFieldPreview(
                          screen as ScreenIntrospection,
                          resolvePreviewString,
                        ),
                      )}
                    </GridColumn>

                    <Box
                      paddingX={[3, 5, 12]}
                      paddingBottom={5}
                      paddingTop={3}
                      display="flex"
                      justifyContent="flexEnd"
                    >
                      <Button icon="arrowForward">Halda áfram</Button>
                    </Box>
                  </Box>
                </Box>
              </GridColumn>

              <GridColumn span={['12/12', '12/12', '3/12', '3/12']}>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="spaceBetween"
                  height="full"
                  paddingTop={[0, 0, 8]}
                  paddingLeft={[0, 0, 0, 4]}
                >
                  <FormStepperV2
                    sections={[
                      <Box
                        marginLeft={1}
                        key="stepper-title"
                        paddingBottom={[0, 0, 4]}
                      >
                        <Text variant="h4">
                          {activeFormTitle ?? introspection.name}
                        </Text>
                      </Box>,
                      ...activeSections.map((section, i) => (
                        <Box
                          key={section.id}
                          cursor="pointer"
                          onClick={() => {
                            const sectionData = section
                            const screens =
                              sectionData.screens as ScreenIntrospection[]
                            const firstSubSection = sectionData.subSections[0]
                            const location: SidebarNavLocation = {
                              stateKey: activeStateKey,
                              stateName: activeStateName,
                              roleId: activeRoleId,
                              sectionId: section.id,
                              sectionTitle: section.title,
                              ...(firstSubSection
                                ? {
                                    subsectionId: firstSubSection.id,
                                    subsectionTitle: firstSubSection.title,
                                  }
                                : {}),
                            }
                            const navScreens = firstSubSection
                              ? (firstSubSection.screens as ScreenIntrospection[])
                              : screens
                            const nav = firstSubSection
                              ? buildSubSectionNavigationScreen(
                                  firstSubSection.id,
                                  firstSubSection.title,
                                  navScreens,
                                )
                              : buildSectionNavigationScreen(
                                  section.id,
                                  section.title,
                                  navScreens,
                                )
                            handleSidebarNavClick(nav, location)
                          }}
                        >
                          <Section
                            section={section.title ?? section.id}
                            sectionIndex={i}
                            isActive={
                              selectedLocation?.sectionId === section.id
                            }
                            isComplete={
                              activeSections.findIndex(
                                (s) => s.id === selectedLocation?.sectionId,
                              ) > i
                            }
                            subSections={
                              section.subSections.length > 1
                                ? section.subSections.map((sub) => (
                                    <Box
                                      key={sub.id}
                                      cursor="pointer"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        const subScreens =
                                          sub.screens as ScreenIntrospection[]
                                        if (subScreens.length === 0) return
                                        const nav =
                                          buildSubSectionNavigationScreen(
                                            sub.id,
                                            sub.title,
                                            subScreens,
                                          )
                                        handleSidebarNavClick(nav, {
                                          stateKey: activeStateKey,
                                          stateName: activeStateName,
                                          roleId: activeRoleId,
                                          sectionId: section.id,
                                          sectionTitle: section.title,
                                          subsectionId: sub.id,
                                          subsectionTitle: sub.title,
                                        })
                                      }}
                                    >
                                      <Text
                                        variant="medium"
                                        fontWeight={
                                          selectedLocation?.subsectionId ===
                                          sub.id
                                            ? 'semiBold'
                                            : 'regular'
                                        }
                                      >
                                        {sub.title ?? sub.id}
                                      </Text>
                                    </Box>
                                  ))
                                : undefined
                            }
                          />
                        </Box>
                      )),
                    ]}
                  />
                </Box>
              </GridColumn>
            </GridRow>
          ) : (
            <Box
              paddingTop={[3, 6, 10]}
              borderRadius="large"
              background="white"
              padding={[3, 5, 8]}
            >
              <Text color="dark300">
                Select a section from the sidebar to preview.
              </Text>
            </Box>
          )}
        </GridColumn>
      </GridRow>

      {selectedScreen && (
        <Box marginTop={4}>
          <Box background="white" borderRadius="large" padding={3}>
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
              marginBottom={3}
            >
              <Text variant="h4">
                {selectedScreen.title ?? selectedScreen.id}
              </Text>
              <Text variant="small" color="dark300">
                {currentDescriptors.length} strings
              </Text>
            </Box>

            <Divider />

            <Box marginTop={3}>
              {currentDescriptors.map((descriptor) => {
                const currentValue =
                  editedValues[descriptor.id] ??
                  getPersistedForLocale(descriptor.id)
                const isDirty =
                  editedValues[descriptor.id] !== undefined &&
                  editedValues[descriptor.id] !==
                    getPersistedForLocale(descriptor.id)

                return (
                  <Box
                    key={descriptor.id}
                    marginBottom={3}
                    padding={2}
                    borderRadius="standard"
                    border={isDirty ? 'focus' : 'standard'}
                  >
                    <Box
                      display="flex"
                      justifyContent="spaceBetween"
                      marginBottom={1}
                    >
                      <Text variant="eyebrow" color="dark300">
                        {descriptor.id}
                      </Text>
                      {isDirty && (
                        <Tag variant="blueberry" outlined>
                          Unsaved
                        </Tag>
                      )}
                    </Box>

                    <Box marginBottom={1}>
                      <Text variant="small" color="dark400">
                        Default: {descriptor.defaultMessage ?? '—'}
                      </Text>
                    </Box>

                    <Input
                      name={`translation-${descriptor.id}`}
                      size="sm"
                      value={currentValue}
                      onChange={(e) =>
                        handleValueChange(descriptor.id, e.target.value)
                      }
                      textarea={(descriptor.defaultMessage?.length ?? 0) > 80}
                      rows={3}
                    />
                  </Box>
                )
              })}

              {currentDescriptors.length === 0 && (
                <Box marginTop={3}>
                  <Text color="dark300">
                    No translatable strings found for this screen.
                  </Text>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </GridContainer>
  )
}

export default TranslationWorkspace
