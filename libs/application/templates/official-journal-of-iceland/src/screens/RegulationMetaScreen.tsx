import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useLocale } from '@island.is/localization'
import { FormScreen } from '../components/form/FormScreen'
import { regulation } from '../lib/messages'
import { OJOIFieldBaseProps } from '../lib/types'
import {
  Box,
  DatePicker,
  Icon,
  Inline,
  Option,
  Select,
  Stack,
  Tag,
} from '@island.is/island-ui/core'
import { FormGroup } from '../components/form/FormGroup'
import { useLawChapters } from '../hooks/useLawChapters'
import { useRegulationDraft } from '../hooks/useRegulationDraft'
import { useLazyQuery, useMutation } from '@apollo/client'
import {
  REGULATION_FROM_API_QUERY,
  UPDATE_DRAFT_REGULATION_MUTATION,
} from '../graphql/queries'
import type { Regulation, LawChapter } from '@island.is/regulations'

export const RegulationMetaScreen = (props: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  const { application } = props

  const {
    draftId,
    draftData,
    draftLoaded: _draftLoaded,
    loadDraft,
    saveDraft,
    updateDraftField,
  } = useRegulationDraft({
    applicationId: application.id,
    answers: application.answers as unknown as Record<string, unknown>,
  })

  const isAmending =
    application.answers?.applicationType === 'amending_regulation'

  const [fetchRegulation] = useLazyQuery<{
    OJOIAGetRegulationFromApi: Regulation | null
  }>(REGULATION_FROM_API_QUERY, { fetchPolicy: 'no-cache' })
  const [updateDraftMut] = useMutation(UPDATE_DRAFT_REGULATION_MUTATION)

  // Load regulation-specific fields from DB on mount.
  // For amending regulations, also pre-select law chapters from
  // the impacted base regulations (set in the impacts screen).
  const loadRef = useRef(false)
  useEffect(() => {
    if (loadRef.current || !draftId) return
    loadRef.current = true

    const init = async () => {
      const raw = await loadDraft()
      if (!isAmending || !raw) return

      // Extract unique regulation names from impacts
      const impactsObj = (raw as Record<string, unknown>).impacts as
        | Record<string, Array<Record<string, unknown>>>
        | undefined
      if (!impactsObj || typeof impactsObj !== 'object') return

      const regNames = new Set<string>()
      for (const impactList of Object.values(impactsObj)) {
        if (!Array.isArray(impactList)) continue
        for (const impact of impactList) {
          const name = String(impact.name ?? '')
          if (name && name !== 'self') regNames.add(name)
        }
      }
      if (regNames.size === 0) return

      // Existing law chapter slugs already in the draft
      const existingChapters = (
        (raw as Record<string, unknown>).lawChapters ?? []
      ) as Array<string | { slug: string; name: string }>
      const existingSlugs = new Set(
        existingChapters.map((ch) =>
          typeof ch === 'string' ? ch : ch.slug,
        ),
      )

      // Fetch law chapters from each impacted regulation
      const results = await Promise.all(
        Array.from(regNames).map((name) =>
          fetchRegulation({
            variables: { input: { regulation: name } },
          }),
        ),
      )

      const newChapters: Array<{ slug: string; name: string }> = []
      for (const result of results) {
        const reg = result.data
          ?.OJOIAGetRegulationFromApi as Regulation | null
        if (!reg?.lawChapters) continue
        for (const ch of reg.lawChapters as LawChapter[]) {
          if (!existingSlugs.has(ch.slug)) {
            existingSlugs.add(ch.slug)
            newChapters.push({ slug: ch.slug, name: ch.name })
          }
        }
      }

      if (newChapters.length === 0) return

      // Persist merged law chapters to DB
      const rawObj = raw as Record<string, unknown>
      const mergedSlugs = [
        ...existingChapters.map((ch) =>
          typeof ch === 'string' ? ch : ch.slug,
        ),
        ...newChapters.map((ch) => ch.slug),
      ]

      await updateDraftMut({
        variables: {
          input: {
            draftId,
            title: rawObj.title ?? '',
            text: rawObj.text ?? '',
            draftingStatus: rawObj.draftingStatus ?? 'draft',
            draftingNotes: rawObj.draftingNotes ?? '',
            lawChapters: mergedSlugs,
          },
        },
      })

      // Update local state so the UI reflects the merged chapters
      const mergedChapters = [
        ...existingChapters.map((ch) =>
          typeof ch === 'string' ? { slug: ch, name: ch } : ch,
        ),
        ...newChapters,
      ]
      updateDraftField('lawChapters', mergedChapters)
    }

    init()
  }, [draftId, loadDraft, isAmending, fetchRegulation, updateDraftMut, updateDraftField])

  const { lawChapters, loading: lawChaptersLoading } = useLawChapters()

  // Ref to always access the latest saveDraft, avoiding stale closures
  // in setTimeout callbacks after updateDraftField triggers a re-render.
  const saveDraftRef = useRef(saveDraft)
  saveDraftRef.current = saveDraft

  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>()

  // Near-immediate save for discrete changes (date pick, select).
  // Short delay lets React process the setState from updateDraftField.
  const saveDraftNow = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => saveDraftRef.current(), 50)
  }, [])

  // Read regulation fields from local draft state (sourced from DB)
  const selectedLawChapters = useMemo(
    () => draftData.lawChapters ?? [],
    [draftData.lawChapters],
  )

  const lawChapterOptions: Option<string>[] = useMemo(
    () =>
      lawChapters.map((ch) => ({
        value: ch.slug,
        label: ch.name,
      })),
    [lawChapters],
  )

  const lawChapterNameBySlug = useMemo(
    () =>
      lawChapters.reduce<Record<string, string>>((acc, chapter) => {
        acc[chapter.slug] = chapter.name
        return acc
      }, {}),
    [lawChapters],
  )

  const selectedLawChapterValues = useMemo(
    () =>
      selectedLawChapters.map((ch) => ({
        value: ch.slug,
        label: lawChapterNameBySlug[ch.slug] ?? ch.name ?? ch.slug,
      })),
    [selectedLawChapters, lawChapterNameBySlug],
  )

  const handleLawChaptersChange = useCallback(
    (options: Option<string>[]) => {
      const chapters = options.map((opt) => ({
        slug: opt.value as string,
        name: opt.label,
      }))
      updateDraftField('lawChapters', chapters)
      saveDraftNow()
    },
    [updateDraftField, saveDraftNow],
  )

  // Save regulation meta fields to DB on navigation
  const handleNavigate = (screenId?: string) => {
    if (draftId) {
      saveDraft()
    }
    props.goToScreen?.(screenId ?? '')
  }

  return (
    <FormScreen
      goToScreen={handleNavigate}
      title={f(regulation.meta.general.title)}
      intro={f(regulation.meta.general.intro)}
    >
      <Stack space={[2, 2, 3]}>
        <FormGroup title={regulation.meta.headings.effectiveDate}>
          <DatePicker
            id="regulation-effective-date"
            label={f(regulation.meta.inputs.effectiveDate.label)}
            placeholderText={f(
              regulation.meta.inputs.effectiveDate.placeholder,
            )}
            size="sm"
            locale="is"
            backgroundColor="blue"
            selected={
              draftData.effectiveDate
                ? new Date(draftData.effectiveDate)
                : undefined
            }
            handleChange={(date) => {
              updateDraftField(
                'effectiveDate',
                date ? date.toISOString().split('T')[0] : undefined,
              )
              saveDraftNow()
            }}
          />
        </FormGroup>

        <FormGroup title={regulation.meta.headings.lawChapters}>
          <Stack space={2}>
            <Select
              name="regulation-law-chapters"
              label={f(regulation.meta.inputs.lawChapters.label)}
              placeholder={f(regulation.meta.inputs.lawChapters.placeholder)}
              options={lawChapterOptions.filter(
                (opt) =>
                  !selectedLawChapters.some((ch) => ch.slug === opt.value),
              )}
              onChange={(option) => {
                if (!option) return
                const opt = option as Option<string>
                handleLawChaptersChange([...selectedLawChapterValues, opt])
              }}
              isSearchable
              isLoading={lawChaptersLoading}
              size="sm"
              value={null}
            />
            {selectedLawChapters.length > 0 && (
              <Inline space={1} flexWrap="wrap">
                {selectedLawChapters.map((ch) => (
                  <Tag
                    key={ch.slug}
                    variant="blue"
                    outlined
                    onClick={() =>
                      handleLawChaptersChange(
                        selectedLawChapterValues.filter(
                          (v) => v.value !== ch.slug,
                        ),
                      )
                    }
                  >
                    <Box display="flex" alignItems="center">
                      {lawChapterNameBySlug[ch.slug] ?? ch.name ?? ch.slug}
                      <Icon size="small" icon="close" />
                    </Box>
                  </Tag>
                ))}
              </Inline>
            )}
          </Stack>
        </FormGroup>
      </Stack>
    </FormScreen>
  )
}

export default RegulationMetaScreen
