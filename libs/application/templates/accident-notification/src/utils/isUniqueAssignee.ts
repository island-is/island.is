import { FormValue, getValueViaPath } from '@island.is/application/core'

export const isUniqueAssignee = (
  formValue: FormValue,
  isAssignee: boolean,
): boolean => {
  const applicant = getValueViaPath(formValue, 'applicant.nationalId')
  const assignee = getValueViaPath(formValue, 'representative.nationalId')
  console.log(applicant, assignee)
  const isSamePerson = applicant === assignee
  console.log(isSamePerson)

  return !isSamePerson && isAssignee
}
