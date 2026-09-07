import { useCallback, useRef } from 'react'
import { gql, useMutation } from '@apollo/client'
import type { Application } from '@island.is/application/types'
import { UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'
import { useLocale } from '@island.is/localization'
import { ApiActions, draftActionId } from './constants'

// Custom resolvers, not the standard updateApplicationExternalData provider
// mechanism — that only takes {actionId, order}, with no channel for an
// arbitrary content payload. Content goes straight to DMR, never through
// application.answers.
const UPDATE_EQUALITY_DRAFT_CONTENT = gql`
  mutation DirectorateOfEqualityUpdateEqualityDraftContent(
    $input: DirectorateOfEqualityUpdateEqualityDraftContentInput!
  ) {
    directorateOfEqualityUpdateEqualityDraftContent(input: $input)
  }
`

const EDIT_EQUALITY_CONTENT = gql`
  mutation DirectorateOfEqualityEditEqualityContent(
    $input: DirectorateOfEqualityEditEqualityContentInput!
  ) {
    directorateOfEqualityEditEqualityContent(input: $input)
  }
`

// Idempotent + awaitable: memoizes the in-flight/completed ensure-draft call
// so concurrent or repeat callers share one request instead of re-POSTing;
// clears on failure so a later retry can actually retry.
export const useEnsureEqualityDraft = (application: Application) => {
  const { locale } = useLocale()
  const [updateApplicationExternalData] = useMutation(
    UPDATE_APPLICATION_EXTERNAL_DATA,
  )
  const draftPromiseRef = useRef<Promise<void> | null>(null)

  return useCallback((): Promise<void> => {
    if (!draftPromiseRef.current) {
      draftPromiseRef.current = updateApplicationExternalData({
        variables: {
          input: {
            id: application.id,
            dataProviders: [
              {
                actionId: draftActionId(ApiActions.createEqualityDraft),
                order: 0,
              },
            ],
          },
          locale,
        },
      })
        .then(() => undefined)
        .catch((error) => {
          draftPromiseRef.current = null
          throw error
        })
    }
    return draftPromiseRef.current
  }, [application.id, locale, updateApplicationExternalData])
}

export const useEqualityContentPush = () => {
  const [updateDraftContent] = useMutation(UPDATE_EQUALITY_DRAFT_CONTENT)
  const [editContent] = useMutation(EDIT_EQUALITY_CONTENT)

  const pushDraftContent = useCallback(
    async (applicationId: string, equalityReportContent: string) => {
      await updateDraftContent({
        variables: { input: { applicationId, equalityReportContent } },
      })
    },
    [updateDraftContent],
  )

  const pushRetryContent = useCallback(
    async (applicationId: string, equalityReportContent: string) => {
      await editContent({
        variables: { input: { applicationId, equalityReportContent } },
      })
    },
    [editContent],
  )

  return { pushDraftContent, pushRetryContent }
}
