import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { CoOwnerAndOperator } from '../shared'

export const getApproveAnswers = (
  reviewerNationalId: string,
  answers: FormValue,
) => {
  const returnAnswers = {}
  // If reviewer is buyer
  if (
    (getValueViaPath(answers, 'buyer.nationalId', '') as string) ===
      reviewerNationalId &&
    (getValueViaPath(answers, 'buyer.approved', undefined) as
      | boolean
      | undefined) === undefined
  ) {
    Object.assign(returnAnswers, {
      buyer: {
        nationalId: getValueViaPath(answers, 'buyer.nationalId', '') as string,
        name: getValueViaPath(answers, 'buyer.name', '') as string,
        email: getValueViaPath(answers, 'buyer.email', '') as string,
        phone: getValueViaPath(answers, 'buyer.phone', '') as string,
        approved: true,
      },
    })
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
  if (
    buyerCoOwnerAndOperator &&
    buyerCoOwnerAndOperator.approved === undefined
  ) {
    Object.assign(returnAnswers, {
      buyerCoOwnerAndOperator: buyerCoOwnersAndOperators.map(
        (coOwnerOrOperator) => {
          return {
            nationalId: coOwnerOrOperator.nationalId,
            name: coOwnerOrOperator.name,
            email: coOwnerOrOperator.email,
            phone: coOwnerOrOperator.phone,
            type: coOwnerOrOperator.type,
            approved:
              coOwnerOrOperator.nationalId === reviewerNationalId
                ? true
                : coOwnerOrOperator.approved || false,
          }
        },
      ),
    })
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
  if (sellerCoOwner && sellerCoOwner.approved === undefined) {
    Object.assign(returnAnswers, {
      sellerCoOwner: sellerCoOwners.map((coOwner) => {
        return {
          nationalId: coOwner.nationalId,
          name: coOwner.name,
          email: coOwner.email,
          phone: coOwner.phone,
          type: coOwner.type,
          approved:
            coOwner.nationalId === reviewerNationalId
              ? true
              : coOwner.approved || false,
        }
      }),
    })
  }

  return returnAnswers
}
