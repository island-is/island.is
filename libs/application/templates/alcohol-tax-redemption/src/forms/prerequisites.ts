import {
  buildExternalDataProvider,
  buildDataProviderItem,
  buildForm,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  NationalRegistryUserApi,
} from '@island.is/application/types'
import { externalData } from '../lib/messages'

export const prerequisitesForm: Form = buildForm({
  id: 'PrerequisiteForm',
  title: externalData.formTitle,
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
          id: 'approveExternalData',
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
              id: 'nationalRegistry',
              provider: NationalRegistryUserApi,
              title: externalData.userProfileTitle,
              subTitle: externalData.userProfileSubTitle,
            }),
            buildDataProviderItem({
              id: 'rsk',
              title: externalData.rskTitle,
              subTitle: externalData.rskSubTitle,
            }),
            buildDataProviderItem({
              id: 'sysludmadur',
              title: externalData.sysludmadurTitle,
              subTitle: externalData.sysludmadurSubTitle,
            }),
            buildDataProviderItem({
              id: 'atvr',
              title: externalData.atvrTitle,
              subTitle: externalData.atvrSubTitle,
            }),
          ],
        }),
      ],
    }),
  ],
})
