import { buildSection } from '@island.is/application/core'
import { SectionRouteEnum } from '../../../types/routes'
import { employmentParticipationSubSection } from './employmentParticipationsSubSections'
import { incomePlanInstructionsSubSection } from './incomePlanInstructionsSubSection'
import { incomePlanSubSection } from './incomePlanSubSection'
import { paymentInfoSubSection } from './paymentInfoSubSection'
import { personalInfoSubSection } from './personalInfoSubSection'
import * as m from '../../../lib/messages'
import { disabilityPeriodSubsection } from './disabilityPeriodSubSection'
import { disabilityEvaluationSubSection } from './disabilityEvaluationSubSection'

export const basicInfoSection = buildSection({
  id: SectionRouteEnum.BASIC_INFO,
  title: m.basicInfo.title,
  children: [
    personalInfoSubSection,
    paymentInfoSubSection,
    incomePlanInstructionsSubSection,
    incomePlanSubSection,
    disabilityPeriodSubsection,
    disabilityEvaluationSubSection,
    employmentParticipationSubSection,
  ],
})
