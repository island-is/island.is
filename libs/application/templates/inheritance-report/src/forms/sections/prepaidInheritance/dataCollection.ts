import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import {
  NationalRegistryV3UserApi,
  UserProfileApi,
} from '@island.is/application/types'
import { MaritalStatusApi } from '../../../dataProviders'

export const prePaidDataCollection = buildSection({
  id: 'prepaidDataCollection',
  title: m.dataCollectionTitle,
  children: [
    buildExternalDataProvider({
      id: 'approveExternalDataForPrepaid',
      title: m.dataCollectionTitle,
      subTitle: m.dataCollectionSubtitle,
      checkboxLabel: m.dataCollectionCheckbox,
      dataProviders: [
        buildDataProviderItem({
          provider: NationalRegistryV3UserApi,
          title: m.personalInfoProviderTitle,
          subTitle: m.personalInfoProviderSubtitle,
        }),
        buildDataProviderItem({
          provider: UserProfileApi,
          title: m.settingsInfoProviderTitle,
          subTitle: m.settingsInfoProviderSubtitle,
        }),
        buildDataProviderItem({
          provider: MaritalStatusApi,
          title: m.maritalStatusProviderTitle,
          subTitle: m.maritalStatusProviderSubtitle,
        }),
      ],
    }),
  ],
})
