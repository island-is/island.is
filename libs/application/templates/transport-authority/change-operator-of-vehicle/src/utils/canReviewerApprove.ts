import { FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { OperatorInformation, UserInformation } from '../shared'
import { hasPendingApproval } from './isLastReviewer'

// Function to check if the reviewer is authorized to approve and hasn't done that yet
export const canReviewerApprove = (
  reviewerNationalId: string,
  answers: FormValue,
): boolean => {
  // Check if reviewer is co-owner and has not approved
  const coOwners = getValueViaPath(
    answers,
    'ownerCoOwner',
    [],
  ) as UserInformation[]
  if (
    coOwners.some(
      ({ nationalId, approved }) =>
        nationalId === reviewerNationalId && !approved,
    )
  ) {
    return true
  }

  // Check if reviewer is new operator and has not approved
  const newOperators = (
    getValueViaPath(answers, 'operators', []) as OperatorInformation[]
  ).filter(({ wasRemoved }) => wasRemoved !== 'true')
  if (
    newOperators.some(
      ({ nationalId, approved }) =>
        nationalId === reviewerNationalId && !approved,
    )
  ) {
    return true
  }

  return false
}

// Special case to allow any reviewer to trigger an external API call to complete owner change
// Necessary when approve is updated in answers, but application is still stuck in REVIEW state
// then any user can try to 'push' the application to the next state
export const canReviewerReApprove = (
  reviewerNationalId: string,
  answers: FormValue,
): boolean => {
  const coOwners = getValueViaPath(
    answers,
    'ownerCoOwner',
    [],
  ) as UserInformation[]
  const newOperators = (
    getValueViaPath(answers, 'operators', []) as OperatorInformation[]
  ).filter(({ wasRemoved }) => wasRemoved !== 'true')

  const isReviewerAuthorized = [
    coOwners.some(({ nationalId }) => nationalId === reviewerNationalId),
    newOperators.some(({ nationalId }) => nationalId === reviewerNationalId),
  ].some(Boolean)

  // Check if the reviewer is authorized and if all required approvals have been completed
  return isReviewerAuthorized && !hasPendingApproval(answers)
}
