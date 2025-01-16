import { buildDataProviderItem } from '@island.is/application/core'
import {
  DistrictsApi,
  MaritalStatusApi,
  NationalRegistryUserApi,
  UserProfileApi,
  ReligionCodesApi,
  MockableDistrictCommissionersPaymentCatalogApi,
  DistrictCommissionersPaymentCatalogApi,
  BirthCertificateApi,
} from '../../dataProviders'
import { m } from '../../lib/messages'

export const dataCollection = [
  buildDataProviderItem({
    provider: NationalRegistryUserApi,
    title: m.dataCollectionNationalRegistryTitle,
    subTitle: m.dataCollectionNationalRegistrySubtitle,
  }),
  buildDataProviderItem({
    provider: UserProfileApi,
    title: m.dataCollectionUserProfileTitle,
    subTitle: m.dataCollectionUserProfileSubtitle,
  }),
  buildDataProviderItem({
    provider: MaritalStatusApi,
    title: m.dataCollectionMaritalStatusTitle,
    subTitle: m.dataCollectionMaritalStatusDescription,
  }),
  buildDataProviderItem({
    provider: BirthCertificateApi,
    title: m.dataCollectionBirthCertificateTitle,
    subTitle: m.dataCollectionBirthCertificateDescription,
  }),
  buildDataProviderItem({
    provider: DistrictsApi,
  }),
  buildDataProviderItem({
    provider: ReligionCodesApi,
    subTitle: '',
  }),
  buildDataProviderItem({
    provider: DistrictCommissionersPaymentCatalogApi,
    subTitle: '',
  }),
  buildDataProviderItem({
    provider: MockableDistrictCommissionersPaymentCatalogApi,
    subTitle: '',
  }),
]
