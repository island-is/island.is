import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const isUniqueAssignee = (
  formValue: FormValue,
  isAssignee: boolean,
): boolean => {
  const applicant = getValueViaPath(formValue, 'applicant.nationalId')
  const assignee = getValueViaPath(formValue, 'representative.nationalId')
  const isSamePerson = applicant === assignee

  return !isSamePerson && isAssignee
}
