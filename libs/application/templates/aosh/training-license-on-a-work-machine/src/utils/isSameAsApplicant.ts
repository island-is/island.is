import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const isSameAsApplicant = (
  answers: FormValue,
  activeField?: Record<string, string>,
) => {
  let assigneeNationalId =
    activeField && getValueViaPath<string>(activeField, 'assignee.nationalId')

  if (!assigneeNationalId) {
    assigneeNationalId = getValueViaPath<string>(
      answers,
      'assigneeInformation.assignee.nationalId',
    )
  }

  const applicantNationalId = getValueViaPath<string>(
    answers,
    'information.nationalId',
  )
  return assigneeNationalId === applicantNationalId
}
