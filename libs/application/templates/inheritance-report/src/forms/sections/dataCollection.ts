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
          //provider: TBD,
          title: m.deceasedInfoProviderTitle,
          subTitle: m.deceasedInfoProviderSubtitle,
        }),
        buildDataProviderItem({
          provider: NationalRegistryUserApi,
          title: m.personalInfoProviderTitle,
          subTitle: m.personalInfoProviderSubtitle,
        }),
        buildDataProviderItem({
          //provider: TBD,
          title: m.financialInformationProviderTitle,
          subTitle: m.financialInformationProviderSubtitle,
        }),
        buildDataProviderItem({
          provider: UserProfileApi,
          title: m.settingsInfoProviderTitle,
          subTitle: m.settingsInfoProviderSubtitle,
        }),
        buildDataProviderItem({
          //TODO: provider: TBD,
          title: m.funeralExpensesTitle,
          subTitle: m.funeralExpensesSubtitle,
        }),
      ],
    }),
  ],
})
