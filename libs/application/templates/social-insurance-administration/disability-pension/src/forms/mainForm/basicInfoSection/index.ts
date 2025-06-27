import {
  buildSection,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { personalInfoSubSection } from './personalInfoSubSection'
import { paymentInfoSubSection } from './paymentInfoSubSection'
import { incomePlanInstructionsSubSection } from './incomePlanInstructionsSubSection'
import { incomePlanSubSection } from './incomePlanSubSection'
import { employmentParticipationSubSection } from './employmentParticipationsSubSections'
import { disabilityEvaluationSubSection } from './disabilityEvaluationSubSection'


export const basicInfoSection =
  buildSection({
    id: 'personalInfo',
    title: disabilityPensionFormMessage.basicInfo.title,
    children: [
      //personalInfoSubSection,
      //paymentInfoSubSection,
      //incomePlanInstructionsSubSection,
      //incomePlanSubSection,
      //disabilityEvaluationSubSection,
      employmentParticipationSubSection,
    ],
  })
