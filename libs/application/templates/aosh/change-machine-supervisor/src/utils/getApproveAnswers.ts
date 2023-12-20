import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { Operator } from '../shared'
export const getApproveAnswers = (
  reviewerNationalId: string,
  answers: FormValue,
  buyerOperator: Operator,
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
    Object.assign(returnAnswers, {
      buyerOperator: {
        ...buyerOperator,
        wasRemoved: buyerOperator.nationalId ? 'false' : 'true',
        approved: buyerOperator.nationalId ? true : null,
      },
    })
  }

  return returnAnswers
}
