import { FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { CoOwnersInformation, OwnerCoOwnersInformation } from '../shared'
import { hasPendingApproval } from './isLastReviewer'

// Function to check if the reviewer is authorized to approve and hasn't done that yet
export const canReviewerApprove = (
  reviewerNationalId: string,
  answers: FormValue,
): boolean => {
  // Check if reviewer is old co-owner and has not approved
  const oldCoOwners = getValueViaPath(
    answers,
    'ownerCoOwners',
    [],
  ) as OwnerCoOwnersInformation[]
  if (
    oldCoOwners.some(
      ({ nationalId, approved }) =>
        nationalId === reviewerNationalId && !approved,
    )
  ) {
    return true
  }

  // Check if reviewer is new co-owner and has not approved
  const newCoOwners = (
    getValueViaPath(answers, 'coOwners', []) as CoOwnersInformation[]
  ).filter(({ wasRemoved }) => wasRemoved !== 'true')
  if (
    newCoOwners.some(
      ({ nationalId, approved }) =>
        nationalId === reviewerNationalId && !approved,
    )
  ) {
    return true
  }

  return false
}

// Special case to allow any reviewer to trigger an external API call to complete co-owner change
// Necessary when approve is updated in answers, but application is still stuck in REVIEW state
// then any user can try to 'push' the application to the next state
export const canReviewerReApprove = (
  reviewerNationalId: string,
  answers: FormValue,
): boolean => {
  const oldCoOwners = getValueViaPath(
    answers,
    'ownerCoOwners',
    [],
  ) as OwnerCoOwnersInformation[]
  const newCoOwners = (
    getValueViaPath(answers, 'coOwners', []) as CoOwnersInformation[]
  ).filter(({ wasRemoved }) => wasRemoved !== 'true')

  const isReviewerAuthorized = [
    oldCoOwners.some(({ nationalId }) => nationalId === reviewerNationalId),
    newCoOwners.some(({ nationalId }) => nationalId === reviewerNationalId),
  ].some(Boolean)

  // Check if the reviewer is authorized and if all required approvals have been completed
  return isReviewerAuthorized && !hasPendingApproval(answers)
}
