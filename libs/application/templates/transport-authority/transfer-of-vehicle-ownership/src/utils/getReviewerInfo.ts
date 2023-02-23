import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { UserInformation, CoOwnerAndOperator } from '../shared'

export const getReviewerInfo = (
  reviewerNationalId: string,
  answers: FormValue,
) => {
  // If reviewer is buyer
  if (
    (getValueViaPath(answers, 'buyer.nationalId', '') as string) ===
    reviewerNationalId
  ) {
    return getValueViaPath(answers, 'buyer') as UserInformation
  }

  // If reviewer is buyers coowner or operator
  const buyerCoOwnersAndOperators = getValueViaPath(
    answers,
    'buyerCoOwnerAndOperator',
    [],
  ) as CoOwnerAndOperator[]
  const buyerCoOwnerAndOperator = buyerCoOwnersAndOperators.find(
    (coOwnerOrOperator) => coOwnerOrOperator.nationalId === reviewerNationalId,
  )
  if (buyerCoOwnerAndOperator) {
    return buyerCoOwnerAndOperator
  }

  // If reviewer is sellers coowner
  const sellerCoOwners = getValueViaPath(
    answers,
    'sellerCoOwner',
    [],
  ) as CoOwnerAndOperator[]
  const sellerCoOwner = sellerCoOwners.find(
    (coOwner) => coOwner.nationalId === reviewerNationalId,
  )
  if (sellerCoOwner) {
    return sellerCoOwner
  }

  return null
}
