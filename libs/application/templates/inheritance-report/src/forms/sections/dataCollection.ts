import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import {
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'

export const dataCollection = buildSection({
  id: 'dataCollection',
  title: m.dataCollectionTitle,
  children: [
    buildExternalDataProvider({
      id: 'approveExternalData',
      title: m.dataCollectionTitle,
      subTitle: m.dataCollectionSubtitle,
      checkboxLabel: m.dataCollectionCheckbox,
      dataProviders: [
        buildDataProviderItem({
          title: m.deceasedInfoProviderTitle,
          subTitle: m.deceasedInfoProviderSubtitle,
        }),
        buildDataProviderItem({
          title: m.financialInformationProviderTitle,
          subTitle: m.financialInformationProviderSubtitle,
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
