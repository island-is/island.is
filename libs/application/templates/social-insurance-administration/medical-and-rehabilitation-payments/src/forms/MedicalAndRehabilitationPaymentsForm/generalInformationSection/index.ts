import { buildSection } from '@island.is/application/core'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'

import { applicantInfoSubSection } from './applicantInfoSubSection'
import { employeeSickPaySubSection } from './employeeSickPaySubSection'
import { incomePlanInstructionsSubSection } from './incomePlanInstructionsSubSection'
import { incomePlanSubSection } from './incomePlanSubSection'
import { paymentInfoSubSection } from './paymentInfoSubSection'
import { questionsSubSection } from './questionsSubSection'
import { unionSickPaySubSection } from './unionSickPaySubSection'

export const generalInformationSection = buildSection({
  id: 'generalInformationSection',
  title: socialInsuranceAdministrationMessage.info.section,
  children: [
    applicantInfoSubSection,
    paymentInfoSubSection,
    incomePlanInstructionsSubSection,
    incomePlanSubSection,
    questionsSubSection,
    employeeSickPaySubSection,
    unionSickPaySubSection,
    // Tengdar umsóknir? - Bíða með þetta
  ],
})
