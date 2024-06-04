import {
  defineTemplateApi,
  PaymentCatalogApi,
  UserProfileApi,
  NationalRegistryUserApi,
  InstitutionNationalIds,
  PassportsApi,
} from '@island.is/application/types'
import { error } from '../lib/messages'

export {
  MockProviderApi,
  DisabiltyLicenseApi,
} from '@island.is/application/types'

export const PassportsApiResponse = PassportsApi.configure({
  params: {
    type: 'I',
  },
})

export const IdentityDocuments = defineTemplateApi({
  action: 'getIdentityDocument',
  externalDataId: 'getIdentityDocument',
  params: {
    type: 'I',
  },
})

export const UserInfoApi = UserProfileApi.configure({
  params: {
    catchMock: true,
  },
})

const defaultParams = {
  ageToValidate: 13,
  legalDomicileIceland: false,
  ageToValidateError: {
    title: error.invalidAgeTitle,
    summary: error.invalidAgeDescription,
  },
  icelandicCitizenship: true,
  allowPassOnChild: true,
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
