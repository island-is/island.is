/**
 * Hook for managing the regulation draft lifecycle in the regulations-admin DB.
 *
 * Single source of truth: regulation-specific data (effectiveDate, lawChapters,
 * fastTrack, draftingNotes, impacts) lives ONLY in the regulations-admin database.
 * Only the `draftId` is stored in application.answers to link the two.
 *
 * Shared OJOI fields (advert title/html, signature) remain in application.answers
 * and are mapped into the regulation DB on save.
 *
 * Flow:
 *   1. ensureDraft()       — creates draft on first save, stores draftId in answers
 *   2. loadDraft()         — fetches current state from DB, populates local state
 *   3. updateDraftField()  — updates regulation fields in local state
 *   4. saveDraft()         — persists local state + mapped OJOI fields to DB
 */
import { useCallback, useRef, useState } from 'react'
import { useMutation, useLazyQuery } from '@apollo/client'
import { useFormContext } from 'react-hook-form'
import { toast } from '@island.is/island-ui/core'
import { useApplication } from './useUpdateApplication'
import { InputFields } from '../lib/types'
import { getValueViaPath } from '@island.is/application/core'
import {
  CREATE_DRAFT_REGULATION_MUTATION,
  UPDATE_DRAFT_REGULATION_MUTATION,
  GET_DRAFT_REGULATION_QUERY,
} from '../graphql/queries'
import {
  renderSignatureToText,
  renderSignatureToDate,
} from '../utils/signatureRenderer'

/**
 * Regulation-specific fields that live in the DB (not in answers).
 * Updated via updateDraftField() and persisted to DB via saveDraft().
 */
export type RegulationDraftData = {
  effectiveDate?: string
  fastTrack?: boolean
  lawChapters?: Array<{ slug: string; name: string }>
  draftingNotes?: string
}

/**
 * The full update body sent to the regulation DB.
 * Combines OJOI answer-sourced fields + regulation-specific fields from local state.
 */
export type DraftRegulationUpdateBody = {
  title?: string
  text?: string
  appendixes?: Array<{ title: string; text: string }>
  draftingNotes?: string
  idealPublishDate?: string
  effectiveDate?: string
  ministry?: string
  signatureDate?: string
  signatureText?: string
  lawChapters?: string[]
  fastTrack?: boolean
  type?: string
  signedDocumentUrl?: string
}

export type UseRegulationDraftOptions = {
  applicationId: string
  answers: Record<string, unknown>
}

