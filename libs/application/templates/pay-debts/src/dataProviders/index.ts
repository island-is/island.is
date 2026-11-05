import { defineTemplateApi } from '@island.is/application/types'

export const GetDebtsApi = defineTemplateApi({
  action: 'getCustomerDebts',
  externalDataId: 'customerDebts',
  namespace: 'PayDebts',
})

export const CreateDebtPaymentApi = defineTemplateApi({
  action: 'createDebtPayment',
  namespace: 'PayDebts',
  shouldPersistToExternalData: false,
})

export const DeleteDebtPaymentApi = defineTemplateApi({
  action: 'deleteDebtPayment',
  namespace: 'PayDebts',
  shouldPersistToExternalData: false,
})
