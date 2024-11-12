import { FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { CoOwnerAndOperator, UserInformation } from '../shared'
import { hasPendingApproval } from './isLastReviewer'

// Function to check if the reviewer is authorized to approve and hasn't done that yet
export const canReviewerApprove = (
  reviewerNationalId: string,
  answers: FormValue,
): boolean => {
  // Check if reviewer is buyer and has not approved
  const buyer = getValueViaPath(answers, 'buyer') as UserInformation
  if (buyer?.nationalId === reviewerNationalId && !buyer.approved) {
    return true
  }

  // Check if reviewer is buyer's co-owner or operator and has not approved
  const buyerCoOwnersAndOperators = (
    getValueViaPath(
      answers,
      'buyerCoOwnerAndOperator',
      [],
    ) as CoOwnerAndOperator[]
  ).filter(({ wasRemoved }) => wasRemoved !== 'true')
  if (
    buyerCoOwnersAndOperators.some(
      ({ nationalId, approved }) =>
        nationalId === reviewerNationalId && !approved,
    )
  ) {
    return true
  }

  // Check if reviewer is seller's co-owner and has not approved
  const sellerCoOwners = getValueViaPath(
    answers,
    'sellerCoOwner',
    [],
  ) as CoOwnerAndOperator[]
  if (
    sellerCoOwners.some(
      ({ nationalId, approved }) =>
        nationalId === reviewerNationalId && !approved,
    )
  ) {
    return true
  }

  return false
}

// Special case to allow seller (or any reviewer) to trigger an external API call to complete owner change
// Necessary when approve is updated in answers, but application is still stuck in REVIEW state
// then any user can try to 'push' the application to the next state
export const canReviewerReApprove = (
  reviewerNationalId: string,
  answers: FormValue,
): boolean => {
  const sellerNationalId = getValueViaPath(
    answers,
    'seller.nationalId',
    '',
  ) as string
  const buyerNationalId = getValueViaPath(
    answers,
    'buyer.nationalId',
    '',
  ) as string
  const buyerCoOwnersAndOperators = (
    getValueViaPath(
      answers,
      'buyerCoOwnerAndOperator',
      [],
    ) as CoOwnerAndOperator[]
  ).filter(({ wasRemoved }) => wasRemoved !== 'true')
  const sellerCoOwners = getValueViaPath(
    answers,
    'sellerCoOwner',
    [],
  ) as CoOwnerAndOperator[]

  const isReviewerAuthorized = [
    sellerNationalId === reviewerNationalId,
    buyerNationalId === reviewerNationalId,
    buyerCoOwnersAndOperators.some(
      ({ nationalId }) => nationalId === reviewerNationalId,
    ),
    sellerCoOwners.some(({ nationalId }) => nationalId === reviewerNationalId),
  ].some(Boolean)

  // Check if the reviewer is authorized and if all required approvals have been completed
  return isReviewerAuthorized && !hasPendingApproval(answers)
}
