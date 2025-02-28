import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const isSameAsApplicant = (answers: FormValue) => {
  const assigneeSsn = getValueViaPath<string>(
    answers,
    'assigneeInformation.assignee.nationalId',
  )
  const applicantSsn = getValueViaPath<string>(
    answers,
    'information.nationalId',
  )
  return assigneeSsn === applicantSsn
}
