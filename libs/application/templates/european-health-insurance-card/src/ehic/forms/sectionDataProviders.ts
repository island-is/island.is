import {
  buildExternalDataProvider,
  buildDataProviderItem,
  buildSection,
} from '@island.is/application/core'

export const sectionDataProviders = buildSection({
  id: 'externalData',
  title: 'm.dataCollectionTitle',
  children: [
    buildExternalDataProvider({
      id: 'approveExternalData',
      title: 'm.dataCollectionTitle',
      dataProviders: [
        buildDataProviderItem({
          id: 'nationalRegistry',
          type: 'NationalRegistryProvider',
          title: 'm.dataCollectionNationalRegistryTitle',
          subTitle: 'm.dataCollectionNationalRegistrySubtitle',
        }),
      ],
    }),
  ],
})
