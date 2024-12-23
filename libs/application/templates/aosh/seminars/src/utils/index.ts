import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'

export * from './getChargeItems'

export const staticData = (application: Application) => {
  const participantsFromAnswers = getValueViaPath(
    application.answers,
    'participantList',
    [],
  ) as Array<Record<string, string>>

  return participantsFromAnswers
}

export * from './isIndividual'
export * from './isCompany'
export * from './isValidPhoneNumber'
export * from './isValidEmail'
export * from './isCompanyType'
export * from './isPersonType'
export * from './getPaymentArrangementForOverview'
export * from './getPersonalInformationForOverview'
export * from './formatIsk'
export * from './getSeminarInformationForOverview'
export * from './formatPhoneNumber'
