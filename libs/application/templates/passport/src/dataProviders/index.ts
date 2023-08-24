import {
  defineTemplateApi,
  PaymentCatalogApi,
  UserProfileApi,
  MockProviderApi,
  DistrictsApi,
  PassportsApi,
  NationalRegistryUserApi,
  InstitutionNationalIds,
} from '@island.is/application/types'
import { error } from '../lib/error'
export { MockProviderApi } from '@island.is/application/types'

// export const IdentityDocumentApi = defineTemplateApi({
//   action: 'identityDocument',
// })
export const IdentityDocumentApi = defineTemplateApi({
  action: 'identityDocument',
})
export const UserInfoApi = UserProfileApi.configure({
  params: {
    catchMock: true,
  },
})

export const NationalRegistryUser = NationalRegistryUserApi.configure({
  params: {
    ageToValidate: 18,
    legalDomicileIceland: true,
    ageToValidateError: {
      title: error.invalidAgeTitle,
      summary: error.invalidAgeDescription,
    },
    icelandicCitizenship: true,
  },
})

export const SyslumadurPaymentCatalogApi = PaymentCatalogApi.configure({
  params: {
    organizationId: InstitutionNationalIds.SYSLUMENN,
  },
  externalDataId: 'payment',
})

export const DeliveryAddressApi = defineTemplateApi({
  action: 'deliveryAddress',
})
