import { FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { TrainingLicenseOnAWorkMachineAnswers } from '../shared/types'

export const getReviewers = (
  answers: FormValue,
): { nationalId: string; name: string; hasApproved: boolean }[] => {
  const result: { nationalId: string; name: string; hasApproved: boolean }[] =
    []

  // Assignees
  const assigneeInformation =
    getValueViaPath<
      TrainingLicenseOnAWorkMachineAnswers['assigneeInformation']
    >(answers, 'assigneeInformation') || []
  const approvedNationalIds =
    getValueViaPath<string[]>(answers, 'approved') || []
  const assignees = assigneeInformation?.map(({ assignee }) => assignee)
  assignees.forEach((item) => {
    if (item?.nationalId)
      result.push({
        nationalId: item.nationalId,
        name: item.name ?? '',
        hasApproved: approvedNationalIds.includes(item.nationalId),
      })
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
