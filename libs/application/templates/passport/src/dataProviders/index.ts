import {
  defineTemplateApi,
  PaymentCatalogApi,
  UserProfileApi,
  NationalRegistryUserApi,
  InstitutionNationalIds,
} from '@island.is/application/types'
import { error } from '../lib/error'
export { MockProviderApi } from '@island.is/application/types'

export const IdentityDocumentApi = defineTemplateApi({
  action: 'identityDocument',
})
export const UserInfoApi = UserProfileApi.configure({
  params: {
    catchMock: true,
  },
})

const defaultParams = {
  ageToValidate: 18,
  legalDomicileIceland: true,
  ageToValidateError: {
    title: error.invalidAgeTitle,
    summary: error.invalidAgeDescription,
  },
  icelandicCitizenship: false,
  allowDomicilePassOnChild: true,
}

export const NationalRegistryUser = NationalRegistryUserApi.configure({
  params: defaultParams,
})

export const NationalRegistryUserParentB = NationalRegistryUserApi.configure({
  params: {
    ...defaultParams,
    icelandicCitizenship: false,
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
