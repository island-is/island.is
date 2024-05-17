import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSubSection,
} from '@island.is/application/core'
import { externalData } from '../../../lib/messages'
import { NationalRegistryUserApi } from '@island.is/application/types'

export const accidentNotificationSubSection = buildSubSection({
  id: 'AccidentNotificationForm',
  title: externalData.dataProvider.sectionTitle,
  children: [
    buildExternalDataProvider({
      title: externalData.dataProvider.pageTitle,
      id: 'approveExternalData',
      subTitle: externalData.dataProvider.subTitle,
      description: '',
      checkboxLabel: externalData.dataProvider.checkboxLabel,
      dataProviders: [
        buildDataProviderItem({
          id: 'directoryOfLabor',
          title: externalData.directoryOfLabor.title,
          subTitle: externalData.directoryOfLabor.description,
        }),
        buildDataProviderItem({
          id: 'revAndCustoms',
          title: externalData.revAndCustoms.title,
          subTitle: externalData.revAndCustoms.description,
        }),
        buildDataProviderItem({
          id: 'nationalInsurancy',
          title: externalData.nationalInsurancy.title,
          subTitle: externalData.nationalInsurancy.description,
        }),
        buildDataProviderItem({
          id: 'municipalCollectionAgency',
          title: externalData.municipalCollectionAgency.title,
          subTitle: externalData.municipalCollectionAgency.description,
        }),
        buildDataProviderItem({
          provider: NationalRegistryUserApi,
          title: externalData.nationalRegistry.title,
          subTitle: externalData.nationalRegistry.description,
        }),
        buildDataProviderItem({
          id: 'accidentProvider',
          title: '',
          subTitle: externalData.accidentProvider.description,
        }),
      ],
    }),
  ],
})
