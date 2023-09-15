import { InstitutionNationalIds } from '../../../InstitutionNationalIds'
import { defineTemplateApi } from '../../TemplateApi'

export interface PaymentCatalogParameters {
  organizationId: string
}

export const PaymentCatalogApi = defineTemplateApi<PaymentCatalogParameters>({
  action: 'paymentCatalog',
  namespace: 'Payment',
  params: {
    organizationId: InstitutionNationalIds.SYSLUMENN,
  },
})
