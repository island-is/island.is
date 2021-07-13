import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildMultiField,
  buildCustomField,
} from '@island.is/application/core'
import Logo from '@island.is/application/templates/family-matters-core/assets/Logo'
import { DataProviderTypes } from '../types'
import { externalData, application } from '../lib/messages'

export const InformationAndDataProviderForm: Form = buildForm({
  id: 'InformationAndDataProviderForm',
  title: application.general.name,
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'informationAndDataProviderForm',
      title: externalData.agreementDescription.sectionTitle,
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
      ],
    }),
    buildSection({
      id: 'informationAndDataProviderForm',
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
              id: 'userProfile',
              type: DataProviderTypes.UserProfile,
              title: externalData.userProfile.title,
              subTitle: externalData.userProfile.description,
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
          ],
        }),
      ],
    }),
  ],
})
