import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { externalData } from '../../lib/messages'
import { NationalRegistryUserApi } from '../../dataProviders'

export const externalDataSection = buildSection({
  id: 'ExternalDataRegularSection',
  title: externalData.dataProvider.sectionTitle,
  children: [
    buildExternalDataProvider({
      title: externalData.dataProvider.pageTitle,
      id: 'approveExternalData',
      subTitle: externalData.dataProvider.subTitle,
      description: '',
      checkboxLabel: externalData.dataProvider.checkboxLabel,
      submitField: buildSubmitField({
        id: 'submit',
        placement: 'footer',
        refetchApplicationAfterSubmit: true,
        actions: [
          {
            event: 'SUBMIT',
            name: coreMessages.buttonNext,
            type: 'primary',
          },
        ],
      }),
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
