import { FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { Operator, UserInformation } from '../shared'
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

  // Check if reviewer is buyers operator and has not approved
  const filteredBuyerOperators = (
    getValueViaPath(answers, 'buyerOperator', []) as Operator[]
  ).filter(({ wasRemoved }) => wasRemoved !== 'true')
  const buyerOperator = filteredBuyerOperators.find(
    (operator) => operator.nationalId === reviewerNationalId,
  )
  if (buyerOperator) {
    const hasApproved = buyerOperator?.approved || false
    if (!hasApproved) return false
  }

  // Check if reviewer is seller and everyone else has approved
  if (
    (getValueViaPath(answers, 'seller.nationalId', '') as string) ===
      reviewerNationalId &&
    isLastReviewer(reviewerNationalId, answers, filteredBuyerOperators)
  ) {
    return false
  }

  return true
}
