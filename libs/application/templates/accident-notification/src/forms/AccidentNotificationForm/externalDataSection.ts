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
      children: [
        buildCustomField({
          id: 'agreementDescriptionCustomField',
          title: '',
          component: 'AgreementDescription',
        }),
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
              id: 'nationalRegistry',
              type: DataProviderTypes.NationalRegistry,
              title: externalData.nationalRegistry.title,
              subTitle: externalData.nationalRegistry.description,
            }),
            buildDataProviderItem({
              id: 'revAndCustoms',
              type: '',
              title: externalData.revAndCustoms.title,
              subTitle: externalData.revAndCustoms.description,
            }),
            buildDataProviderItem({
              id: 'notifications',
              type: '',
              title: externalData.notifications.title,
              subTitle: externalData.notifications.description,
            }),
            buildDataProviderItem({
              id: 'accidentProvider',
              type: '',
              title: externalData.accidentProvider.title,
              subTitle: externalData.accidentProvider.description,
            }),
          ],
        }),
      ],
    }),
  ],
})
