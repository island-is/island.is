import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  HealthInsuranceApi,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import { application } from '../lib/messages'
import Logo from '../assets/Logo'
import { prerequisites } from '../lib/messages/prerequsites'

export const Prerequisites: Form = buildForm({
  id: 'HealthInsuranceDeclarationPrerequsites',
  title: application.general.name,
  mode: FormModes.DRAFT,
  logo: Logo,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'prerequisites',
      title: prerequisites.general.sectionTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: prerequisites.general.sectionTitle,
          subTitle: prerequisites.general.subTitle,
          checkboxLabel: prerequisites.general.checkboxLabel,
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            title: '',
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: 'SUBMIT',
                name: coreMessages.buttonNext,
                type: 'primary',
              },
            ],
          }),
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryUserApi,
              title: prerequisites.dataProviders.nationalRegistryTitle,
              subTitle: prerequisites.dataProviders.nationalRegistryDescription,
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: prerequisites.dataProviders.userProfileTitle,
              subTitle: prerequisites.dataProviders.userProfileDescription,
            }),
            buildDataProviderItem({
              provider: HealthInsuranceApi,
              title: prerequisites.dataProviders.healthInsuranceTitle,
              subTitle: prerequisites.dataProviders.healthInsuranceDescription,
            }),
          ],
        }),
      ],
    }),
  ],
})
