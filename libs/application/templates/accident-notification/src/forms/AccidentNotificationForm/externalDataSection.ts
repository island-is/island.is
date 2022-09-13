import {
  buildCustomField,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildMultiField,
  buildSection,
  buildSubSection,
} from '@island.is/application/core'
import { NationalRegistryUserApi } from '@island.is/application/types'
import { externalData } from '../../lib/messages'

export const externalDataSection = buildSection({
  id: 'ExternalDataSection',
  title: 'Meðferð á gögnum',
  children: [
    buildMultiField({
      title: externalData.agreementDescription.sectionTitle,
      id: 'agreementDescriptionMultiField',
      space: 2,
      children: [
        buildCustomField({
          id: 'agreementDescriptionCustomField',
          title: '',
          component: 'AgreementDescription',
          doesNotRequireAnswer: true,
        }),
        buildCustomField(
          {
            id: 'extrainformationWithDataprovider',
            title: '',
            component: 'DescriptionWithLink',
            doesNotRequireAnswer: true,
          },
          {
            descriptionFirstPart: externalData.extraInformation.description,
            descriptionSecondPart: '',
            linkName: externalData.extraInformation.linkText,
            url: externalData.extraInformation.link,
          },
        ),
      ],
    }),
    buildSubSection({
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
    }),
  ],
})
