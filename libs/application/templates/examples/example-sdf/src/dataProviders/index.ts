import { defineTemplateApi } from '@island.is/application/types'

export const MyPlotsApi = defineTemplateApi({
  action: 'getMyPlots',
  order: 1,
})
