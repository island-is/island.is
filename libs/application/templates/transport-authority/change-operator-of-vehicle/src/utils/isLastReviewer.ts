import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { OperatorInformation, UserInformation } from '../shared'

// Function to check if a reviewer has pending approval
export const hasPendingApproval = (
  answers: FormValue,
  excludeNationalId?: string,
): boolean => {
  // Check if any co-owners have not approved
  const coOwners = getValueViaPath(
    answers,
    'ownerCoOwner',
    [],
  ) as UserInformation[]
  if (
    coOwners.some(
      ({ nationalId, approved }) =>
        (!excludeNationalId || nationalId !== excludeNationalId) && !approved,
    )
  ) {
    return true
  }

  // Check if any new operators have not approved
  const newOperators = (
    getValueViaPath(answers, 'operators', []) as OperatorInformation[]
  ).filter(({ wasRemoved }) => wasRemoved !== 'true')
  if (
    newOperators.some(
      ({ nationalId, approved }) =>
        (!excludeNationalId || nationalId !== excludeNationalId) && !approved,
    )
  ) {
    return true
  }

  return false
}

// Function to check if the current reviewer is the last one who needs to approve
export const isLastReviewer = (
  reviewerNationalId: string,
  answers: FormValue,
): boolean => {
  // If there are pending approvals (excluding current reviewer), then he is not the last reviewer
  if (hasPendingApproval(answers, reviewerNationalId)) return false

  // Otherwise, the only review missing is from the current reviewer
  return true
}
