import { buildSubSection } from '@island.is/application/core'
import { SectionRouteEnum } from '../../../../types/routes'
import { disabilityEvaluationFields } from './disabilityEvaluationSubSection'
import { disabilityPeriodFields } from './disabilityPeriodSubSection'
import * as m from '../../../../lib/messages'

export const disabilityEvaluationSubSection = buildSubSection({
  id: SectionRouteEnum.DISABILITY_EVALUATION,
  title: m.disabilityEvaluation.tabTitle,
  children: [disabilityPeriodFields, disabilityEvaluationFields],
})
