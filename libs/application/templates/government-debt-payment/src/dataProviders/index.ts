import { defineTemplateApi } from '@island.is/application/types'

export { UserProfileApi } from '@island.is/application/types'

export const CustomerDebtsApi = defineTemplateApi({
  action: 'getCustomerDebts',
  externalDataId: 'customerDebts',
  throwOnError: false,
})
