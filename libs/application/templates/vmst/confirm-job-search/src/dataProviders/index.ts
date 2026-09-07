import { defineTemplateApi } from '@island.is/application/types'

export const JobSearchEligibilityApi = defineTemplateApi({
  action: 'checkEligibility',
  externalDataId: 'jobSearchEligibility',
  order: 1,
})

export const QuestionnaireApi = defineTemplateApi({
  action: 'getQuestionnaire',
  externalDataId: 'questionnaire',
  order: 2,
})
