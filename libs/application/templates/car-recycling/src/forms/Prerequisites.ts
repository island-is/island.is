import {
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import Logo from '../assets/Logo'
import { carRecyclingMessages } from '../lib/messages'

export const Prerequisites: Form = buildForm({
  id: 'CarRecyclingPrerequisites',
  title: carRecyclingMessages.shared.formTitle,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'prerequisites',
      title: carRecyclingMessages.pre.prerequisitesSection,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: 'Utanaðkomandi gögn',
          dataProviders: [
            /* buildDataProviderItem({
              provider: UserProfileApi,
              title: 'User profile',
              subTitle: 'User profile',
            }),
            buildDataProviderItem({
              provider: ReferenceDataApi,
              title: 'getReferenceData',
              subTitle: 'Reference data',
            }),
            buildDataProviderItem({
              provider: NationalRegistryUserApi,
              title: 'Þjóðskrá',
              subTitle: 'Upplýsingar um þig í Þjóðskrá.',
            }),
            buildDataProviderItem({
              provider: MyMockProvider,
              title: 'Mock Data',
              subTitle: 'Returns data for mocking',
            }),*/
          ],
        }),
        buildDescriptionField({
          id: 'neverDisplayed',
          title: '',
          description: '',
        }),
      ],
    }),
    buildSection({
      id: 'carsOverview',
      title: 'xxx-conditions',
      children: [],
    }),
    buildSection({
      id: 'confirm',
      title: 'xxx-confirmation',
      children: [],
    }),
  ],
})
