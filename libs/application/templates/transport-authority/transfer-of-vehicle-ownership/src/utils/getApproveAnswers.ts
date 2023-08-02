import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { CoOwnerAndOperator } from '../shared'

export type ApproveAnswersProps = {
  buyer: {
    nationalId: string
    name: string
    email: string
    phone: string
    approved: boolean
  }
  buyerCoOwnerAndOperator: {
    nationalId: string
    name: string
    email: string
    phone: string
    type: string
    wasRemoved: string
    approved: boolean
  }[]
  sellerCoOwner: {
    nationalId: string
    name: string
    email: string
    phone: string
    type: string
    approved: boolean
  }[]
}

export const getApproveAnswers = (
  reviewerNationalId: string,
  answers: FormValue,
) => {
  const returnAnswers = {}
  // If reviewer is buyer
  const buyerNationalId = getValueViaPath(
    answers,
    'buyer.nationalId',
    '',
  ) as string
  const buyerApproved = getValueViaPath(
    answers,
    'buyer.approved',
    undefined,
  ) as boolean | undefined
  if (
    buyerNationalId === reviewerNationalId &&
    (buyerApproved === undefined || buyerApproved === false)
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
  const buyerCoOwnerAndOperator = buyerCoOwnersAndOperators
    .filter(({ wasRemoved }) => wasRemoved !== 'true')
    .find(
      (coOwnerOrOperator) =>
        coOwnerOrOperator.nationalId === reviewerNationalId,
    )
  if (
    buyerCoOwnerAndOperator &&
    (buyerCoOwnerAndOperator.approved === undefined ||
      buyerCoOwnerAndOperator.approved === false)
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
            wasRemoved: coOwnerOrOperator.wasRemoved,
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
  if (
    sellerCoOwner &&
    (sellerCoOwner.approved === undefined || sellerCoOwner.approved === false)
  ) {
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
