import {
  defineTemplateApi,
  PaymentCatalogApi,
} from '@island.is/application/types'
import { SYSLUMADUR_NATIONAL_ID } from '../lib/constants'
export {
  NationalRegistryUserApi,
  UserProfileApi,
  MockProviderApi,
} from '@island.is/application/types'

export const IdentityDocumentApi = defineTemplateApi({
  action: 'identityDocument',
})

export const SyslumadurPaymentCatalogApi = PaymentCatalogApi.configure({
  params: {
    organizationId: SYSLUMADUR_NATIONAL_ID,
  },
  externalDataId: 'payment',
})

export const DeliveryAddressApi = defineTemplateApi({
  action: 'deliveryAddress',
})
