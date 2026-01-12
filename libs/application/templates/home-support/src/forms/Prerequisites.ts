import {
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import {
  NationalRegistryUserApi,
  NationalRegistryCohabitantsApi,
  UserProfileApi,
  HealthCenterApi,
} from '../dataProviders'
import { prerequisites, application } from '../lib/messages'

export const Prerequisites: Form = buildForm({
  id: 'HomeSupportPrerequisites',
  title: application.general.name,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'prerequisitesInfo',
      title: prerequisites.general.infoTitle,
      children: [
        buildDescriptionField({
          id: 'prerequisitesInfoTitle',
          title: prerequisites.general.infoTitle,
          description: prerequisites.general.infoDescription,
          space: 2,
        }),
      ],
    }),
    buildSection({
      id: 'prerequisites',
      title: prerequisites.general.sectionTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: prerequisites.general.sectionTitle,
          subTitle: coreMessages.externalDataTitle,
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
              provider: NationalRegistryUserApi,
              title: prerequisites.dataProviders.nationalRegistryTitle,
              subTitle: prerequisites.dataProviders.nationalRegistryDescription,
            }),
            buildDataProviderItem({
              provider: NationalRegistryCohabitantsApi,
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: prerequisites.dataProviders.userProfileTitle,
              subTitle: prerequisites.dataProviders.userProfileDescription,
            }),
            buildDataProviderItem({
              id: 'internalRevenue',
              type: undefined,
              title: prerequisites.dataProviders.internalRevenueTitle,
              subTitle: prerequisites.dataProviders.internalRevenueDescription,
            }),
            buildDataProviderItem({
              provider: HealthCenterApi,
              title: prerequisites.dataProviders.healthInsuranceTitle,
              subTitle: prerequisites.dataProviders.healthInsuranceDescription,
            }),
          ],
        }),
      ],
    }),
  ],
})
