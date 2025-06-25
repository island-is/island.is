import {
  buildSection,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { backgroundSubSection } from './backgroundSubSection'


export const selfEvaluationSection =
  buildSection({
    id: 'selfEvaluation',
    tabTitle: disabilityPensionFormMessage.selfEvaluation.title,
    children: [
      backgroundSubSection
    ],
  })