export const useRegulationDraft = ({
  applicationId,
  answers,
}: UseRegulationDraftOptions) => {
  const { updateApplicationV2 } = useApplication({ applicationId })
  const { watch } = useFormContext()
  const createInFlightRef = useRef(false)

  // Local state fallback — set immediately after creation so callers
  // don't have to wait for react-hook-form / application refetch.
  const [localDraftId, setLocalDraftId] = useState<string | undefined>()

  // Watch draftId from react-hook-form — this re-renders the component
  // when setValue() is called from TypeSelectionScreen's ensureDraft.
  const watchedDraftId = watch(InputFields.regulation.draftId) as
    | string
    | undefined

  // Local state for regulation-specific fields (loaded from DB)
  const [draftData, setDraftData] = useState<RegulationDraftData>({})
  const [draftLoaded, setDraftLoaded] = useState(false)

  const [createDraftMutation, { loading: createLoading }] = useMutation(
    CREATE_DRAFT_REGULATION_MUTATION,
  )
  const [updateDraftMutation, { loading: updateLoading }] = useMutation(
    UPDATE_DRAFT_REGULATION_MUTATION,
  )
  const [fetchDraftQuery, { loading: fetchLoading }] = useLazyQuery(
    GET_DRAFT_REGULATION_QUERY,
    { fetchPolicy: 'network-only' },
  )

  const getDraftId = useCallback((): string | undefined => {
    // Priority: local state (immediate after creation) > react-hook-form
    // (live form value set via setValue) > answers prop (initial snapshot)
    return (
      localDraftId ??
      watchedDraftId ??
      getValueViaPath<string>(answers, InputFields.regulation.draftId)
    )
  }, [localDraftId, watchedDraftId, answers])

  /**
   * Create a new draft regulation in the regulations-admin DB.
   * Stores the returned draftId in application.answers (the only regulation
   * field that lives in answers).
   */
  const createDraft = useCallback(
    async (type: string): Promise<string | undefined> => {
      if (createInFlightRef.current) return getDraftId()
      createInFlightRef.current = true

      try {
        const regulationType = type === 'base_regulation' ? 'base' : 'amending'
        const result = await createDraftMutation({
          variables: {
            input: { type: regulationType },
          },
        })

        const draftId = result.data?.OJOIACreateDraftRegulation?.id
        if (draftId) {
          // Set local state immediately so draftId is available to
          // other hooks/components without waiting for a re-render.
          setLocalDraftId(draftId)

          await updateApplicationV2({
            path: InputFields.regulation.draftId,
            value: draftId,
          })
          return draftId
        }
        return undefined
      } catch (error) {
        console.error('Failed to create regulation draft:', error)
        toast.error('Ekki tókst að búa til drög, reyndu aftur.')
        return undefined
      } finally {
        createInFlightRef.current = false
      }
    },
    [createDraftMutation, updateApplicationV2, getDraftId],
  )

  /**
   * Returns the existing draftId, or creates a new draft if none exists.
   */
  const ensureDraft = useCallback(
    async (applicationType: string): Promise<string | undefined> => {
      const existing = getDraftId()
      if (existing) return existing
      return createDraft(applicationType)
    },
    [getDraftId, createDraft],
  )

  /**
   * Update a regulation-specific field in local state.
   * Changes are persisted to DB on the next saveDraft() call.
   */
  const updateDraftField = useCallback(
    <K extends keyof RegulationDraftData>(
      field: K,
      value: RegulationDraftData[K],
    ) => {
      setDraftData((prev) => ({ ...prev, [field]: value }))
    },
    [],
  )

  /**
   * Build the full update body for the regulation DB.
   * Merges OJOI answer-sourced fields (advert, signature) with
   * regulation-specific fields from local state.
   */
  const buildUpdateBody = useCallback(
    (
      overrides?: Partial<DraftRegulationUpdateBody>,
    ): DraftRegulationUpdateBody => {
      const advert = (answers?.advert ?? {}) as Record<string, unknown>
      const signature = answers?.signature as
        | Record<string, unknown>
        | undefined

      const appendixes = (
        (advert?.additions ?? []) as Array<{
          title?: string
          content?: string
          html?: string
        }>
      ).map((a) => ({
        title: a.title ?? '',
        text: a.content ?? a.html ?? '',
      }))

      const lawChapterSlugs = (draftData.lawChapters ?? []).map((ch) => ch.slug)

      const applicationType = answers?.applicationType as string | undefined
      const type = applicationType === 'base_regulation' ? 'base' : 'amending'

      return {
        title: (advert?.title as string) ?? '',
        text: (advert?.html as string) ?? '',
        appendixes,
        draftingNotes: draftData.draftingNotes ?? '',
        idealPublishDate: (advert?.requestedDate as string) ?? undefined,
        effectiveDate: draftData.effectiveDate ?? undefined,
        ministry: undefined, // Derived from signature on submit
        signatureDate: signature ? renderSignatureToDate(signature) : undefined,
        signatureText: signature ? renderSignatureToText(signature) : undefined,
        lawChapters: lawChapterSlugs.length > 0 ? lawChapterSlugs : undefined,
        fastTrack: draftData.fastTrack ?? false,
        type,
        ...overrides,
      }
    },
    [answers, draftData],
  )

  /**
   * Persist local state + mapped OJOI fields to the regulation DB.
   */
  const saveDraft = useCallback(
    async (
      overrides?: Partial<DraftRegulationUpdateBody>,
    ): Promise<boolean> => {
      const draftId = getDraftId()
      if (!draftId) {
        console.warn('Cannot save draft: no draftId')
        return false
      }

      try {
        const body = buildUpdateBody(overrides)
        await updateDraftMutation({
          variables: {
            input: {
              draftId,
              ...body,
            },
          },
        })
        return true
      } catch (error) {
        console.error('Failed to save regulation draft:', error)
        toast.error('Ekki tókst að vista drög, reyndu aftur.')
        return false
      }
    },
    [getDraftId, buildUpdateBody, updateDraftMutation],
  )

  /**
   * Fetch the draft from the DB and populate local state with
   * regulation-specific fields. Returns the raw draft data so callers
   * can also extract impacts or other data if needed.
   */
  const loadDraft = useCallback(
    async (overrideDraftId?: string) => {
      const id = overrideDraftId || getDraftId()
      if (!id) return null

      try {
        const result = await fetchDraftQuery({
          variables: {
            input: { draftId: id },
          },
        })

        const raw = result.data?.OJOIAGetDraftRegulation
        if (raw) {
          // Populate local state with regulation-specific fields from DB
          setDraftData({
            effectiveDate: raw.effectiveDate ?? undefined,
            fastTrack: raw.fastTrack ?? false,
            lawChapters: raw.lawChapters
              ? (
                  raw.lawChapters as Array<
                    string | { slug: string; name: string }
                  >
                ).map((ch) =>
                  typeof ch === 'string'
                    ? { slug: ch, name: ch }
                    : { slug: ch.slug ?? '', name: ch.name ?? '' },
                )
              : [],
            draftingNotes: raw.draftingNotes ?? '',
          })
          setDraftLoaded(true)
        }

        return raw ?? null
      } catch (error) {
        console.error('Failed to load regulation draft:', error)
        toast.error('Ekki tókst að sækja drög.')
        return null
      }
    },
    [getDraftId, fetchDraftQuery],
  )

  return {
    draftId: getDraftId(),
    draftData,
    draftLoaded,
    createDraft,
    ensureDraft,
    saveDraft,
    loadDraft,
    updateDraftField,
    buildUpdateBody,
    isCreating: createLoading,
    isSaving: updateLoading,
    isLoading: fetchLoading,
  }
}
