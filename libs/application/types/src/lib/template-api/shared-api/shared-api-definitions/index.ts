import { defineTemplateApi } from '../../TemplateApi'

export interface NationalRegistryParameters {
  ageToValidate?: number
}
export const NationalRegistryUserApi = defineTemplateApi<NationalRegistryParameters>(
  {
    action: 'getUser',
    namespace: 'NationalRegistry',
    externalDataId: 'nationalRegistry',
  },
)

export const NationalRegistryFamilyApi = defineTemplateApi({
  action: 'getFamily',
  namespace: 'NationalRegistry',
})

export const UserProfileApi = defineTemplateApi({
  action: 'getUserProfile',
  namespace: 'UserProfile',
})

export interface PaymentCatalogParameters {
  orginizationId: string
}

export const PaymentCatalogApi = defineTemplateApi<PaymentCatalogParameters>({
  action: 'paymentCatalog',
  namespace: 'PaymentCatalog',
})
