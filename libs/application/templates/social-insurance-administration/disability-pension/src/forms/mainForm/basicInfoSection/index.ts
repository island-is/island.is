import {
  buildSection,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { personalInfoSubSection } from './personalInfoSubSection'
import { paymentInfoSubSection } from './paymentInfoSubSection'
import { incomePlanInstructionsSubSection } from './incomePlanInstructionsSubSection'
import { incomePlanSubSection } from './incomePlanSubSection'
import { employmentParticipationSubSection } from './employmentParticipationSubSection'


export const basicInfoSection =
  buildSection({
    id: 'personalInfo',
    title: disabilityPensionFormMessage.basicInfo.personalInfo,
    children: [
      personalInfoSubSection,
      paymentInfoSubSection,
      incomePlanInstructionsSubSection,
      incomePlanSubSection,
      employmentParticipationSubSection,
    ],
  })
