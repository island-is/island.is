import {
  buildSection,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { PersonalInfoSubSection } from './personalInfoSubSection'
import { PaymentInfoSubSection } from './paymentInfoSubSection'
import { IncomePlanInstructionsSubSection } from './incomePlanInstructionsSubSection'
import { IncomePlanSubSection } from './incomePlanSubSection'


export const BasicInfoSection =
  buildSection({
    id: 'personalInfo',
    tabTitle: disabilityPensionFormMessage.basicInfo.personalInfo,
    children: [
      PersonalInfoSubSection,
      PaymentInfoSubSection,
      IncomePlanInstructionsSubSection,
      IncomePlanSubSection,
    ],
  })
