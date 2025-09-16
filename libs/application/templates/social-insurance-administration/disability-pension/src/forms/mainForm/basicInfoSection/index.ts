import { buildSection } from '@island.is/application/core'
import { SectionRouteEnum } from '../../../types/routes'
import { disabilityEvaluationSubSection } from './disabilityEvaluationSubSections'
import { employmentParticipationSubSection } from './employmentParticipationsSubSections'
import { incomePlanInstructionsSubSection } from './incomePlanInstructionsSubSection'
import { incomePlanSubSection } from './incomePlanSubSection'
import { paymentInfoSubSection } from './paymentInfoSubSection'
import { personalInfoSubSection } from './personalInfoSubSection'
import * as m from '../../../lib/messages'

export const basicInfoSection = buildSection({
  id: SectionRouteEnum.BASIC_INFO,
  title: m.basicInfo.title,
  children: [
    personalInfoSubSection,
    paymentInfoSubSection,
    incomePlanInstructionsSubSection,
    incomePlanSubSection,
    disabilityEvaluationSubSection,
    employmentParticipationSubSection,
  ],
})
