import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { CoOwnerAndOperator, UserInformation } from '../shared'

export const isLastReviewer = (
  reviewerNationalId: string,
  answers: FormValue,
  coOwnersAndOperators: CoOwnerAndOperator[],
) => {
  // First check if any reviewer that is not the current user has not approved
  const buyer = getValueViaPath(answers, 'buyer', {}) as UserInformation
  if (buyer.nationalId !== reviewerNationalId && !buyer.approved) {
    return false
  }

  const buyerCoOwnersAndOperators = getValueViaPath(
    answers,
    'buyerCoOwnerAndOperator',
    [],
  ) as CoOwnerAndOperator[]
  const approvedBuyerCoOwnerAndOperator = buyerCoOwnersAndOperators.find(
    (coOwnerOrOperator) => {
      return (
        coOwnerOrOperator.nationalId !== reviewerNationalId &&
        !coOwnerOrOperator.approved
      )
    },
  )
  if (approvedBuyerCoOwnerAndOperator) {
    return false
  }

  const sellerCoOwners = getValueViaPath(
    answers,
    'sellerCoOwner',
    [],
  ) as CoOwnerAndOperator[]
  const approvedSellerCoOwner = sellerCoOwners.find(
    (coOwner) => coOwner.nationalId !== reviewerNationalId && !coOwner.approved,
  )
  if (approvedSellerCoOwner) {
    return false
  }

  // Then check if user which is the last reviewer is a buyer and is adding more reviewers
  if (buyer.nationalId === reviewerNationalId) {
    if (coOwnersAndOperators === buyerCoOwnersAndOperators) {
      return true
    }
    if (coOwnersAndOperators.length > buyerCoOwnersAndOperators.length) {
      return false
    }
    if (
      coOwnersAndOperators.find((reviewer) => {
        const sameReviewer = buyerCoOwnersAndOperators.find(
          (oldReviewer) => oldReviewer === reviewer,
        )
        return !sameReviewer
      })
    ) {
      return false
    }
  }

  return true
}
