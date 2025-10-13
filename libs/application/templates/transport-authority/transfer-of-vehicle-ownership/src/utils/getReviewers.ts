import { FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { CoOwnerAndOperator, UserInformation } from '../shared'

export const getReviewers = (
  answers: FormValue,
): { nationalId: string; name: string; hasApproved: boolean }[] => {
  const result: { nationalId: string; name: string; hasApproved: boolean }[] =
    []

  // Buyer
  const buyer = getValueViaPath(answers, 'buyer') as UserInformation
  if (buyer?.nationalId)
    result.push({
      nationalId: buyer.nationalId,
      name: buyer.name,
      hasApproved: buyer.approved ?? false,
    })

  // Buyer's co-owner / Buyer's operator
  const buyerCoOwnersAndOperators = (
    getValueViaPath(
      answers,
      'buyerCoOwnerAndOperator',
      [],
    ) as CoOwnerAndOperator[]
  ).filter(({ wasRemoved }) => wasRemoved !== 'true')
  buyerCoOwnersAndOperators.forEach((item) => {
    if (item?.nationalId)
      result.push({
        nationalId: item.nationalId,
        name: item.name ?? '',
        hasApproved: item.approved ?? false,
      })
  })

  // Seller's co-owner
  const sellerCoOwners = getValueViaPath(
    answers,
    'sellerCoOwner',
    [],
  ) as CoOwnerAndOperator[]
  sellerCoOwners.forEach((item) => {
    if (item?.nationalId)
      result.push({
        nationalId: item.nationalId,
        name: item.name ?? '',
        hasApproved: item.approved ?? false,
      })
  })

  return result
}
