import {
  defineTemplateApi,
  PaymentCatalogApi,
} from '@island.is/application/types'

export { UserProfileApi } from '@island.is/application/types'

export interface NationalRegistryUserApiParameters {
  legalDomicileIceland?: boolean
}
export const NationalRegistryUserApi = defineTemplateApi<NationalRegistryUserApiParameters>(
  {
    action: 'nationalRegistry',
    namespace: 'NationalRegistry',
    params: {
      legalDomicileIceland: true,
    },
  },
)

const SAMGONGUSTOFA_NATIONAL_ID = '5405131040'

export const SamgongustofaPaymentCatalogApi = PaymentCatalogApi.configure({
  params: {
    organizationId: SAMGONGUSTOFA_NATIONAL_ID,
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
