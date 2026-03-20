import { useLocale } from '@island.is/localization'
import { FormScreen } from '../components/form/FormScreen'
import { regulation } from '../lib/messages'
import { InputFields, OJOIFieldBaseProps } from '../lib/types'
import {
  AlertMessage,
  Box,
  Button,
  Divider,
  Inline,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useRegulationImpacts } from '../hooks/useRegulationImpacts'
import { useRegulationSearch } from '../hooks/useRegulationSearch'
import { RegulationImpactSchema } from '../lib/dataSchema'
import {
  ImpactList,
  ImpactBaseSelection,
  ImpactAmendingSelection,
  EditChange,
  EditCancellation,
} from '../components/regulations'
import type { SelRegOption as BaseSelRegOption } from '../components/regulations/ImpactBaseSelection'
import type { SelRegOption as AmendingSelRegOption } from '../components/regulations/ImpactAmendingSelection'
import { findAffectedRegulationsInText } from '../utils/regulationGuessers'
import type { HTMLText, PlainText } from '@island.is/regulations'
import {
  formatAmendingBodyWithArticlePrefix,
  formatAmendingRegTitle,
} from '../utils/formatAmendingRegulation'
import { useApplication } from '../hooks/useUpdateApplication'
import { useRegulationDraft } from '../hooks/useRegulationDraft'
import {
  REGULATION_FROM_API_QUERY,
  GET_DRAFT_REGULATION_QUERY,
  UPDATE_DRAFT_REGULATION_MUTATION,
} from '../graphql/queries'
import type { Regulation, LawChapter } from '@island.is/regulations'
import { Routes } from '../lib/constants'

