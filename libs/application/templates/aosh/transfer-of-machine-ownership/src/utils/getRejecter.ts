import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { CoOwnerAndOperator, Rejecter, UserInformation } from '../shared'

export const getRejecter = (reviewerNationalId: string, answers: FormValue) => {
  try {
    const id = getValueViaPath(answers, 'pickMachine.id', '') as string
    const buyer = getValueViaPath(answers, 'buyer') as UserInformation

    if (buyer && buyer.nationalId === reviewerNationalId) {
      return {
        regNumber: id,
        name: buyer.name,
        nationalId: buyer.nationalId,
        type: 'buyer',
      } as Rejecter
    }

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
    if (buyerCoOwnerAndOperator) {
      return {
        regNumber: id,
        name: buyerCoOwnerAndOperator.name,
        nationalId: buyerCoOwnerAndOperator.nationalId,
        type: buyerCoOwnerAndOperator.type,
      } as Rejecter
    }
  } catch (error) {
    console.log('getRejector ERROR', error)
  }

  return undefined
}
