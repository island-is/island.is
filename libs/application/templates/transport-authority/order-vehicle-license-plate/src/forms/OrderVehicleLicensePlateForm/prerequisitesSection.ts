import {
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
} from '@island.is/application/core'
import { externalData } from '../../lib/messages'
import {
  CurrentVehiclesApi,
  DeliveryStationsApi,
  IdentityApi,
  MockableSamgongustofaPaymentCatalogApi,
  PlateTypesApi,
  SamgongustofaPaymentCatalogApi,
} from '../../dataProviders'

export const prerequisitesSection = buildSection({
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
          provider: CurrentVehiclesApi,
          title: externalData.currentVehicles.title,
          subTitle: externalData.currentVehicles.subTitle,
        }),
        buildDataProviderItem({
          provider: IdentityApi,
        }),
        buildDataProviderItem({
          provider: SamgongustofaPaymentCatalogApi,
        }),
        buildDataProviderItem({
          provider: MockableSamgongustofaPaymentCatalogApi,
        }),
        buildDataProviderItem({
          provider: DeliveryStationsApi,
        }),
        buildDataProviderItem({
          provider: PlateTypesApi,
        }),
      ],
    }),
  ],
})
