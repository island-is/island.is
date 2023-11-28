import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { Operator } from '../shared'

export type ApproveAnswersProps = {
  buyer: {
    nationalId: string
    name: string
    email: string
    phone: string
    approved: boolean
  }
  buyerOperator: {
    nationalId: string
    name: string
    email: string
    phone: string
    wasRemoved: string
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

  // If reviewer is buyers operator
  const buyerOperators = getValueViaPath(
    answers,
    'buyerOperator',
    [],
  ) as Operator[]
  const buyerOperator = buyerOperators
    .filter(({ wasRemoved }) => wasRemoved !== 'true')
    .find((operator) => operator.nationalId === reviewerNationalId)
  if (
    buyerOperator &&
    (buyerOperator.approved === undefined || buyerOperator.approved === false)
  ) {
    Object.assign(returnAnswers, {
      buyerOperator: buyerOperators.map((operator) => {
        return {
          nationalId: operator.nationalId,
          name: operator.name,
          email: operator.email,
          phone: operator.phone,
          wasRemoved: operator.wasRemoved,
          approved:
            operator.nationalId === reviewerNationalId
              ? true
              : operator.approved || false,
        }
      }),
    })
  }

  return returnAnswers
}
