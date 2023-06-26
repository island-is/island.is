import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSection,
} from '@island.is/application/core'
import {
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import { EstateApi } from '../../dataProviders'
import { m } from '../../lib/messages'

export const dataCollection = buildSection({
  id: 'externalData',
  title: m.dataCollectionTitle,
  children: [
    buildExternalDataProvider({
      id: 'approveExternalData',
      title: m.dataCollectionTitle,
      subTitle: m.dataCollectionSubtitle,
      checkboxLabel: m.dataCollectionCheckbox,
      dataProviders: [
        buildDataProviderItem({
          provider: EstateApi,
          title: m.deceasedInfoProviderTitle,
          subTitle: m.deceasedInfoProviderSubtitle,
        }),
        buildDataProviderItem({
          provider: NationalRegistryUserApi,
          title: m.personalInfoProviderTitle,
          subTitle: m.personalInfoProviderSubtitle,
        }),
        buildDataProviderItem({
          provider: UserProfileApi,
          title: m.settingsInfoProviderTitle,
          subTitle: m.settingsInfoProviderSubtitle,
        }),
      ],
    }),
  ],
})
