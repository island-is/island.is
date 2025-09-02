import {
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import {
  DepartmentOfFisheriesPaymentCatalogApi,
  ShipRegistryApi,
  IdentityApi,
  MockPaymentCatalog,
} from '../../dataProviders'
import { externalData } from '../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'

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
          provider: IdentityApi,
          title: externalData.nationalRegistry.title,
          subTitle: externalData.nationalRegistry.description,
        }),
        buildDataProviderItem({
          provider: ShipRegistryApi,
          title: externalData.directoryOfFisheries.title,
          subTitle: externalData.directoryOfFisheries.description,
        }),
        buildDataProviderItem({
          provider: DepartmentOfFisheriesPaymentCatalogApi,
          title: externalData.userProfile.title,
          subTitle: externalData.userProfile.description,
        }),
        buildDataProviderItem({
          provider: MockPaymentCatalog,
        }),
      ],
    }),
    buildMultiField({
      id: 'getDataSuccess',
      title: externalData.dataProvider.getDataSuccess,
      description: externalData.dataProvider.getDataSuccessDescription,
      children: [
        buildDescriptionField({
          id: 'getDataSuccess.directoryOfFisheries',
          title: externalData.directoryOfFisheries.title,
          description: externalData.directoryOfFisheries.description,
          titleVariant: 'h4',
        }),
        buildDescriptionField({
          id: 'getDataSuccess.nationalRegistry',
          title: externalData.nationalRegistry.title,
          description: externalData.nationalRegistry.description,
          titleVariant: 'h4',
          space: 'gutter',
        }),
        buildDescriptionField({
          id: 'getDataSuccess.feeInfoProvider',
          title: externalData.userProfile.title,
          description: externalData.userProfile.description,
          titleVariant: 'h4',
          space: 'gutter',
        }),
        buildSubmitField({
          id: 'getDataSuccess.toDraft',
          title: externalData.dataProvider.submitButton,
          refetchApplicationAfterSubmit: true,
          placement: 'footer',
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: externalData.dataProvider.submitButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
    // Has to be here so that the submit button appears (does not appear if no screen is left).
    // Tackle that as AS task.
    buildDescriptionField({
      id: 'unused',
      description: '',
    }),
  ],
})
