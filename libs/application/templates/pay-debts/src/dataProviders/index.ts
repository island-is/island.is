import { defineTemplateApi } from '@island.is/application/types'

export const GetDebtsApi = defineTemplateApi({
  action: 'getCustomerDebts',
  externalDataId: 'customerDebts',
  namespace: 'PayDebts',
})
