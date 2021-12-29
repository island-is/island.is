import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSection,
} from '@island.is/application/core'
import { externalData } from '../../lib/messages'
import { DataProviderTypes } from '../../types'

export const externalDataSection = buildSection({
  id: 'ExternalDataSection',
  title: externalData.dataProvider.sectionTitle,
  children: [
    buildExternalDataProvider({
      title: externalData.dataProvider.pageTitle,
      id: 'approveExternalData',
      subTitle: externalData.dataProvider.subTitle,
      description: externalData.extraInformation.description,
      checkboxLabel: externalData.dataProvider.checkboxLabel,
      dataProviders: [
        buildDataProviderItem({
          id: 'directoryOfFisheries',
          type: '',
          title: externalData.directoryOfFisheries.title,
          subTitle: externalData.directoryOfFisheries.description,
        }),
        buildDataProviderItem({
          id: 'nationalRegistry',
          type: DataProviderTypes.NationalRegistry,
          title: externalData.nationalRegistry.title,
          subTitle: externalData.nationalRegistry.description,
        }),
        buildDataProviderItem({
          id: 'revAndCustoms',
          type: '',
          title: externalData.userProfile.title,
          subTitle: externalData.userProfile.description,
        }),
      ],
    }),
  ],
})
