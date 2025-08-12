import { buildSection } from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { SectionRouteEnum } from '../../../types'
import { capabilityImpairmentSection } from '../capabilityImpairmentSection'
import { backgroundInfoSubSection } from './backgroundSubSection'

export const selfEvaluationSection = buildSection({
  id: SectionRouteEnum.SELF_EVALUATION,
  title: disabilityPensionFormMessage.selfEvaluation.title,
  children: [backgroundInfoSubSection, capabilityImpairmentSection],
})
