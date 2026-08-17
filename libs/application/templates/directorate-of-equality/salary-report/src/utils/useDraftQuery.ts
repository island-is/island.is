import { useCallback, useEffect, useRef, useState } from 'react'
import { useMutation } from '@apollo/client'
import { getValueViaPath } from '@island.is/application/core'
import { UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'
import type { Application } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'

type QueryExternalData<T> = {
  status?: 'success' | 'failure'
  data?: T
}

// Generic replacement for the deleted aggregated `useDraftContent` hook. Each
// screen now reads its own narrower, screen-specific externalData key
// (`externalDataId`) via its own `actionId`, rather than every screen sharing
// one big `salaryDraftContent` key. Because each screen owns its own key,
// its own `refetch` writing into that key already lands in
// `application.externalData` via the mutation response — a plain
// externalData-read-on-mount is sufficient, so (unlike the deleted hook)
// no module-level cross-screen cache is needed here.
//
// DMR calls only happen when a screen actually needs fresh content: on
// mount, if `application.externalData[externalDataId]` isn't already
// present (or `ensureDraft` is set — used only by the one screen that also
// needs to create the draft first), and again whenever the screen calls
// `refetch` after its own sync, to pre-warm the next screen's externalData.
export const useDraftQuery = <T,>(
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
                actionId: 'DirectorateOfEquality.createSalaryDraft',
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
    [actionId, application.id, ensureDraft, externalDataId, locale, updateApplicationExternalData],
  )

  // Public refetch — used by screens after their sync to pre-warm the
  // externalData for the next screen. Pass silent=true from
  // beforeSubmitCallback so the current screen doesn't flash a loading
  // state while navigating away.
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
