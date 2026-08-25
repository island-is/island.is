import { defineTemplateApi } from '@island.is/application/types'

export const UnemploymentApi = defineTemplateApi({
  action: 'getEmptyApplication',
  externalDataId: 'currentApplicationInformation',
})

export const getEditProfileEligibilityApi = defineTemplateApi({
  action: 'getEditProfileEligibility',
  externalDataId: 'editProfileEligibility',
})
