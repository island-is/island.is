import { buildSection } from '@island.is/application/core'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { applicantInfoSubSection } from './applicantInfoSubSection'
import { incomePlanInstructionsSubSection } from './incomePlanInstructionsSubSection'
import { incomePlanSubSection } from './incomePlanSubSection'
import { onePaymentPerYearSubSection } from './onePaymentPerYearSubSection'
import { paymentInfoSubSection } from './paymentInfoSubSection'
import { residenceHistorySubSection } from './residenceHistorySubSection'

export const generalInformationSection = buildSection({
  id: 'generalInformationSection',
  title: socialInsuranceAdministrationMessage.info.section,
  children: [
    applicantInfoSubSection,
    paymentInfoSubSection,
    incomePlanInstructionsSubSection,
    incomePlanSubSection,
    onePaymentPerYearSubSection,
    residenceHistorySubSection,
  ],
})
