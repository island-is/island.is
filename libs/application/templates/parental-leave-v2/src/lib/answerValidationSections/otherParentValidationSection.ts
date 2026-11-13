import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { errorMessages } from '../messages'
import { buildError } from './utils'

/**
 * The other parent approves what the applicant asks of them, so the applicant
 * cannot be the other parent. `mapUserToRole` would otherwise let them approve
 * their own request.
 */
export const otherParentValidationSection = (
  newAnswer: unknown,
  application: Application,
) => {
  const otherParentId = getValueViaPath<string>(
    (newAnswer ?? {}) as Record<string, unknown>,
    'otherParentId',
  )

  if (
    typeof otherParentId === 'string' &&
    otherParentId.replace(/\D/g, '') === application.applicant
  ) {
    return buildError(
      errorMessages.otherParentIsApplicant,
      'otherParentId',
      'otherParentObj',
    )
  }

  return undefined
}
