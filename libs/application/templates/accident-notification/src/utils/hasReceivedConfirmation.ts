import { AccidentNotificationConfirmation } from '@island.is/api/schema'
import { FormValue, getValueViaPath } from '@island.is/application/core'
import { isReportingOnBehalfOfEmployee } from './isReportingOnBehalfOfEmployee'

export const hasReceivedConfirmation = (answers: FormValue) => {
  const accidentConfirmations = getValueViaPath(
    answers,
    'accidentStatus.receivedConfirmations',
  ) as AccidentNotificationConfirmation

  // if juridical person then the injured or the power of attorney holder has to confirm
  if (isReportingOnBehalfOfEmployee(answers)) {
    return !!accidentConfirmations.InjuredOrRepresentativeParty
  }

  // as there isn't an juridical person reporting, this must be someone reporting for the injured
  // or the injured himself and that requires the companies confirmation
  return !!accidentConfirmations.CompanyParty
}
