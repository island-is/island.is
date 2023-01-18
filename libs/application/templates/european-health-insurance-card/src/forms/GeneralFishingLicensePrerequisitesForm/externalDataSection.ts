import {
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildCustomField,
} from '@island.is/application/core'
import {
  DepartmentOfFisheriesPaymentCatalogApi,
  ShipRegistryApi,
  IdentityApi,
} from '../../dataProviders'
import { europeanHealthInsuranceCardApplicationMessages as m } from '../../ehic/lib/messages'

export const externalDataSection = buildSection({
  id: 'ExternalDataSection',
  title: m.introScreen.sectionDescription,
  children: [
    buildExternalDataProvider({
      title: m.introScreen.sectionDescription,
      id: 'approveExternalData',
      subTitle: 'externalData.dataProvider.subTitle',
      description: 'externalData.extraInformation.description',
      checkboxLabel: 'externalData.dataProvider.checkboxLabel',
      dataProviders: [
        buildDataProviderItem({
          provider: IdentityApi,
          title: 'externalData.nationalRegistry.title',
          subTitle: 'externalData.nationalRegistry.description',
        }),
        buildDataProviderItem({
          provider: ShipRegistryApi,
          title: 'externalData.directoryOfFisheries.title',
          subTitle: 'externalData.directoryOfFisheries.description',
        }),
        buildDataProviderItem({
          provider: DepartmentOfFisheriesPaymentCatalogApi,
          title: 'externalData.userProfile.title',
          subTitle: 'externalData.userProfile.description',
        }),
      ],
    }),
    buildMultiField({
      id: 'getDataSuccess',
      title: 'externalData.dataProvider.getDataSuccess',
      description: 'externalData.dataProvider.getDataSuccessDescription',
      children: [
        buildDescriptionField({
          id: 'getDataSuccess.directoryOfFisheries',
          title: 'externalData.directoryOfFisheries.title',
          description: 'externalData.directoryOfFisheries.description',
          titleVariant: 'h4',
        }),
        buildDescriptionField({
          id: 'getDataSuccess.nationalRegistry',
          title: 'externalData.nationalRegistry.title',
          description: 'externalData.nationalRegistry.description',
          titleVariant: 'h4',
          space: 'gutter',
        }),
        buildDescriptionField({
          id: 'getDataSuccess.feeInfoProvider',
          title: 'externalData.userProfile.title',
          description: 'externalData.userProfile.description',
          titleVariant: 'h4',
          space: 'gutter',
        }),
        buildCustomField(
          {
            id: 'introScreen',
            title: 'HVaða hvaða', //e.introScreen.sectionTitle,
            component: 'IntroScreen',
          },
          {
            subTitle: 'e.introScreen.sectionDescription',
          },
        ),
      ],
    }),

    // Has to be here so that the submit button appears (does not appear if no screen is left).
    // Tackle that as AS task.
    buildDescriptionField({
      id: 'unused',
      title: '',
      description: '',
    }),
  ],
})
