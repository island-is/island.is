import type { ApolloError } from '@apollo/client'
import { findProblemInApolloError } from '@island.is/shared/problem'

import { m } from './messages'

/** Must match `DelegationRequestError` in `@island.is/auth-api-lib`. */
const errorMessages: Record<string, typeof m.requestError> = {
  DELEGATION_REQUEST_TOO_MANY_PENDING: m.requestTooManyPendingError,
  DELEGATION_REQUEST_BLOCKED: m.requestBlockedError,
  DELEGATION_REQUEST_RATE_LIMITED: m.requestRateLimitedError,
}

export const getCreateRequestErrorMessage = (error: unknown) => {
  const problem = findProblemInApolloError(error as ApolloError | undefined)
  return (problem?.detail && errorMessages[problem.detail]) ?? m.requestError
}
