import { ApolloError } from '@apollo/client'
import * as Sentry from '@sentry/react'
import { coreMessages, MessageFormatter } from '@island.is/application/core'
import { findProblemInApolloError } from '@island.is/shared/problem'
import { toast } from '@island.is/island-ui/core'

export function handleServerError(
  error: ApolloError,
  formatMessage: MessageFormatter,
): void {
  const problem = findProblemInApolloError(error)
  const message = problem ? problem.detail ?? problem.title : error.message
  toast.error(
    formatMessage(coreMessages.updateOrSubmitError, { error: message }),
  )
  Sentry.captureException(error, {
    extra: { problem },
    level: Sentry.Severity.Warning,
  })
}
