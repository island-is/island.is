import { buildDataProviderItem } from '@island.is/application/core'
import {
  DistrictsApi,
  MaritalStatusApi,
  NationalRegistryUserApi,
  UserProfileApi,
  ReligionCodesApi,
  MockableDistrictCommissionersPaymentCatalogApi,
  DistrictCommissionersPaymentCatalogApi,
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
