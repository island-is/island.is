import { ExternalData } from '@island.is/application/types'
import { getApplicationExternalData } from './getApplicationAnswers'
import { NotEligibleReasonCodes } from '../types/constants'
import * as m from '../lib/messages'

export const notEligibleText = (externalData: ExternalData) => {
  const { isEligible } = getApplicationExternalData(externalData)

  switch (isEligible?.reasonCode) {
    case NotEligibleReasonCodes.APPLICANT_AGE_OUT_OF_RANGE:
      return m.notEligible.applicantAgeOutOfRangeDescription
    case NotEligibleReasonCodes.NO_LEGAL_DOMICILE_IN_ICELAND:
      return m.notEligible.noLegalDomicileInIcelandDescription
    case NotEligibleReasonCodes.LATEST_DISABILITY_PENSION_DOCUMENT_NOT_FOUND:
      return m.notEligible.latestDisabilityPensionDocumentNotFoundDescription
    case NotEligibleReasonCodes.APPLICANT_ALREADY_HAS_PENDING_APPLICATION:
      return m.notEligible.applicantAlreadyHasPendingApplicationDescription
    case NotEligibleReasonCodes.APPLICANT_ALREADY_HAS_FULL_DISABILITY_PENSION:
      return m.notEligible.applicantAlreadyHasFullDisabilityPensionDescription
    case NotEligibleReasonCodes.ERROR_PROCESSING_CLIENT:
      return m.notEligible.errorProcessingClientDescription
    default:
      return undefined
  }
}
