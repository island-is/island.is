import {
  buildForm,
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildSubmitField,
  buildMultiField,
  buildDescriptionField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { externalData } from '../lib/messages'

export const PrerequisitesForm: Form = buildForm({
  id: 'PrerequisitesForm',
  title: '',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
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
              id: 'nationalRegistry',
              type: 'NationalRegistryProvider',
              title: externalData.nationalRegistry.title,
              subTitle: externalData.nationalRegistry.subTitle,
            }),
            buildDataProviderItem({
              id: 'userProfile',
              type: 'UserProfileProvider',
              title: externalData.userProfile.title,
              subTitle: externalData.userProfile.subTitle,
            }),
          ],
        }),
        buildMultiField({
          id: 'getDataSuccess',
          title: externalData.dataProvider.getDataSuccess,
          description: externalData.dataProvider.getDataSuccessDescription,
          children: [
            buildDescriptionField({
              id: 'getDataSuccess.nationalRegistry',
              title: externalData.nationalRegistry.title,
              description: externalData.nationalRegistry.subTitle,
              titleVariant: 'h4',
            }),
            buildDescriptionField({
              id: 'getDataSuccess.userProfile',
              title: externalData.userProfile.title,
              description: externalData.userProfile.subTitle,
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
                  event: 'SUBMIT',
                  name: externalData.dataProvider.submitButton,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
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
