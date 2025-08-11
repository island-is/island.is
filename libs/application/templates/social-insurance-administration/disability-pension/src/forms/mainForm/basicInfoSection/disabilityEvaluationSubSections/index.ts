import { buildSubSection } from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types/routes'
import { disabilityEvaluationFields } from './disabilityEvaluationSubSection'
import { disabilityPeriodFields } from './disabilityPeriodSubSection'

export const disabilityEvaluationSubSection = buildSubSection({
  id: SectionRouteEnum.DISABILITY_EVALUATION,
  title: disabilityPensionFormMessage.disabilityEvaluation.tabTitle,
  children: [disabilityPeriodFields, disabilityEvaluationFields],
})
