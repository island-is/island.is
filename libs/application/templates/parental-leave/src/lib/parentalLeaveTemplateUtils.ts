import { ApplicationContext } from '@island.is/application/core'
import { YES, NO } from '../constants'
import { SchemaFormValues } from './dataSchema'

export function hasEmployer(context: ApplicationContext) {
  const currentApplicationAnswers = context.application.answers as {
    employer: { isSelfEmployed: typeof YES | typeof NO }
  }

  return currentApplicationAnswers.employer.isSelfEmployed === NO
}

export function needsOtherParentApproval(context: ApplicationContext) {
  const currentApplicationAnswers = context.application
    .answers as SchemaFormValues

  return currentApplicationAnswers.requestRights.isRequestingRights === YES
}
