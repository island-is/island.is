import { FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { CoOwnerAndOperator, UserInformation } from '../shared'
import { isLastReviewer } from './isLastReviewer'

export const hasReviewerApproved = (
  reviewerNationalId: string,
  answers: FormValue,
) => {
  // Check if reviewer is buyer and has not approved
  if (
    (getValueViaPath(answers, 'buyer.nationalId', '') as string) ===
    reviewerNationalId
  ) {
    const buyer = getValueViaPath(answers, 'buyer') as UserInformation
    const hasApproved = buyer?.approved || false
    if (!hasApproved) return false
  }

  // Check if reviewer is buyers coowner or operator and has not approved
  const filteredBuyerCoOwnersAndOperators = (
    getValueViaPath(
      answers,
      'buyerCoOwnerAndOperator',
      [],
    ) as CoOwnerAndOperator[]
  ).filter(({ wasRemoved }) => wasRemoved !== 'true')
  const buyerCoOwnerAndOperator = filteredBuyerCoOwnersAndOperators.find(
    (coOwnerOrOperator) => coOwnerOrOperator.nationalId === reviewerNationalId,
  )
  if (buyerCoOwnerAndOperator) {
    const hasApproved = buyerCoOwnerAndOperator?.approved || false
    if (!hasApproved) return false
  }

  // Check if reviewer is sellers coowner and has not approved
  const sellerCoOwners = getValueViaPath(
    answers,
    'sellerCoOwner',
    [],
  ) as CoOwnerAndOperator[]
  const sellerCoOwner = sellerCoOwners.find(
    (coOwner) => coOwner.nationalId === reviewerNationalId,
  )
  if (sellerCoOwner) {
    const hasApproved = sellerCoOwner?.approved || false
    if (!hasApproved) return false
  }

  // Check if reviewer is seller and everyone else has approved
  if (
    (getValueViaPath(answers, 'seller.nationalId', '') as string) ===
      reviewerNationalId &&
    isLastReviewer(
      reviewerNationalId,
      answers,
      filteredBuyerCoOwnersAndOperators,
    )
  ) {
    return false
  }

  return true
}
