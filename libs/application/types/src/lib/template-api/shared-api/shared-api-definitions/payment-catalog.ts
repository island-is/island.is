import { InstitutionNationalIds } from '../../../InstitutionNationalIds'
import { defineTemplateApi } from '../../TemplateApi'

export interface PaymentCatalogParameters {
  organizationId: string
  enableMockPayment: boolean
}

export const PaymentCatalogApi = defineTemplateApi<PaymentCatalogParameters>({
  action: 'paymentCatalog',
  namespace: 'Payment',
  params: {
    organizationId: InstitutionNationalIds.SYSLUMENN,
    enableMockPayment: false,
  },
})

export const MockablePaymentCatalogApi =
  defineTemplateApi<PaymentCatalogParameters>({
    externalDataId: 'paymentCatalog',
    action: 'mockPaymentCatalog',
    namespace: 'Payment',
    params: {
      organizationId: InstitutionNationalIds.SYSLUMENN,
      enableMockPayment: true,
    },
  })
