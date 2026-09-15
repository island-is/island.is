import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useMutation } from '@apollo/client'
import { getValueViaPath } from '@island.is/application/core'
import { UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'
import type { Application } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { ApiActions, draftActionId } from './constants'

type QueryExternalData<T> = {
  status?: 'success' | 'failure'
  data?: T
}

// Named rather than inferred so callers (and the spec) can reference the shape
// without a `typeof useDraftQueries<T>` instantiation expression, which the
// repo's prettier cannot parse.
export type DraftQueriesResult<T extends Record<string, unknown>> = {
  contents: Partial<T>
  loading: boolean
  hasError: boolean
  refetch: (options?: { silent?: boolean }) => Promise<void>
}

type DraftQueryOptions = {
  // Prepends the create-draft provider, so the draft exists before the reads
  // run. Only the first screen to touch the draft needs it.
  ensureDraft?: boolean
  // enabled=false for providers the current state's role does not grant — the
  // mutation would 400 on the actionId check. The screen still renders on the
  // persisted snapshot, which is all a query that never fetches can offer. An
  // explicit refetch() is the caller's decision and still fires.
  //
  // Read once, at mount: it gates the mount effect (deps []) and the initial
  // `loading`, so a later false -> true flip neither fetches nor re-enters
  // loading. Callers must derive it from something stable, as the current ones
  // do (a field prop).
  enabled?: boolean
}

// Reads a screen's draft content from DMR — one mutation for however many
// externalData keys the screen needs.
//
// ONE mutation, not one per key, because updateApplicationExternalData is a
// read-modify-write of the whole externalData column: the runner snapshots the
// column before the providers run and writes `{...snapshot, ...results}`
// afterwards, with no row lock or transaction. Two overlapping calls therefore
// both merge onto the same snapshot and the later write drops the earlier one's
// key. Batching the keys a screen mounts with keeps them inside a single
// snapshot-and-write, where the runner resolves them concurrently anyway — so
// this is also one round trip instead of N.
//
// Not cached across mounts, even though the providers persist their responses:
// the draft is mutable server state that OTHER screens write to. Criteria are
// edited on the criteria screen but read (as a tree, with sub-criteria) by three
// later screens; a workbook re-import REPLACEs the whole scoring graph with
// fresh ids. Every screen diffs its form against the ids it loaded, so a
// snapshot that predates a sibling's sync makes it send UPDATE/REMOVE commands
// for rows DMR no longer has — a 404 (`Criterion "…" not found`) that repeats on
// every Continue, since the stale snapshot is what got persisted. One read per
// mount is the price of a baseline that is actually current.
export const useDraftQueries = <T extends Record<string, unknown>>(
  application: Application,
  // Keyed by externalDataId, valued by the actionId that fills it.
  actionIdByExternalDataId: { [K in keyof T]: string },
  { ensureDraft = false, enabled = true }: DraftQueryOptions = {},
): DraftQueriesResult<T> => {
  const { lang: locale } = useLocale()
  const [updateApplicationExternalData] = useMutation(
    UPDATE_APPLICATION_EXTERNAL_DATA,
  )

  // The spec is written inline at every call site, so its identity churns on
  // every render while its content never does. Read once, like `enabled`.
  const specRef = useRef(actionIdByExternalDataId)
  const keys = useMemo(
    () => Object.keys(specRef.current) as (keyof T & string)[],
    [],
  )

  const [contents, setContents] = useState<Partial<T>>(() => {
    // An enabled group is about to fetch, so it starts empty — screens gate
    // their one-shot seed on the content being present, and seeding them from
    // the persisted snapshot would hand them the stale baseline this hook
    // exists to avoid.
    if (enabled) return {}
    const seeded: Partial<T> = {}
    keys.forEach((key) => {
      const existing = getValueViaPath<QueryExternalData<T[typeof key]>>(
        application.externalData,
        key,
      )
      if (existing?.status === 'success') seeded[key] = existing.data
    })
    return seeded
  })
  const [loading, setLoading] = useState(enabled)
  const [hasError, setHasError] = useState(false)
  const fetchedOnce = useRef(false)

  const fetchContents = useCallback(
    async ({ silent = false }: { silent?: boolean } = {}) => {
      if (!silent) setLoading(true)
      setHasError(false)
      try {
        // Every read shares one order so the runner resolves them with a single
        // Promise.all; create-draft has to land before any of them.
        const readOrder = ensureDraft ? 1 : 0
        const dataProviders = [
          ...(ensureDraft
            ? [
                {
                  actionId: draftActionId(ApiActions.createSalaryDraft),
                  order: 0,
                },
              ]
            : []),
          ...keys.map((key) => ({
            actionId: specRef.current[key],
            order: readOrder,
          })),
        ]

        const res = await updateApplicationExternalData({
          variables: {
            input: {
              id: application.id,
              dataProviders,
            },
            locale,
          },
        })
        const externalData =
          res.data?.updateApplicationExternalData.externalData ?? {}

        const next: Partial<T> = {}
        // One failed leg fails the group: every caller renders a single error
        // state over the whole screen, and a screen missing one of its reads
        // has nothing useful to show anyway.
        let anyFailed = false
        keys.forEach((key) => {
          const result = externalData[key] as
            | QueryExternalData<T[typeof key]>
            | undefined
          if (result?.status === 'success' && result.data) {
            next[key] = result.data
          } else {
            anyFailed = true
          }
        })
        setContents((prev) => ({ ...prev, ...next }))
        if (anyFailed) setHasError(true)
      } catch {
        setHasError(true)
      } finally {
        if (!silent) setLoading(false)
      }
    },
    [application.id, ensureDraft, keys, locale, updateApplicationExternalData],
  )

  // silent=true (e.g. from beforeSubmitCallback) avoids a loading flash while navigating away.
  const refetch = useCallback(
    (options?: { silent?: boolean }) => fetchContents(options),
    [fetchContents],
  )

  useEffect(() => {
    if (!enabled) return
    if (fetchedOnce.current) return
    fetchedOnce.current = true
    void fetchContents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { contents, loading, hasError, refetch }
}

// Single-key convenience over useDraftQueries, for the screens that read exactly
// one thing. A screen needing two or more should call useDraftQueries directly
// rather than this twice — see the batching note above.
export const useDraftQuery = <T>(
  application: Application,
  actionId: string,
  externalDataId: string,
  options: DraftQueryOptions = {},
) => {
  const { contents, loading, hasError, refetch } = useDraftQueries<
    Record<string, T>
  >(application, { [externalDataId]: actionId }, options)

  return { content: contents[externalDataId], loading, hasError, refetch }
}
