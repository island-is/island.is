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
      checkboxLabel: '',
      dataProviders: [
        buildDataProviderItem({
          id: '',
          type: '',
          title: m.deceasedInfoProviderTitle,
          subTitle: m.deceasedInfoProviderSubtitle,
        }),
        buildDataProviderItem({
          id: '',
          type: '',
          title: m.personalInfoProviderTitle,
          subTitle: m.personalInfoProviderSubtitle,
        }),
        buildDataProviderItem({
          id: '',
          type: '',
          title: m.settingsInfoProviderTitle,
          subTitle: m.settingsInfoProviderSubtitle,
        }),
      ],
    }),
  ],
})
