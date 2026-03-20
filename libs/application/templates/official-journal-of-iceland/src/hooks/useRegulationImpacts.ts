/**
 * Hook for managing regulation impacts with the DB as single source of truth.
 *
 * Impacts are persisted ONLY in the regulations-admin DB — no answers storage.
 * This hook:
 *   1. Loads impacts from the DB when draftId is available
 *   2. Maintains local React state for the UI
 *   3. Routes all CRUD operations directly to DB mutations
 *
 * Each impact has a client-generated `id` (for React keys / local ops) and
 * a server-generated `impactId` (UUID from the regulations-admin DB).
 */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { toast } from '@island.is/island-ui/core'
import { RegulationImpactSchema } from '../lib/dataSchema'
import { getDefaultDate } from '../lib/utils'
import {
  CREATE_DRAFT_IMPACT_MUTATION,
  UPDATE_DRAFT_IMPACT_MUTATION,
  DELETE_DRAFT_IMPACT_MUTATION,
  GET_DRAFT_REGULATION_QUERY,
} from '../graphql/queries'

export type UseRegulationImpactsOptions = {
  draftId?: string
}

/**
 * Map DB impact data to our local RegulationImpactSchema format.
 *
 * The backend returns impacts as a grouped object:
 *   { impacts: { "0123/2024": [{ id, type: 'amend'|'repeal', ... }] } }
 *
 * Each value is an array of DraftImpact objects keyed by regulation name.
 */
const mapDbImpactsToLocal = (
  draftData: Record<string, unknown>,
): RegulationImpactSchema[] => {
  const results: RegulationImpactSchema[] = []

  const impactsObj = draftData?.impacts as
    | Record<string, Array<Record<string, unknown>>>
    | undefined

  if (!impactsObj || typeof impactsObj !== 'object') {
    return results
  }

  // Iterate the grouped impacts: { [regName]: DraftImpact[] }
  for (const [_regName, impactList] of Object.entries(impactsObj)) {
    if (!Array.isArray(impactList)) continue

    for (const impact of impactList) {
      const type = String(impact.type ?? '')

      if (type === 'amend') {
        results.push({
          id: `db-change-${String(impact.id ?? results.length)}`,
          impactId: impact.id as string | undefined,
          type: 'amend',
          name: String(impact.name ?? ''),
          regTitle: String(impact.regTitle ?? ''),
          date: impact.date as string | undefined,
          title: String(impact.title ?? ''),
          text: String(impact.text ?? ''),
          appendixes: impact.appendixes as
            | Array<{
                title?: string
                text?: string
                diff?: string
                revoked?: boolean
              }>
            | undefined,
          comments: impact.comments as string | undefined,
          diff: impact.diff as string | undefined,
        })
      } else if (type === 'repeal') {
        results.push({
          id: `db-cancel-${String(impact.id ?? results.length)}`,
          impactId: impact.id as string | undefined,
          type: 'repeal',
          name: String(impact.name ?? ''),
          regTitle: String(impact.regTitle ?? ''),
          date: impact.date as string | undefined,
        })
      }
    }
  }

  return results
}

