import type { ApolloError } from '@apollo/client'
import { findProblemInApolloError } from '@island.is/shared/problem'

import { m } from './messages'

/** Must match `DelegationRequestError` in `@island.is/auth-api-lib`. */
const errorMessages: Record<string, typeof m.requestError> = {
  DELEGATION_REQUEST_TOO_MANY_PENDING: m.requestTooManyPendingError,
  DELEGATION_REQUEST_BLOCKED: m.requestBlockedError,
  DELEGATION_REQUEST_RATE_LIMITED: m.requestRateLimitedError,
  DELEGATION_REQUEST_GRANTOR_RATE_LIMITED: m.requestGrantorRateLimitedError,
  DELEGATION_REQUEST_DUPLICATE_PENDING: m.requestDuplicatePendingError,
}

export const getRequestLimitMessage = (code?: string | null) =>
  (code && errorMessages[code]) || m.requestError

export const getCreateRequestErrorMessage = (error: unknown) =>
  getRequestLimitMessage(
    findProblemInApolloError(error as ApolloError | undefined)?.detail,
  )
