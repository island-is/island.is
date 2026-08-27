import { useCallback, useEffect, useRef, useState } from 'react'
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

// Each screen owns its own externalData key/actionId (no shared cross-screen
// cache needed, since refetch's mutation response writes straight into
// application.externalData). DMR is called on every mount, and again after a
// sync to pre-warm the next screen.
//
// Deliberately not cached across mounts, even though the provider persists its
// response to externalData: the draft is mutable server state that OTHER
// screens write to. Criteria are edited on the criteria screen but read (as a
// tree, with sub-criteria) by three later screens; a workbook re-import
// REPLACEs the whole scoring graph with fresh ids. Every screen diffs its form
// against the ids it loaded, so a snapshot that predates a sibling's sync makes
// it send UPDATE/REMOVE commands for rows DMR no longer has — a 404
// (`Criterion "…" not found`) that repeats on every Continue, since the stale
// snapshot is what got persisted. One read per mount is the price of a baseline
// that is actually current.
export const useDraftQuery = <T>(
  application: Application,
  actionId: string,
  externalDataId: string,
  // enabled=false for a provider the current state's role does not grant —
  // the mutation would 400 on the actionId check. The screen still renders;
  // whatever the query would have supplied is simply absent. An explicit
  // refetch() is the caller's decision and still fires.
  // Read once, at mount: it gates the mount effect (deps []) and the initial
  // `loading`, so a later false -> true flip neither fetches nor re-enters
  // loading. Callers must derive it from something stable, as both current
  // ones do (a field prop).
  {
    ensureDraft = false,
    enabled = true,
  }: { ensureDraft?: boolean; enabled?: boolean } = {},
) => {
  const { lang: locale } = useLocale()
  const [updateApplicationExternalData] = useMutation(
    UPDATE_APPLICATION_EXTERNAL_DATA,
  )

  const [content, setContent] = useState<T | undefined>(() => {
    // An enabled query is about to fetch, so it starts empty — screens gate
    // their one-shot seed on `content`, and seeding them from the persisted
    // snapshot would hand them the stale baseline this hook exists to avoid.
    // A disabled query never fetches, so the snapshot is all it can offer.
    if (enabled) return undefined
    const existing = getValueViaPath<QueryExternalData<T>>(
      application.externalData,
      externalDataId,
    )
    return existing?.status === 'success' ? existing.data : undefined
  })
  const [loading, setLoading] = useState(enabled)
  const [hasError, setHasError] = useState(false)
  const fetchedOnce = useRef(false)

  const fetchContent = useCallback(
    async ({ silent = false }: { silent?: boolean } = {}) => {
      if (!silent) setLoading(true)
      setHasError(false)
      try {
        const dataProviders = ensureDraft
          ? [
              {
                actionId: draftActionId(ApiActions.createSalaryDraft),
                order: 0,
              },
              { actionId, order: 1 },
            ]
          : [{ actionId, order: 0 }]

        const res = await updateApplicationExternalData({
          variables: {
            input: {
              id: application.id,
              dataProviders,
            },
            locale,
          },
        })
        const result = res.data?.updateApplicationExternalData.externalData?.[
          externalDataId
        ] as QueryExternalData<T> | undefined
        if (result?.status === 'success' && result.data) {
          setContent(result.data)
        } else {
          setHasError(true)
        }
      } catch {
        setHasError(true)
      } finally {
        if (!silent) setLoading(false)
      }
    },
    [
      actionId,
      application.id,
      ensureDraft,
      externalDataId,
      locale,
      updateApplicationExternalData,
    ],
  )

  // silent=true (e.g. from beforeSubmitCallback) avoids a loading flash while navigating away.
  const refetch = useCallback(
    (options?: { silent?: boolean }) => fetchContent(options),
    [fetchContent],
  )

  useEffect(() => {
    if (!enabled) return
    if (fetchedOnce.current) return
    fetchedOnce.current = true
    void fetchContent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { content, loading, hasError, refetch }
}
