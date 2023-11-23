import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { CoOwnerAndOperator, Rejecter, UserInformation } from '../shared'

export const getRejecter = (reviewerNationalId: string, answers: FormValue) => {
  const plate = getValueViaPath(answers, 'pickVehicle.plate', '') as string
  const buyer = getValueViaPath(answers, 'buyer') as UserInformation

  if (buyer && buyer.nationalId === reviewerNationalId) {
    return {
      plate,
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
      plate,
      name: buyerCoOwnerAndOperator.name,
      nationalId: buyerCoOwnerAndOperator.nationalId,
      type:
        buyerCoOwnerAndOperator.type === 'operator'
          ? 'operator'
          : 'buyerCoOwner',
    } as Rejecter
  }

  const sellerCoOwners = getValueViaPath(
    answers,
    'sellerCoOwner',
    [],
  ) as CoOwnerAndOperator[]
  const sellerCoOwner = sellerCoOwners.find(
    (coOwner) => coOwner.nationalId === reviewerNationalId,
  )
  if (sellerCoOwner) {
    return {
      plate,
      name: sellerCoOwner.name,
      nationalId: sellerCoOwner.nationalId,
      type: 'sellerCoOwner',
    } as Rejecter
  }

  return undefined
}
