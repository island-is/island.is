import { buildDataProviderItem } from '@island.is/application/core'
import {
  DistrictsApi,
  MaritalStatusApi,
  NationalRegistryUserApi,
  UserProfileApi,
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
    provider: undefined,
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
    id: 'religions',
    type: 'ReligionsProvider',
    title: '',
    subTitle: '',
  }),
]
