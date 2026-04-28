import { defineTemplateApi } from '@island.is/application/types'

export const JobSearchEligibilityApi = defineTemplateApi({
  action: 'checkEligibility',
  externalDataId: 'jobSearchEligibility',
})
