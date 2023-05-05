import {
  defineTemplateApi,
  PaymentCatalogApi,
  UserProfileApi,
} from '@island.is/application/types'
import { SYSLUMADUR_NATIONAL_ID } from '../lib/constants'
export {
  NationalRegistryUserApi,
  MockProviderApi,
} from '@island.is/application/types'

export const IdentityDocumentApi = defineTemplateApi({
  action: 'identityDocument',
})
export const UserInfoApi = UserProfileApi.configure({
  params: {
    throwOnDev: true,
  },
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
