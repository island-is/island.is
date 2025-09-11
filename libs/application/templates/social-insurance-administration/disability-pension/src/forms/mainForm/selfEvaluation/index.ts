import { buildSection } from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { SectionRouteEnum } from '../../../types'
import { backgroundInfoSubSection } from './backgroundSubSection'
import { capabilityImpairmentSubSection } from './capabilityImpairmentSubSection'

export const selfEvaluationSection = buildSection({
  id: SectionRouteEnum.SELF_EVALUATION,
  title: disabilityPensionFormMessage.selfEvaluation.title,
  children: [backgroundInfoSubSection, capabilityImpairmentSubSection],
})
