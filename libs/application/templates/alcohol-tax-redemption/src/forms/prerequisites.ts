import {
  buildExternalDataProvider,
  buildDataProviderItem,
  buildForm,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { Form, FormModes, UserProfileApi } from '@island.is/application/types'
import { externalData } from '../lib/messages'

export const prerequisitesForm: Form = buildForm({
  id: 'PrerequisiteForm',
  title: 'test',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.sectionTitle,
      children: [
        buildExternalDataProvider({
          title: externalData.title,
          id: 'dataProviders',
          checkboxLabel: externalData.checkboxLabel,
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            title: externalData.submitButtonTitle,
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: 'SUBMIT',
                name: externalData.submitButtonTitle,
                type: 'primary',
              },
            ],
          }),
          dataProviders: [
            buildDataProviderItem({
              provider: UserProfileApi,
              title: externalData.userProfileTitle,
              subTitle: externalData.userProfileSubTitle,
            }),
          ],
        }),
      ],
    }),
  ],
})
