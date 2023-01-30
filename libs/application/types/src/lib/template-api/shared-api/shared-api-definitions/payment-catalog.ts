import { defineTemplateApi } from '../../TemplateApi'

export interface PaymentCatalogParameters {
  organizationId: string
}

export const PaymentCatalogApi = defineTemplateApi<PaymentCatalogParameters>({
  action: 'paymentCatalog',
  namespace: 'PaymentCatalog',
  params: {
    organizationId: '6509142520',
  },
})
