import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { MmsLogo } from '@island.is/application/assets/institution-logos'
import { externalData } from '../lib/messages'
import {
  NationalRegistryCustodiansApi,
  NationalRegistryUserApi,
  SchoolsApi,
  StudentInfoApi,
  UserProfileApiWithValidation,
} from '../dataProviders'

export const Prerequisites: Form = buildForm({
  id: 'PrerequisitesForm',
  logo: MmsLogo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: '',
      tabTitle: externalData.dataProvider.sectionTitle,
      children: [
        buildExternalDataProvider({
          title: externalData.dataProvider.pageTitle,
          id: 'approveExternalData',
          subTitle: externalData.dataProvider.subTitle,
          checkboxLabel: externalData.dataProvider.checkboxLabel,
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: externalData.dataProvider.submitButton,
                type: 'primary',
              },
            ],
          }),
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryUserApi,
              title: externalData.nationalRegistry.title,
              subTitle: externalData.nationalRegistry.subTitle,
            }),
            buildDataProviderItem({
              provider: NationalRegistryCustodiansApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: UserProfileApiWithValidation,
              title: externalData.userProfile.title,
              subTitle: externalData.userProfile.subTitle,
            }),
            buildDataProviderItem({
              provider: SchoolsApi,
              title: externalData.educationalCareer.title,
              subTitle: externalData.educationalCareer.subTitle,
            }),
            buildDataProviderItem({
              provider: StudentInfoApi,
              title: '',
            }),
          ],
        }),
      ],
    }),
  ],
})
