import { ApolloError } from '@apollo/client'
import { coreMessages } from '@island.is/application/core'
import { findProblemInApolloError } from '@island.is/shared/problem'
import { toast } from '@island.is/island-ui/core'
import { FormatMessage } from '@island.is/localization'

export function handleServerError(
  error: ApolloError,
  formatMessage: FormatMessage,
): void {
  const problem = findProblemInApolloError(error)
  const message = problem ? problem.detail ?? problem.title : error.message
  toast.error(
    formatMessage(coreMessages.updateOrSubmitError, { error: message }),
  )
  console.error(error, problem)
}
