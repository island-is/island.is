import {
  defineTemplateApi,
  PaymentCatalogApi,
  UserProfileApi,
  NationalRegistryV3UserApi,
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
  legalDomicileIceland: false,
  ageToValidateError: {
    title: error.invalidAgeTitle,
    summary: error.invalidAgeDescription,
  },
  icelandicCitizenship: true,
  allowPassOnChild: true,
}

export const NationalRegistryUser = NationalRegistryV3UserApi.configure({
  params: defaultParams,
})

export const NationalRegistryUserParentB = NationalRegistryV3UserApi.configure({
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
