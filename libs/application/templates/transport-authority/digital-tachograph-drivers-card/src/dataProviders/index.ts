import {
  defineTemplateApi,
  InstitutionNationalIds,
  MockablePaymentCatalogApi,
  PaymentCatalogApi,
} from '@island.is/application/types'

export { UserProfileApi } from '@island.is/application/types'

export interface NationalRegistryUserApiParameters {
  legalDomicileIceland?: boolean
}
export const NationalRegistryUserApi =
  defineTemplateApi<NationalRegistryUserApiParameters>({
    action: 'nationalRegistry',
    namespace: 'NationalRegistry',
    params: {
      legalDomicileIceland: true,
    },
  })

export const SamgongustofaPaymentCatalogApi = PaymentCatalogApi.configure({
  params: {
    organizationId: InstitutionNationalIds.SAMGONGUSTOFA,
  },
  externalDataId: 'payment',
})

export const MockableSamgongustofaPaymentCatalogApi =
  MockablePaymentCatalogApi.configure({
    params: {
      organizationId: InstitutionNationalIds.SAMGONGUSTOFA,
    },
    externalDataId: 'payment',
  })

// Note: this data provider also confirms if the driving license issuing country is "Ísland"
export interface CurrentLicenseParameters {
  validCategories?: string[]
}
export const DrivingLicenseApi = defineTemplateApi<CurrentLicenseParameters>({
  action: 'currentLicense',
  namespace: 'DrivingLicenseShared',
  params: {
    validCategories: ['C', 'C1', 'D', 'D1'],
  },
})

export const QualityPhotoAndSignatureApi = defineTemplateApi({
  action: 'getQualityPhotoAndSignature',
  externalDataId: 'qualityPhotoAndSignature',
})

export const NewestDriversCardApi = defineTemplateApi({
  action: 'getNewestDriversCard',
  externalDataId: 'newestDriversCard',
})

export const NationalRegistryBirthplaceApi = defineTemplateApi({
  action: 'getBirthplace',
  externalDataId: 'nationalRegistryBirthplace',
  namespace: 'NationalRegistry',
})
