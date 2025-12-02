import { FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { UserInformation } from '../shared'

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

  return result
}

export const hasReviewerApproved = (
  answers: FormValue,
  reviewerNationalId: string,
): boolean => {
  const reviewers = getReviewers(answers)

  const reviewer = reviewers.find((x) => x.nationalId === reviewerNationalId)

  return !!reviewer?.hasApproved
}