export const RegulationImpactsScreen = (props: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  const { application } = props
  const applicationType = application.answers?.applicationType
  const isAmending = applicationType === 'amending_regulation'

  const { draftId, ensureDraft } = useRegulationDraft({
    applicationId: application.id,
    answers: application.answers as unknown as Record<string, unknown>,
  })

  // Impacts are loaded from DB (single source of truth)
  const {
    impacts,
    groupedImpacts,
    impactsLoaded,
    addImpact,
    updateImpact,
    removeImpact,
    generateImpactId,
  } = useRegulationImpacts({ draftId })

  // updateApplicationV2 is still needed for advert text generation
  // (advert title/html are OJOI answer fields, not regulation DB fields)
  const { updateApplicationV2 } = useApplication({
    applicationId: application.id,
  })

  // Lazy queries for auto-selecting law chapters from impacted regulations
  const [fetchRegulation] = useLazyQuery<{
    OJOIAGetRegulationFromApi: Regulation | null
  }>(REGULATION_FROM_API_QUERY, { fetchPolicy: 'no-cache' })
  const [fetchDraft] = useLazyQuery(GET_DRAFT_REGULATION_QUERY, {
    fetchPolicy: 'network-only',
  })
  const [updateDraftMutation] = useMutation(UPDATE_DRAFT_REGULATION_MUTATION)

  /**
   * Generate amending regulation body text from all impact diffs,
   * then persist it as the default advert HTML content (base64-encoded)
   * and set the advert title.
   *
   * Mirrors the regulations-admin "Uppfæra texta" flow.
   */
  const generateAdvertText = useCallback(
    async (allImpacts: RegulationImpactSchema[]) => {
      if (allImpacts.length === 0) {
        await updateApplicationV2({
          path: InputFields.advert.html,
          value: '',
        })
        await updateApplicationV2({
          path: InputFields.advert.title,
          value: '',
        })
        return
      }

      // Generate body text from diffs
      const additions = formatAmendingBodyWithArticlePrefix(allImpacts)
      const bodyHtml = additions.join('') as HTMLText
      const base64Body = Buffer.from(bodyHtml).toString('base64')

      // Generate amending title (without "Reglugerð" prefix in OJOI flow)
      const title = formatAmendingRegTitle(allImpacts, {
        skipRegulationPrefix: true,
      })

      // Persist both to application answers
      await updateApplicationV2({
        path: InputFields.advert.html,
        value: base64Body,
      })
      await updateApplicationV2({
        path: InputFields.advert.title,
        value: title,
      })
    },
    [updateApplicationV2],
  )

  // Selected regulation for new impact
  const [selRegOption, setSelRegOption] = useState<
    (BaseSelRegOption | AmendingSelRegOption) | undefined
  >()
  const [chooseType, setChooseType] = useState<
    'cancel' | 'change' | undefined
  >()

  // Escape key handler
  const escClick = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setChooseType(undefined)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', escClick, false)
    return () => {
      document.removeEventListener('keydown', escClick, false)
    }
  }, [escClick])

  const closeModal = () => {
    setChooseType(undefined)
  }

  /**
   * After saving an impact for an amending regulation, auto-add the
   * impacted regulation's law chapters to the draft (merged with existing).
   */
  const autoSelectLawChapters = useCallback(
    async (regulationName: string, resolvedDraftId: string) => {
      try {
        const [regResult, draftResult] = await Promise.all([
          fetchRegulation({
            variables: { input: { regulation: regulationName } },
          }),
          fetchDraft({
            variables: { input: { draftId: resolvedDraftId } },
          }),
        ])

        const regLawChapters =
          (regResult.data?.OJOIAGetRegulationFromApi as Regulation | null)
            ?.lawChapters ?? []
        if (regLawChapters.length === 0) return

        const raw = draftResult.data?.OJOIAGetDraftRegulation
        const existingChapters = (raw?.lawChapters ?? []) as Array<
          string | { slug: string; name: string }
        >
        const existingSlugs = new Set(
          existingChapters.map((ch) => (typeof ch === 'string' ? ch : ch.slug)),
        )

        const newSlugs = regLawChapters
          .filter((ch: LawChapter) => !existingSlugs.has(ch.slug))
          .map((ch: LawChapter) => ch.slug)

        if (newSlugs.length === 0) return

        const mergedSlugs = [...Array.from(existingSlugs), ...newSlugs]

        await updateDraftMutation({
          variables: {
            input: {
              draftId: resolvedDraftId,
              title: raw?.title ?? '',
              text: raw?.text ?? '',
              draftingStatus: raw?.draftingStatus ?? 'draft',
              draftingNotes: raw?.draftingNotes ?? '',
              lawChapters: mergedSlugs,
            },
          },
        })
      } catch (error) {
        console.error('Failed to auto-select law chapters:', error)
      }
    },
    [fetchRegulation, fetchDraft, updateDraftMutation],
  )

  /**
   * When an impact regulation is removed, strip its law chapters from
   * the draft — unless another remaining impact shares the same chapters.
   */
  const removeRegulationLawChapters = useCallback(
    async (
      regulationName: string,
      resolvedDraftId: string,
      remainingImpacts: RegulationImpactSchema[],
    ) => {
      try {
        // Fetch the removed regulation's law chapters + current draft state
        const [regResult, draftResult] = await Promise.all([
          fetchRegulation({
            variables: { input: { regulation: regulationName } },
          }),
          fetchDraft({
            variables: { input: { draftId: resolvedDraftId } },
          }),
        ])

        const regLawChapters =
          (regResult.data?.OJOIAGetRegulationFromApi as Regulation | null)
            ?.lawChapters ?? []
        if (regLawChapters.length === 0) return

        const raw = draftResult.data?.OJOIAGetDraftRegulation
        const existingChapters = (raw?.lawChapters ?? []) as Array<
          string | { slug: string; name: string }
        >
        const existingSlugs = existingChapters.map((ch) =>
          typeof ch === 'string' ? ch : ch.slug,
        )

        // Collect law chapters that other remaining impacts still need
        // by fetching their regulations in parallel
        const otherRegNames = [
          ...new Set(
            remainingImpacts
              .filter((i) => i.name && i.name !== 'self')
              .map((i) => i.name),
          ),
        ]
        const otherResults = await Promise.all(
          otherRegNames.map((name) =>
            fetchRegulation({
              variables: { input: { regulation: name } },
            }),
          ),
        )
        const keepSlugs = new Set<string>(
          otherResults.flatMap((r) =>
            (
              (r.data?.OJOIAGetRegulationFromApi as Regulation | null)
                ?.lawChapters ?? []
            ).map((ch: LawChapter) => String(ch.slug)),
          ),
        )

        const removeSlugs = new Set<string>(
          regLawChapters.map((ch: LawChapter) => String(ch.slug)),
        )
        const filteredSlugs = existingSlugs.filter(
          (slug) => !removeSlugs.has(slug) || keepSlugs.has(slug),
        )

        await updateDraftMutation({
          variables: {
            input: {
              draftId: resolvedDraftId,
              title: raw?.title ?? '',
              text: raw?.text ?? '',
              draftingStatus: raw?.draftingStatus ?? 'draft',
              draftingNotes: raw?.draftingNotes ?? '',
              lawChapters: filteredSlugs,
            },
          },
        })
      } catch (error) {
        console.error('Failed to remove law chapters:', error)
      }
    },
    [fetchRegulation, fetchDraft, updateDraftMutation],
  )

  const handleSaveNewImpact = async (impact: RegulationImpactSchema) => {
    const resolvedDraftId = await ensureDraft(applicationType ?? '')
    await addImpact(impact, resolvedDraftId)
    const allImpacts = [...impacts, impact]
    await generateAdvertText(allImpacts)

    // Auto-add law chapters from the impacted regulation
    if (
      isAmending &&
      impact.name &&
      impact.name !== 'self' &&
      resolvedDraftId
    ) {
      await autoSelectLawChapters(impact.name, resolvedDraftId)
    }

    setChooseType(undefined)
    setSelRegOption(undefined)
  }

  const handleSaveExistingImpact = async (impact: RegulationImpactSchema) => {
    await updateImpact(impact.id, impact)
    const allImpacts = impacts.map((i) =>
      i.id === impact.id ? { ...i, ...impact } : i,
    )
    await generateAdvertText(allImpacts)
  }

  const handleDeleteImpact = async (id: string) => {
    const removedImpact = impacts.find((i) => i.id === id)
    await removeImpact(id)
    const allImpacts = impacts.filter((i) => i.id !== id)
    await generateAdvertText(allImpacts)

    // Remove law chapters that came from this regulation (if no other
    // impact still references the same regulation)
    if (
      isAmending &&
      removedImpact?.name &&
      removedImpact.name !== 'self' &&
      draftId
    ) {
      const otherImpactsForSameReg = allImpacts.some(
        (i) => i.name === removedImpact.name,
      )
      if (!otherImpactsForSameReg) {
        await removeRegulationLawChapters(
          removedImpact.name,
          draftId,
          allImpacts,
        )
      }
    }
  }

  // Regulation search hook (replaces Phase 3 mock)
  const {
    search: executeRegulationSearch,
    results: searchResults,
    loading: searchLoading,
  } = useRegulationSearch()

  const handleRegulationSearch = (query: string) => {
    executeRegulationSearch(query)
  }

  // Extract mentioned regulations from draft HTML for base regulation flow
  const mentionedOptions = useMemo(() => {
    const title = (application.answers?.advert?.title ?? '') as PlainText
    const base64Html = application.answers?.advert?.html ?? ''
    const html = base64Html
      ? (Buffer.from(base64Html, 'base64').toString('utf-8') as HTMLText)
      : ('' as HTMLText)
    if (!title && !html) return []
    const regNames = findAffectedRegulationsInText(title, html)
    return regNames.map((name) => ({
      value: String(name),
      label: String(name),
    }))
  }, [application.answers?.advert?.title, application.answers?.advert?.html])

  return (
    <FormScreen
      goToScreen={props.goToScreen}
      title={f(regulation.impacts.general.title)}
      intro={f(regulation.impacts.general.intro)}
    >
      <Stack space={[2, 2, 3]}>
        {/* Info alert for base regulations */}
        {!isAmending && (
          <Box marginBottom={3}>
            <AlertMessage
              type="info"
              message={
                <div>
                  ATH: Sé ætlunin að breyta annarri reglugerð, þarf að minnast á
                  þá reglugerð með skýrum hætti í þessari stofnreglugerð.
                  {'    '}
                  <Button
                    onClick={() =>
                      props.goToScreen?.(Routes.REGULATION_CONTENT)
                    }
                    variant="text"
                    size="small"
                  >
                    Endurskoða textann
                  </Button>
                </div>
              }
            />
          </Box>
        )}

        {/* Regulation selection */}
        <Box marginBottom={4}>
          {!isAmending ? (
            <ImpactBaseSelection
              mentionedOptions={mentionedOptions}
              onSelect={(option) => setSelRegOption(option)}
            />
          ) : (
            <ImpactAmendingSelection
              onSelect={(option) => setSelRegOption(option)}
              onSearch={handleRegulationSearch}
              searchResults={searchResults}
              loading={searchLoading}
            />
          )}
        </Box>

        {/* Impact type selection */}
        {selRegOption && (
          <Box marginBottom={[4, 4, 8]}>
            <Box marginBottom={2} paddingBottom={2}>
              <Divider weight="regular" />
            </Box>
            <Text variant="h4" as="h4" marginBottom={[2, 2, 3, 4]}>
              Hvað viltu gera við reglugerðina?
            </Text>
            <Inline space={[2, 2, 3, 4]} align="center" alignY="center">
              <Button
                variant="ghost"
                icon="document"
                iconType="outline"
                onClick={() => setChooseType('change')}
              >
                Gera textabreytingar
              </Button>
              <span>eða</span>
              <Button
                variant="ghost"
                icon="fileTrayFull"
                iconType="outline"
                onClick={() => setChooseType('cancel')}
              >
                Fella hana brott
              </Button>
            </Inline>

            {chooseType === 'cancel' && (
              <EditCancellation
                cancellation={{
                  id: generateImpactId(),
                  type: 'repeal',
                  name: selRegOption.value as string,
                  regTitle:
                    'title' in selRegOption
                      ? (selRegOption.title as string)
                      : selRegOption.label,
                }}
                onSave={handleSaveNewImpact}
                onClose={closeModal}
              />
            )}

            {chooseType === 'change' && (
              <EditChange
                change={{
                  id: generateImpactId(),
                  type: 'amend',
                  name: selRegOption.value as string,
                  regTitle:
                    'title' in selRegOption
                      ? (selRegOption.title as string)
                      : selRegOption.label,
                }}
                draftTitle={application.answers?.advert?.title}
                draftHtml={application.answers?.advert?.html as string}
                isBase={applicationType === 'base_regulation'}
                applicationId={application.id}
                onSave={handleSaveNewImpact}
                onClose={closeModal}
              />
            )}
          </Box>
        )}

        {/* Impact list */}
        {!impactsLoaded ? (
          <SkeletonLoader height={80} borderRadius="large" />
        ) : (
          <ImpactList
            groupedImpacts={groupedImpacts}
            draftTitle={application.answers?.advert?.title}
            draftHtml={application.answers?.advert?.html as string}
            isBase={applicationType === 'base_regulation'}
            applicationId={application.id}
            onSaveImpact={handleSaveExistingImpact}
            onDeleteImpact={handleDeleteImpact}
          />
        )}
      </Stack>
    </FormScreen>
  )
}

export default RegulationImpactsScreen
