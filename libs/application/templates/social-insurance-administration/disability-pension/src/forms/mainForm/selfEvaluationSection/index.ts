import {
  buildSection,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { backgroundInfoSubSection } from './backgroundSubSection'
import { SectionRouteEnum } from '../../../types'

export const selfEvaluationSection =
  buildSection({
    id: SectionRouteEnum.SELF_EVALUATION,
    title: disabilityPensionFormMessage.selfEvaluation.title,
    children: [
      backgroundInfoSubSection,
    ]
  })
