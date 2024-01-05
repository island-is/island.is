import { defineTemplateApi } from '../../TemplateApi'

export const DeletePaymentApi = defineTemplateApi({
  action: 'deletePayment',
  namespace: 'Payment',
  shouldPersistToExternalData: false,
})
