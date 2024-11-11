import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { OwnerCoOwnersInformation, CoOwnersInformation } from '../shared'

// Function to check if a reviewer has pending approval
export const hasPendingApproval = (
  answers: FormValue,
  excludeNationalId?: string,
): boolean => {
  // Check if any old co-owners have not approved
  const oldCoOwners = getValueViaPath(
    answers,
    'ownerCoOwners',
    [],
  ) as OwnerCoOwnersInformation[]
  if (
    oldCoOwners.some(
      ({ nationalId, approved }) =>
        (!excludeNationalId || nationalId !== excludeNationalId) && !approved,
    )
  ) {
    return true
  }

  // Check if any new co-owners have not approved
  const newCoOwners = (
    getValueViaPath(answers, 'coOwners', []) as CoOwnersInformation[]
  ).filter(({ wasRemoved }) => wasRemoved !== 'true')
  if (
    newCoOwners.some(
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
