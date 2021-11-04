import { AccidentNotificationConfirmation } from '@island.is/api/schema'
import { FormValue, getValueViaPath } from '@island.is/application/core'
import { isReportingOnBehalfOfEmployee } from './isReportingOnBehalfOfEmployee'

export const hasReceivedConfirmation = (answers: FormValue) => {
  const accidentConfirmations = getValueViaPath(
    answers,
    'accidentStatus.receivedConfirmations',
  ) as AccidentNotificationConfirmation
  console.log(accidentConfirmations)
  if (!accidentConfirmations) return false
  // assignee reporting for employee
  if (isReportingOnBehalfOfEmployee(answers)) {
    return !!accidentConfirmations.CompanyParty
  }
  // else must be injured or representative party thats assigned to application
  return !!accidentConfirmations.InjuredOrRepresentativeParty
}
