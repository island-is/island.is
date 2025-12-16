import { FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { CoOwnerAndOperator, UserInformation } from '../shared'

export const getReviewers = (
  answers: FormValue,
): { nationalId: string; name: string; hasApproved: boolean }[] => {
  const result: { nationalId: string; name: string; hasApproved: boolean }[] =
    []

  // Buyer
  const buyer = getValueViaPath<UserInformation>(answers, 'buyer')
  if (buyer?.nationalId)
    result.push({
      nationalId: buyer.nationalId,
      name: buyer.name,
      hasApproved: buyer.approved ?? false,
    })

  // Buyer's co-owner / Buyer's operator
  const buyerCoOwnersAndOperators = (
    getValueViaPath<CoOwnerAndOperator[]>(answers, 'buyerCoOwnerAndOperator') ||
    []
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
  const sellerCoOwners =
    getValueViaPath<CoOwnerAndOperator[]>(answers, 'sellerCoOwner') || []
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

export const getReviewerRole = (
  answers: FormValue,
  nationalId: string,
):
  | 'buyer'
  | 'buyerCoOwners'
  | 'buyerOperators'
  | 'sellerCoOwners'
  | undefined => {
  // Buyer
  const buyer = getValueViaPath<UserInformation>(answers, 'buyer')
  if (buyer?.nationalId === nationalId) return 'buyer'

  // Buyer's co-owner
  const buyerCoOwners = getValueViaPath<CoOwnerAndOperator[]>(
    answers,
    'buyerCoOwnerAndOperator',
  )?.filter(
    ({ wasRemoved, type }) => wasRemoved !== 'true' && type === 'coOwner',
  )
  if (buyerCoOwners?.map((x) => x.nationalId)?.includes(nationalId))
    return 'buyerCoOwners'

  // Buyer's operator
  const buyerOperators = getValueViaPath<CoOwnerAndOperator[]>(
    answers,
    'buyerCoOwnerAndOperator',
  )?.filter(
    ({ wasRemoved, type }) => wasRemoved !== 'true' && type === 'operator',
  )
  if (buyerOperators?.map((x) => x.nationalId)?.includes(nationalId))
    return 'buyerOperators'

  // Seller's co-owner
  const sellerCoOwners = getValueViaPath<CoOwnerAndOperator[]>(
    answers,
    'sellerCoOwner',
  )
  if (sellerCoOwners?.map((x) => x.nationalId)?.includes(nationalId))
    return 'sellerCoOwners'
}

export const hasReviewerApproved = (
  answers: FormValue,
  reviewerNationalId: string,
): boolean => {
  const reviewers = getReviewers(answers)

  const reviewer = reviewers.find((x) => x.nationalId === reviewerNationalId)

  return !!reviewer?.hasApproved
}

export const hasEveryReviewerApproved = (answers: FormValue): boolean => {
  const reviewers = getReviewers(answers)
  return reviewers.every((x) => x.hasApproved)
}
