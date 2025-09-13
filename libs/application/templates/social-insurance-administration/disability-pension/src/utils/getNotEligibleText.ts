import { ExternalData } from '@island.is/application/types'
import { getApplicationExternalData } from './getApplicationAnswers'
import { NotEligibleReasonCodes } from '../types/constants'
import { disabilityPensionFormMessage } from '../lib/messages'

export const notEligibleText = (externalData: ExternalData) => {
  const { isEligible } = getApplicationExternalData(externalData)

  switch (isEligible?.reasonCode) {
    case NotEligibleReasonCodes.APPLICANT_AGE_OUT_OF_RANGE:
      return disabilityPensionFormMessage.notEligible
        .applicantAgeOutOfRangeDescription
    case NotEligibleReasonCodes.NO_LEGAL_DOMICILE_IN_ICELAND:
      return disabilityPensionFormMessage.notEligible
        .noLegalDomicileInIcelandDescription
    case NotEligibleReasonCodes.LATEST_DISABILITY_PENSION_DOCUMENT_NOT_FOUND:
      return disabilityPensionFormMessage.notEligible
        .latestDisabilityPensionDocumentNotFoundDescription
    case NotEligibleReasonCodes.APPLICANT_ALREADY_HAS_PENDING_APPLICATION:
      return disabilityPensionFormMessage.notEligible
        .applicantAlreadyHasPendingApplicationDescription
    case NotEligibleReasonCodes.APPLICANT_ALREADY_HAS_FULL_DISABILITY_PENSION:
      return disabilityPensionFormMessage.notEligible
        .applicantAlreadyHasFullDisabilityPensionDescription
    default:
      return undefined
  }
}