export const useRegulationImpacts = ({
  draftId,
}: UseRegulationImpactsOptions) => {
  const [impacts, setImpacts] = useState<RegulationImpactSchema[]>([])
  const [impactsLoaded, setImpactsLoaded] = useState(false)

  const [fetchDraft] = useLazyQuery(GET_DRAFT_REGULATION_QUERY, {
    fetchPolicy: 'network-only',
  })
  const [createImpactMutation] = useMutation(CREATE_DRAFT_IMPACT_MUTATION)
  const [updateImpactMutation] = useMutation(UPDATE_DRAFT_IMPACT_MUTATION)
  const [deleteImpactMutation] = useMutation(DELETE_DRAFT_IMPACT_MUTATION)

  // Reset when draftId changes so impacts are re-fetched for the new draft
  useEffect(() => {
    setImpactsLoaded(false)
    setImpacts([])
  }, [draftId])

  // When there is no draftId, there are no impacts to load
  useEffect(() => {
    if (!draftId) {
      setImpactsLoaded(true)
    }
  }, [draftId])

  // Load impacts from DB when draftId becomes available
  useEffect(() => {
    if (!draftId || impactsLoaded) return

    const loadImpacts = async () => {
      try {
        const result = await fetchDraft({
          variables: { input: { draftId } },
        })
        const raw = result.data?.OJOIAGetDraftRegulation
        if (raw) {
          const loaded = mapDbImpactsToLocal(raw)
          setImpacts(loaded)
        }
        setImpactsLoaded(true)
      } catch (error) {
        console.error('Failed to load impacts from DB:', error)
      }
    }

    loadImpacts()
  }, [draftId, impactsLoaded, fetchDraft])

  const amendments = useMemo(
    () => impacts.filter((i) => i.type === 'amend'),
    [impacts],
  )

  const cancellations = useMemo(
    () => impacts.filter((i) => i.type === 'repeal'),
    [impacts],
  )

  /**
   * Groups impacts by their target regulation name (same as the
   * regulations-admin GroupedDraftImpactForms pattern).
   */
  const groupedImpacts = useMemo(() => {
    const groups: Record<string, RegulationImpactSchema[]> = {}
    impacts.forEach((impact) => {
      const key = impact.name
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(impact)
    })
    return groups
  }, [impacts])

  /**
   * Add a new impact — writes to DB, then updates local state.
   */
  const addImpact = useCallback(
    async (impact: RegulationImpactSchema, draftIdOverride?: string) => {
      const effectiveDraftId = draftIdOverride || draftId
      if (!effectiveDraftId) {
        throw new Error('Cannot add impact: no draftId')
      }

      const appendixes = (impact.appendixes ?? []).map((a) => ({
        title: a.title ?? '',
        text: a.text ?? '',
      }))

      const result = await createImpactMutation({
        variables: {
          input: {
            draftId: effectiveDraftId,
            type: impact.type,
            regulation: impact.name,
            date: impact.date || getDefaultDate(),
            title: impact.title ?? '',
            text: impact.text ?? '',
            appendixes: appendixes.length > 0 ? appendixes : undefined,
            comments: impact.comments,
            diff: impact.diff,
          },
        },
      })

      const serverId = result.data?.OJOIACreateDraftImpact?.id
      if (!serverId) {
        toast.error('Ekki tókst að vista færslu, reyndu aftur.')
        return
      }

      setImpacts((prev) => [...prev, { ...impact, impactId: serverId }])
    },
    [draftId, createImpactMutation],
  )

  /**
   * Update an existing impact — writes to DB, then updates local state.
   */
  const updateImpact = useCallback(
    async (id: string, updatedFields: Partial<RegulationImpactSchema>) => {
      const existing = impacts.find((i) => i.id === id)
      if (!existing?.impactId) {
        throw new Error('Cannot update impact: no server-side impactId')
      }

      const appendixes = (
        updatedFields.appendixes ??
        existing.appendixes ??
        []
      ).map((a) => ({
        title: a.title ?? '',
        text: a.text ?? '',
      }))

      await updateImpactMutation({
        variables: {
          input: {
            impactId: existing.impactId,
            type: existing.type,
            date: updatedFields.date ?? existing.date,
            title: updatedFields.title ?? existing.title,
            text: updatedFields.text ?? existing.text,
            appendixes: appendixes.length > 0 ? appendixes : undefined,
            comments: updatedFields.comments ?? existing.comments,
            diff: updatedFields.diff ?? existing.diff,
          },
        },
      })

      setImpacts((prev) =>
        prev.map((impact) =>
          impact.id === id ? { ...impact, ...updatedFields } : impact,
        ),
      )
    },
    [impacts, updateImpactMutation],
  )

  /**
   * Remove an impact — deletes from DB, then removes from local state.
   */
  const removeImpact = useCallback(
    async (id: string) => {
      const existing = impacts.find((i) => i.id === id)

      if (existing?.impactId) {
        await deleteImpactMutation({
          variables: {
            input: {
              impactId: existing.impactId,
              type: existing.type,
            },
          },
        })
      }

      setImpacts((prev) => prev.filter((impact) => impact.id !== id))
    },
    [impacts, deleteImpactMutation],
  )

  /**
   * Generate a unique ID for a new impact.
   */
  const generateImpactId = useCallback((): string => {
    return `impact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }, [])

  return {
    impacts,
    amendments,
    cancellations,
    groupedImpacts,
    impactsLoaded,
    addImpact,
    updateImpact,
    removeImpact,
    generateImpactId,
  }
}
