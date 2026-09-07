import type { ApolloError } from '@apollo/client'
import {
  getErrorReasonIfPresent,
  isProviderErrorReason,
} from '@island.is/application/core'
import { findProblemInApolloError } from '@island.is/shared/problem'

// When a post-payment submit fails, return the structured provider error reason
// (title + summary) to surface to the applicant, or null when there is nothing
// user-facing to show or the feature is disabled. Pure, so it can be unit-tested
// without rendering the component.
export const getSubmitErrorReasonToToast = (
  submitError: ApolloError | undefined,
  enabled: boolean,
) => {
  if (!enabled || !submitError) {
    return null
  }
  const problem = findProblemInApolloError(submitError)
  if (
    problem &&
    'errorReason' in problem &&
    isProviderErrorReason(problem.errorReason)
  ) {
    return getErrorReasonIfPresent(problem.errorReason)
  }
  return null
}

export const getRedirectUrl = (paymentUrl: string) => {
  const returnUrl = window.document.location.href + '?done'
  return `${paymentUrl}&returnURL=${encodeURIComponent(returnUrl)}`
}

export const isComingFromRedirect = () => {
  const params = new URLSearchParams(window.document.location.search)
  return params.has('done') || params.has('cancelled') || params.has('invoice')
}

// Is it done or cancelled?
export const getRedirectStatus = () => {
  const params = new URLSearchParams(window.document.location.search)
  if (params.has('done')) return 'done'
  if (params.has('cancelled')) return 'cancelled'
  if (params.has('invoice')) return 'invoice'
  return undefined
}

export const removeCancelledfromHref = () => {
  const href = window.document.location.href
  window.history.replaceState({}, '', href.replace('?cancelled', ''))
}
