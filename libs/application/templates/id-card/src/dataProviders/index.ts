import {
  defineTemplateApi,
  PaymentCatalogApi,
  UserProfileApi,
  NationalRegistryUserApi,
  InstitutionNationalIds,
  MockablePaymentCatalogApi,
} from '@island.is/application/types'
import { error } from '../lib/messages'

export { MockProviderApi } from '@island.is/application/types'

export const IdentityDocumentApi = defineTemplateApi({
  action: 'getIdentityDocument',
  externalDataId: 'identityDocument',
  params: {
    type: 'I',
  },
})

export const UserInfoApi = UserProfileApi.configure({
  params: {
    catchMock: true,
    validatePhoneNumber: true,
    validateEmail: true,
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
  allowIfChildHasCitizenship: true,
}

export const NationalRegistryUser = NationalRegistryUserApi.configure({
  params: defaultParams,
})

export const NationalRegistryUserParentB = NationalRegistryUserApi.configure({
  params: {
    ...defaultParams,
    icelandicCitizenship: false,
  },
  externalDataId: 'nationalRegistryParentB',
})

export const SyslumadurPaymentCatalogApi = PaymentCatalogApi.configure({
  params: {
    organizationId: InstitutionNationalIds.SYSLUMENN,
  },
  externalDataId: 'payment',
})

export const MockableSyslumadurPaymentCatalogApi =
  MockablePaymentCatalogApi.configure({
    params: {
      organizationId: InstitutionNationalIds.SYSLUMENN,
    },
    externalDataId: 'payment',
  })

export const DeliveryAddressApi = defineTemplateApi({
  action: 'deliveryAddress',
})
