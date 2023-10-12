import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { CoOwnerAndOperator, UserInformation } from '../shared'

export const isLastReviewer = (
  reviewerNationalId: string,
  answers: FormValue,
  newBuyerCoOwnerAndOperator: CoOwnerAndOperator[],
) => {
  // 1. First check if any reviewer that is not the current user has not approved

  // Buyer
  const buyer = getValueViaPath(answers, 'buyer', {}) as UserInformation
  if (buyer.nationalId !== reviewerNationalId && !buyer.approved) {
    return false
  }

  // Buyer's co-owner / Buyer's operator
  const oldBuyerCoOwnersAndOperators = (
    getValueViaPath(
      answers,
      'buyerCoOwnerAndOperator',
      [],
    ) as CoOwnerAndOperator[]
  ).filter(({ wasRemoved }) => wasRemoved !== 'true')
  const buyerCoOwnerAndOperatorHasNotApproved =
    oldBuyerCoOwnersAndOperators.find((coOwnerOrOperator) => {
      return (
        coOwnerOrOperator.nationalId !== reviewerNationalId &&
        !coOwnerOrOperator.approved
      )
    })
  if (buyerCoOwnerAndOperatorHasNotApproved) {
    return false
  }

  // Seller's co-owner
  const sellerCoOwners = getValueViaPath(
    answers,
    'sellerCoOwner',
    [],
  ) as CoOwnerAndOperator[]
  const sellerCoOwnerNotApproved = sellerCoOwners.find(
    (coOwner) => coOwner.nationalId !== reviewerNationalId && !coOwner.approved,
  )
  if (sellerCoOwnerNotApproved) {
    return false
  }

  // 2. Then check if user which is the last reviewer is a buyer and is adding more reviewers

  if (buyer.nationalId === reviewerNationalId) {
    // Check if buyerCoOwnerAndOperator did not change, then buyer is last reviewer
    if (newBuyerCoOwnerAndOperator === oldBuyerCoOwnersAndOperators) {
      return true
    }

    // Check if buyer added to buyerCoOwnerAndOperator, then buyer is not the last reviewer
    if (
      newBuyerCoOwnerAndOperator.length > oldBuyerCoOwnersAndOperators.length
    ) {
      return false
    }

    //Check if buyer added (and removed) in buyerCoOwnerAndOperator, then buyer is not the last reviewer
    const newReviewer = newBuyerCoOwnerAndOperator.find((newReviewer) => {
      const sameReviewer = oldBuyerCoOwnersAndOperators.find(
        (oldReviewer) => oldReviewer.nationalId === newReviewer.nationalId,
      )
      return !sameReviewer
    })
    if (newReviewer) {
      return false
    }
  }

  return true
}
