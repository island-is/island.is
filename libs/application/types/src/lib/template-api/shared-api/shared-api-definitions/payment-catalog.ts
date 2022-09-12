import { defineTemplateApi } from '../../TemplateApi'

export interface PaymentCatalogParameters {
  orginizationId: string
}

export const PaymentCatalogApi = defineTemplateApi<PaymentCatalogParameters>({
  action: 'paymentCatalog',
  namespace: 'PaymentCatalog',
})
