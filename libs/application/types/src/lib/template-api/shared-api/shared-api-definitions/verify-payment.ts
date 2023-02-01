import { defineTemplateApi } from '../../TemplateApi'

export const VerifyPaymentApi = defineTemplateApi({
  action: 'verifyPayment',
  namespace: 'Payment',
  shouldPersistToExternalData: false,
})
