import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSection,
} from '@island.is/application/core'
import { externalData } from '../../lib/messages'

export const externalDataSection = buildSection({
  id: 'externalData',
  title: externalData.dataProvider.sectionTitle,
  children: [
    buildExternalDataProvider({
      title: externalData.dataProvider.pageTitle,
      id: 'approveExternalData',
      subTitle: externalData.dataProvider.subTitle,
      checkboxLabel: externalData.dataProvider.checkboxLabel,
      dataProviders: [
        buildDataProviderItem({
          id: 'nationalRegistry',
          type: 'NationalRegistryProvider',
          title: externalData.userProfile.title,
          subTitle: externalData.userProfile.subTitle,
        }),
        buildDataProviderItem({
          id: 'userProfile',
          type: 'UserProfileProvider',
          title: externalData.userProfile.title,
          subTitle: externalData.userProfile.subTitle,
        }),
        buildDataProviderItem({
          id: 'payment',
          type: 'PaymentChargeInfoProvider',
          title: '',
        }),
        buildDataProviderItem({
          id: 'currentVehicleList',
          type: 'CurrentVehiclesProvider',
          title: externalData.currentVehicles.title,
          subTitle: externalData.currentVehicles.subTitle,
        }),
      ],
    }),
  ],
})
