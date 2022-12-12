import { FormValue } from '@island.is/application/types'
import { getReviewerInfo } from './getReviewerInfo'

export const hasReviewerApproved = (
  reviewerNationalId: string,
  answers: FormValue,
) => {
  const reviewer = getReviewerInfo(reviewerNationalId, answers)

  return reviewer ? reviewer.approved || false : true
}
