import { buildSection } from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { SectionRouteEnum } from '../../../types/routes'
import { backgroundInfoSubSection } from './backgroundSubSection'
import { capabilityImpairmentSubSection } from './capabilityImpairmentSubSection'

export const selfEvaluationSection = buildSection({
  id: SectionRouteEnum.SELF_EVALUATION,
  title: m.selfEvaluation.title,
  children: [backgroundInfoSubSection, capabilityImpairmentSubSection],
})
