import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSection,
} from '@island.is/application/core'
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
          id: 'estateNoticeProvider',
          type: 'EstateNoticeProvider',
          title: m.deceasedInfoProviderTitle,
          subTitle: m.deceasedInfoProviderSubtitle,
        }),
        buildDataProviderItem({
          id: 'nationalRegistry',
          type: 'NationalRegistryProvider',
          title: m.personalInfoProviderTitle,
          subTitle: m.personalInfoProviderSubtitle,
        }),
        buildDataProviderItem({
          id: 'userProfile',
          type: 'UserProfileProvider',
          title: m.settingsInfoProviderTitle,
          subTitle: m.settingsInfoProviderSubtitle,
        }),
      ],
    }),
  ],
})
