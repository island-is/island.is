import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import Logo from '../assets/Logo'
import { pensionSupplementFormMessage } from '../lib/messages'

export const PrerequisitesForm: Form = buildForm({
  id: 'HousholdSupplementPrerequisites',
  title: pensionSupplementFormMessage.shared.formTitle,
  logo: Logo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: pensionSupplementFormMessage.pre.externalDataSection,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: pensionSupplementFormMessage.pre.externalDataSection,
          checkboxLabel: pensionSupplementFormMessage.pre.checkboxProvider,
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            title: pensionSupplementFormMessage.pre.startApplication,
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: 'SUBMIT',
                name: pensionSupplementFormMessage.pre.startApplication,
                type: 'primary',
              },
            ],
          }),
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryUserApi,
              title: pensionSupplementFormMessage.pre.skraInformationTitle,
              subTitle:
                pensionSupplementFormMessage.pre.skraInformationSubTitle,
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title:
                pensionSupplementFormMessage.pre.userProfileInformationTitle,
              subTitle:
                pensionSupplementFormMessage.pre.userProfileInformationSubTitle,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'info',
      title: pensionSupplementFormMessage.info.section,
      children: [],
    }),
    buildSection({
      id: 'additionalInfo',
      title: pensionSupplementFormMessage.additionalInfo.section,
      children: [],
    }),
    buildSection({
      id: 'confirm',
      title: pensionSupplementFormMessage.confirm.section,
      children: [],
    }),
  ],
})
