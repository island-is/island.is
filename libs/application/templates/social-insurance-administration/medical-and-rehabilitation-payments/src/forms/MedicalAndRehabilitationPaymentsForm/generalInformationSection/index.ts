import { buildSection } from '@island.is/application/core'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'

import { applicantInfoSubSection } from './applicantInfoSubSection'
import { paymentInfoSubSection } from './paymentInfoSubSection'
import { questionsSubSection } from './questionsSubSection'
import { sickPaySubSection } from './sickPaySubSection'
import { unionSickPaySubSection } from './unionSickPaySubSection'

export const generalInformationSection = buildSection({
  id: 'generalInformationSection',
  title: socialInsuranceAdministrationMessage.info.section,
  children: [
    applicantInfoSubSection,
    paymentInfoSubSection,
    questionsSubSection,
    sickPaySubSection,
    unionSickPaySubSection,
    // Tengdar umsóknir? - Bíða með þetta
  ],
})
