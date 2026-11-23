import {
  ApplicationContext,
  DataProviderResult,
  ExternalData,
} from '@island.is/application/types'
import { DeliveryStatus, SubmitApplicationResult } from '../lib/types'
import { SUBMIT_RESULT_ID } from './constants'

const getSubmitResult = (
  externalData: ExternalData | undefined,
): DataProviderResult | undefined => externalData?.[SUBMIT_RESULT_ID]

/** Undefined when the last submit failed or never ran. */
export const getSubmitData = (
  externalData: ExternalData | undefined,
): SubmitApplicationResult | undefined => {
  const result = getSubmitResult(externalData)
  if (result?.status !== 'success' || !result.data) {
    return undefined
  }
  return result.data as SubmitApplicationResult
}

const getDeliveryStatus = (externalData: ExternalData | undefined) =>
  getSubmitData(externalData)?.deliveryStatus

/**
 * The template-api module answers 409 only for `preview_changed`; every other
 * failure, a 409 for a reused idempotency key included, has another status.
 */
export const submitFailedWithPreviewChanged = (
  externalData: ExternalData | undefined,
) => {
  const result = getSubmitResult(externalData)
  return result?.status === 'failure' && result.statusCode === 409
}

export const isSentToMailbox = ({ application }: ApplicationContext) =>
  getDeliveryStatus(application.externalData) === DeliveryStatus.SENT_TO_MAILBOX

export const isClosed = ({ application }: ApplicationContext) =>
  getDeliveryStatus(application.externalData) === DeliveryStatus.CLOSED

/**
 * Any other accepted request with a case ID counts as processing, also an
 * unknown status, so it is never offered for resubmission.
 */
export const isAcceptedForProcessing = ({ application }: ApplicationContext) =>
  !!getSubmitData(application.externalData)?.caseId

export const canGoBackToHistory = ({ application }: ApplicationContext) =>
  submitFailedWithPreviewChanged(application.externalData)
