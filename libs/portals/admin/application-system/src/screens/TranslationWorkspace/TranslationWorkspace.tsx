import { useCallback, useEffect, useMemo, useState } from 'react'
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
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { ApplicationSystemPaths } from '../../lib/paths'
import {
  useGetApplicationTemplateIntrospectionQuery,
  useGetApplicationTranslationsQuery,
  useBulkUpdateApplicationTranslationsMutation,
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
  messageDescriptors: MessageDescriptor[]
  children?: ScreenIntrospection[] | null
}

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
    const map: Record<
      string,
      { valueIs: string; valueEn?: string | null }
    > = {}
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
  const [editedValues, setEditedValues] = useState<EditedTranslations>({})

  const getPersistedForLocale = useCallback(
    (messageKey: string) => {
      const row = persistedByKey[messageKey]
      if (!row) return ''
      return activeLocale === 'en'
        ? (row.valueEn ?? '')
        : row.valueIs
    },
    [persistedByKey, activeLocale],
  )

  /** Drop pending edits when switching locale so EN/IS drafts do not mix in one field. */
  useEffect(() => {
    setEditedValues({})
  }, [activeLocale])

  const [bulkUpdate, { loading: saving }] =
    useBulkUpdateApplicationTranslationsMutation()

  const [fetchAiTranslation, { loading: aiTranslating }] =
    useLazyQuery(AI_TRANSLATE_QUERY)

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

  const handleValueChange = useCallback(
    (messageKey: string, value: string) => {
      setEditedValues((prev) => ({ ...prev, [messageKey]: value }))
    },
    [],
  )

  const handleAiTranslate = useCallback(async () => {
    const descriptorsToTranslate = currentDescriptors.filter((d) => {
      if (activeLocale !== 'en') return false
      const hasPending = editedValues[d.id] !== undefined
      const hasEn =
        (persistedByKey[d.id]?.valueEn ?? '').trim().length > 0
      return !hasPending && !hasEn
    })

    if (descriptorsToTranslate.length === 0) {
      toast.info('No untranslated strings to translate')
      return
    }

    try {
      const namespace =
        introspection?.translationNamespaces[0] ?? typeId ?? ''

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
      const translationsToSave = dirtyEntries.map(
        ([messageKey, value]) => ({
          namespace,
          messageKey,
          ...(activeLocale === 'en' ? { valueEn: value } : { valueIs: value }),
        }),
      )

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

  if (error || translationsError) {
    const err = error ?? translationsError
    const fromGraphQl = err.graphQLErrors
      ?.map((e) => e.message)
      .filter(Boolean)
      .join('\n')
    const fromNetwork =
      err.networkError instanceof Error
        ? err.networkError.message
        : err.networkError
          ? String(err.networkError)
          : ''
    const detailMessage =
      fromGraphQl || fromNetwork || err.message || 'Unknown error'

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
          <Tabs
            label="Language"
            contentBackground="white"
            selected={activeLocale}
            tabs={[
              { id: 'is', label: 'IS', content: <></> },
              { id: 'en', label: 'EN', content: <></> },
            ]}
            onChange={(id: string) =>
              setActiveLocale(id as 'is' | 'en')
            }
          />
          {activeLocale === 'en' && (
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
          )}
          {hasUnsavedChanges && (
            <Button
              size="small"
              loading={saving}
              onClick={handleSaveAll}
            >
              {formatMessage(m.translationSaveAll)} (
              {unsavedCount})
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
            <Text variant="h5" marginBottom={2}>
              Screens
            </Text>
            <Button
              variant={selectedScreen === null ? 'primary' : 'ghost'}
              size="small"
              onClick={() => setSelectedScreen(null)}
            >
              All strings
            </Button>
            <Box marginTop={2}>
              <Accordion singleExpand={false}>
                {introspection.states.map((state) => (
                  <AccordionItem
                    key={state.stateKey}
                    id={state.stateKey}
                    label={`${state.stateName} (${state.status})`}
                  >
                    {state.roles.map((role) => (
                      <Box key={role.roleId} marginBottom={2}>
                        <Text variant="eyebrow" marginBottom={1}>
                          {role.roleId}
                        </Text>
                        {role.form?.sections.map((section) => (
                          <Box key={section.id} marginLeft={2} marginBottom={1}>
                            <Text variant="small" fontWeight="semiBold">
                              {section.title ?? section.id}
                            </Text>
                            {section.screens.map((screen) => (
                              <Box
                                key={screen.id}
                                marginLeft={2}
                                cursor="pointer"
                                onClick={() => setSelectedScreen(screen as ScreenIntrospection)}
                                background={
                                  selectedScreen?.id === screen.id
                                    ? 'blue100'
                                    : undefined
                                }
                                borderRadius="standard"
                                padding={1}
                              >
                                <Text variant="small">
                                  {screen.title ?? screen.id}
                                </Text>
                              </Box>
                            ))}
                            {section.subSections.map((sub) => (
                              <Box key={sub.id} marginLeft={2}>
                                <Text variant="small" color="dark300">
                                  {sub.title ?? sub.id}
                                </Text>
                                {sub.screens.map((screen) => (
                                  <Box
                                    key={screen.id}
                                    marginLeft={2}
                                    cursor="pointer"
                                    onClick={() => setSelectedScreen(screen as ScreenIntrospection)}
                                    background={
                                      selectedScreen?.id === screen.id
                                        ? 'blue100'
                                        : undefined
                                    }
                                    borderRadius="standard"
                                    padding={1}
                                  >
                                    <Text variant="small">
                                      {screen.title ?? screen.id}
                                    </Text>
                                  </Box>
                                ))}
                              </Box>
                            ))}
                          </Box>
                        ))}
                      </Box>
                    ))}
                  </AccordionItem>
                ))}
              </Accordion>
            </Box>
          </Box>
        </GridColumn>

        <GridColumn span="9/12">
          <Box background="white" borderRadius="large" padding={3}>
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
              marginBottom={3}
            >
              <Text variant="h4">
                {selectedScreen
                  ? selectedScreen.title ?? selectedScreen.id
                  : 'All translatable strings'}
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
                      textarea={
                        (descriptor.defaultMessage?.length ?? 0) > 80
                      }
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
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default TranslationWorkspace
