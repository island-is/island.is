import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { Operator, UserInformation } from '../shared'

export const isLastReviewer = (
  reviewerNationalId: string,
  answers: FormValue,
  newBuyerOperator: Operator[],
) => {
  // 1. First check if any reviewer that is not the current user has not approved

  // Buyer
  const buyer = getValueViaPath(answers, 'buyer', {}) as UserInformation
  if (buyer.nationalId !== reviewerNationalId && !buyer.approved) {
    return false
  }

  // Buyer's operator
  const oldBuyerOperators = (
    getValueViaPath(answers, 'buyerOperator', []) as Operator[]
  ).filter(({ wasRemoved }) => wasRemoved !== 'true')
  const buyerOperatorHasNotApproved = oldBuyerOperators.find((operator) => {
    return operator.nationalId !== reviewerNationalId && !operator.approved
  })
  if (buyerOperatorHasNotApproved) {
    return false
  }

  // 2. Then check if user which is the last reviewer is a buyer and is adding more reviewers

  if (buyer.nationalId === reviewerNationalId) {
    // Check if buyerOperator did not change, then buyer is last reviewer
    if (newBuyerOperator === oldBuyerOperators) {
      return true
    }

    // Check if buyer added to buyerOperator, then buyer is not the last reviewer
    if (newBuyerOperator.length > oldBuyerOperators.length) {
      return false
    }

    //Check if buyer added (and removed) in buyerOperator, then buyer is not the last reviewer
    const newReviewer = newBuyerOperator.find((newReviewer) => {
      const sameReviewer = oldBuyerOperators.find(
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
