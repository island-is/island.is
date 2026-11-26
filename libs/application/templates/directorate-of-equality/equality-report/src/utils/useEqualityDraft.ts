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

/**
 * The plan being pushed, in whichever representation the applicant uploaded.
 *
 * A discriminated union rather than loose optional strings, so a caller cannot
 * express "PDF with no filename" or "both kinds at once" — the states DMR
 * rejects. The wire shape stays flat; this is only about making the invalid
 * combinations unrepresentable at the call site.
 *
 * A PDF is always sent by presigned key (see `uploadPlanPdf`). The API still
 * takes an inline base64 PDF, for tabs opened before the presigned path.
 */
export type EqualityContentPayload =
  | { kind: 'html'; base64: string }
  | { kind: 'pdfKey'; key: string; filename: string }

const toVariables = (
  applicationId: string,
  content: EqualityContentPayload,
) => ({
  input:
    content.kind === 'pdfKey'
      ? {
          applicationId,
          equalityReportPdfKey: content.key,
          equalityReportPdfFilename: content.filename,
        }
      : { applicationId, equalityReportContent: content.base64 },
})

const PRESIGN_EQUALITY_PLAN = gql`
  mutation DirectorateOfEqualityPresignEqualityPlan(
    $input: DirectorateOfEqualityPresignEqualityPlanInput!
  ) {
    directorateOfEqualityPresignEqualityPlan(input: $input) {
      url
      key
    }
  }
`

// Cap the presigned PUT so a stalled upload can't leave the screen busy.
const PLAN_UPLOAD_TIMEOUT_MS = 60_000

/** The presigned PUT to S3 failed; DMR never saw the file. */
export class PlanUploadError extends Error {}

export const useEqualityContentPush = () => {
  const [updateDraftContent] = useMutation(UPDATE_EQUALITY_DRAFT_CONTENT)
  const [editContent] = useMutation(EDIT_EQUALITY_CONTENT)
  const [presignPlan] = useMutation<{
    directorateOfEqualityPresignEqualityPlan: { url: string; key: string }
  }>(PRESIGN_EQUALITY_PLAN)

  /**
   * Puts the plan PDF on S3 and returns the key to push. The bytes never pass
   * through GraphQL, so the API's request-size limit doesn't apply. The key is
   * single use: push it once, and presign again for any later attempt.
   */
  const uploadPlanPdf = useCallback(
    async (applicationId: string, file: File): Promise<string> => {
      const { data } = await presignPlan({
        variables: { input: { applicationId } },
      })
      const presign = data?.directorateOfEqualityPresignEqualityPlan
      if (!presign?.url || !presign.key) {
        throw new PlanUploadError('No presigned URL for the plan')
      }

      // No auth header: the presigned URL is the capability.
      const controller = new AbortController()
      const timeout = setTimeout(
        () => controller.abort(),
        PLAN_UPLOAD_TIMEOUT_MS,
      )
      try {
        const response = await fetch(presign.url, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': 'application/pdf' },
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new PlanUploadError(`Plan upload failed: ${response.status}`)
        }
      } catch (error) {
        throw error instanceof PlanUploadError
          ? error
          : new PlanUploadError('Plan upload failed')
      } finally {
        clearTimeout(timeout)
      }

      return presign.key
    },
    [presignPlan],
  )

  const pushDraftContent = useCallback(
    async (applicationId: string, content: EqualityContentPayload) => {
      await updateDraftContent({
        variables: toVariables(applicationId, content),
      })
    },
    [updateDraftContent],
  )

  const pushRetryContent = useCallback(
    async (applicationId: string, content: EqualityContentPayload) => {
      await editContent({ variables: toVariables(applicationId, content) })
    },
    [editContent],
  )

  return { uploadPlanPdf, pushDraftContent, pushRetryContent }
}
