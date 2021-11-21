import {
  buildCustomField,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildMultiField,
  buildSection,
  buildSubSection,
} from '@island.is/application/core'
import { externalData } from '../../lib/messages'
import { DataProviderTypes } from '../../types'

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
        }),
        buildCustomField(
          {
            id: 'extrainformationWithDataprovider',
            title: '',
            component: 'DescriptionWithLink',
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
              type: '',
              title: externalData.directoryOfLabor.title,
              subTitle: externalData.directoryOfLabor.description,
            }),
            buildDataProviderItem({
              id: 'revAndCustoms',
              type: '',
              title: externalData.revAndCustoms.title,
              subTitle: externalData.revAndCustoms.description,
            }),
            buildDataProviderItem({
              id: 'nationalInsurancy',
              type: '',
              title: externalData.nationalInsurancy.title,
              subTitle: externalData.nationalInsurancy.description,
            }),
            buildDataProviderItem({
              id: 'municipalCollectionAgency',
              type: '',
              title: externalData.municipalCollectionAgency.title,
              subTitle: externalData.municipalCollectionAgency.description,
            }),
            buildDataProviderItem({
              id: 'nationalRegistry',
              type: DataProviderTypes.NationalRegistry,
              title: externalData.nationalRegistry.title,
              subTitle: externalData.nationalRegistry.description,
            }),
            buildDataProviderItem({
              id: 'accidentProvider',
              type: '',
              title: '',
              subTitle: externalData.accidentProvider.description,
            }),
          ],
        }),
      ],
    }),
  ],
})
