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
// application.externalData). DMR is called only on mount when that key is
// missing (or ensureDraft), and after a sync to pre-warm the next screen.
export const useDraftQuery = <T>(
  application: Application,
  actionId: string,
  externalDataId: string,
  { ensureDraft = false }: { ensureDraft?: boolean } = {},
) => {
  const { lang: locale } = useLocale()
  const [updateApplicationExternalData] = useMutation(
    UPDATE_APPLICATION_EXTERNAL_DATA,
  )

  const [content, setContent] = useState<T | undefined>(() => {
    const existing = getValueViaPath<QueryExternalData<T>>(
      application.externalData,
      externalDataId,
    )
    return existing?.status === 'success' ? existing.data : undefined
  })
  const [loading, setLoading] = useState(ensureDraft || !content)
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
    if (fetchedOnce.current) return
    if (content && !ensureDraft) return
    fetchedOnce.current = true
    void fetchContent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { content, loading, hasError, refetch }
}
