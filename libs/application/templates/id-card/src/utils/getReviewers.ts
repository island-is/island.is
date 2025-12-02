import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const getReviewers = (
  answers: FormValue,
): { nationalId: string; name: string; hasApproved: boolean }[] => {
  const result: { nationalId: string; name: string; hasApproved: boolean }[] =
    []

  // Second guardian
  const secondGuardianNationalId = getValueViaPath<string>(
    answers,
    'secondGuardianInformation.nationalId',
  )
  if (secondGuardianNationalId) {
    const secondGuardianName = getValueViaPath<string>(
      answers,
      'secondGuardianInformation.name',
    )
    const secondGuardianHasApproved = getValueViaPath<boolean>(
      answers,
      'secondGuardianInformation.approved',
    )
    result.push({
      nationalId: secondGuardianNationalId,
      name: secondGuardianName ?? '',
      hasApproved: secondGuardianHasApproved ?? false,
    })
  }

  return result
}

export const canReviewerApprove = (
  answers: FormValue,
  reviewerNationalId: string,
): boolean => {
  const reviewers = getReviewers(answers)
  const reviewer = reviewers.find((x) => x.nationalId === reviewerNationalId)

  return reviewer !== undefined && reviewer.hasApproved === false
}
