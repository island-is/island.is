import { Application } from '@island.is/application/core'

export const isUniqueAssignee = (
  application: Application,
  isAssignee: boolean,
): boolean => {
  const isSamePerson = application.applicant === application.assignees[0]

  return !isSamePerson && isAssignee
}
