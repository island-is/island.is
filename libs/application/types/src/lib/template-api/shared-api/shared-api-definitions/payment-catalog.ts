import { InstitutionNationalIds } from '../../../InstitutionNationalIds'
import { defineTemplateApi } from '../../TemplateApi'
import { PaymentCatalogItem } from '../models'

export interface PaymentCatalogParameters {
  organizationId: string
  enableMockPayment: boolean
  mockPaymentCatalog?: PaymentCatalogItem[]
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
