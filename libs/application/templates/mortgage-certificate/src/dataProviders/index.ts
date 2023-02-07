import { PaymentCatalogApi } from '@island.is/application/types'

export {
  IdentityApi,
  UserProfileApi,
  NationalRegistryRealEstateApi,
} from '@island.is/application/types'

const SYSLUMADUR_NATIONAL_ID = '6509142520'

export const SyslumadurPaymentCatalogApi = PaymentCatalogApi.configure({
  params: {
    organizationId: SYSLUMADUR_NATIONAL_ID,
  },
  externalDataId: 'payment',
})
