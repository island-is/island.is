import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import {
  ChildrenCustodyInformationApiV3,
  Form,
  FormModes,
  HealthInsuranceStatementsApi,
  NationalRegistryV3SpouseApi,
  NationalRegistryV3UserApi,
  UserProfileApi,
} from '@island.is/application/types'
import { application } from '../lib/messages'
import { IcelandHealthLogo } from '@island.is/application/assets/institution-logos'
import { prerequisites } from '../lib/messages/prerequisites'

export const Prerequisites: Form = buildForm({
  id: 'HealthInsuranceDeclarationPrerequsites',
  title: application.general.name,
  mode: FormModes.DRAFT,
  logo: IcelandHealthLogo,
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
              provider: NationalRegistryV3UserApi,
              title: prerequisites.dataProviders.nationalRegistryTitle,
              subTitle: prerequisites.dataProviders.nationalRegistryDescription,
            }),
            buildDataProviderItem({
              provider: ChildrenCustodyInformationApiV3,
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              provider: NationalRegistryV3SpouseApi,
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: prerequisites.dataProviders.userProfileTitle,
              subTitle: prerequisites.dataProviders.userProfileDescription,
            }),
            buildDataProviderItem({
              provider: HealthInsuranceStatementsApi,
              title: prerequisites.dataProviders.healthInsuranceTitle,
              subTitle: prerequisites.dataProviders.healthInsuranceDescription,
            }),
          ],
        }),
      ],
    }),
  ],
})
