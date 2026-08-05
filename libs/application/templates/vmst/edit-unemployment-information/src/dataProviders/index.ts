import { defineTemplateApi } from '@island.is/application/types'

export const UnemploymentApi = defineTemplateApi({
  action: 'getEmptyApplication',
  externalDataId: 'currentApplicationInformation',
})
