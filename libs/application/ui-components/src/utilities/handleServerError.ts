import { ApolloError } from '@apollo/client'
import { coreMessages } from '@island.is/application/core'

import { toast } from '@island.is/island-ui/core'
import { FormatMessage } from '@island.is/localization'

export function handleServerError(
  error: ApolloError,
  formatMessage: FormatMessage,
): void {
  const problem = findProblemInApolloError(error)
  const message = problem ? problem.detail ?? problem.title : error.message

  if (problem) {
    if ('errorReason' in problem) {
      const { title, summary } = getErrorReasonIfPresent(problem.errorReason)
      const message = `${formatMessage(title)}: ${formatMessage(summary)}`
      toast.error(message)
    }
    return
  }

  toast.error(
    formatMessage(coreMessages.updateOrSubmitError, { error: message }),
  )
  console.error(error, problem)
}
