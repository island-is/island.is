import { getValueViaPath } from '@island.is/application/core'
import { SelfAssessmentQuestionnaire } from '../types/interfaces'
import { ExternalData } from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'

export const getQuestionnaire = (
  externalData: ExternalData,
  locale: Locale = 'is',
) => {
  const selfAssessmentQuestionnaire =
    getValueViaPath<Array<SelfAssessmentQuestionnaire>>(
      externalData,
      'socialInsuranceAdministrationDisabilityPensionSelfAssessmentQuestions.data',
    ) ?? []

  return (
    selfAssessmentQuestionnaire.find(
      (questionnaire) => questionnaire.language.toLowerCase() === locale,
    )?.questions ?? []
  )
}
