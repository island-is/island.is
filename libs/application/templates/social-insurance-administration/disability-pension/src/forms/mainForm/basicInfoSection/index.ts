import { buildSection } from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { SectionRouteEnum } from '../../../types'
import { disabilityEvaluationSubSection } from './disabilityEvaluationSubSections'
import { employmentParticipationSubSection } from './employmentParticipationsSubSections'
import { incomePlanInstructionsSubSection } from './incomePlanInstructionsSubSection'
import { incomePlanSubSection } from './incomePlanSubSection'
import { paymentInfoSubSection } from './paymentInfoSubSection'
import { personalInfoSubSection } from './personalInfoSubSection'

export const basicInfoSection = buildSection({
  id: SectionRouteEnum.BASIC_INFO,
  title: disabilityPensionFormMessage.basicInfo.title,
  children: [
    personalInfoSubSection,
    paymentInfoSubSection,
    incomePlanInstructionsSubSection,
    incomePlanSubSection,
    disabilityEvaluationSubSection,
    employmentParticipationSubSection,
  ],
})
