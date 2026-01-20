import { buildDataProviderItem } from '@island.is/application/core'
import {
  DistrictsApi,
  MaritalStatusApi,
  NationalRegistryV3UserApi,
  UserProfileApi,
  ReligionCodesApi,
  MockableDistrictCommissionersPaymentCatalogApi,
  DistrictCommissionersPaymentCatalogApi,
  BirthCertificateApi,
} from '../../dataProviders'
import { m } from '../../lib/messages'

export const dataCollection = [
  buildDataProviderItem({
    provider: NationalRegistryV3UserApi,
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
    title: '',
  }),
  buildDataProviderItem({
    provider: ReligionCodesApi,
    title: '',
    subTitle: '',
  }),
  buildDataProviderItem({
    provider: DistrictCommissionersPaymentCatalogApi,
    title: '',
    subTitle: '',
  }),
  buildDataProviderItem({
    provider: MockableDistrictCommissionersPaymentCatalogApi,
    title: '',
    subTitle: '',
  }),
]
