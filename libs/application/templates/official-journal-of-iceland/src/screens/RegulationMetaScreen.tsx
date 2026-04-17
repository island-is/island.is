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

  // Load regulation-specific fields from DB on mount
  const loadRef = useRef(false)
  useEffect(() => {
    if (loadRef.current || !draftId) return
    loadRef.current = true
    loadDraft()
  }, [draftId, loadDraft])

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
