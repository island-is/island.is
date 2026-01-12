import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { AoshLogo } from '@island.is/application/assets/institution-logos'
import { externalData } from '../lib/messages'
import {
  IdentityApi,
  LicensesApi,
  RegistrationNumberPrefixApi,
  UserProfileApiWithValidation,
} from '../dataProviders'

export const PrerequisitesForm: Form = buildForm({
  id: 'PrerequisitesForm',
  title: '',
  logo: AoshLogo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'informationSection',
      children: [
        buildExternalDataProvider({
          title: externalData.dataProvider.pageTitle,
          id: 'approveExternalData',
          subTitle: externalData.dataProvider.subTitle,
          checkboxLabel: externalData.dataProvider.checkboxLabel,
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            title: '',
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: coreMessages.buttonNext,
                type: 'primary',
              },
            ],
          }),
          dataProviders: [
            buildDataProviderItem({
              provider: IdentityApi,
              title: externalData.nationalRegistry.title,
              subTitle: externalData.nationalRegistry.subTitle,
            }),
            buildDataProviderItem({
              provider: UserProfileApiWithValidation,
              title: externalData.userProfile.title,
              subTitle: externalData.userProfile.subTitle,
            }),
            buildDataProviderItem({
              provider: LicensesApi,
              title: externalData.licenses.title,
              subTitle: externalData.licenses.subTitle,
            }),
            buildDataProviderItem({
              provider: RegistrationNumberPrefixApi,
              title: '',
              subTitle: '',
            }),
          ],
        }),
      ],
    }),
  ],
})
