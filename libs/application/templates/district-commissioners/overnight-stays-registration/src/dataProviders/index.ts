import { defineTemplateApi } from '@island.is/application/types'

export const HomeLodgingsApi = defineTemplateApi({
  action: 'getHomeLodgings',
  externalDataId: 'homeLodgings',
})
