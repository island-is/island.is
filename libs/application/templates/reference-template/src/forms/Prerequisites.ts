import get from 'lodash/get'
import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildExternalDataProvider,
  buildDataProviderItem,
} from '@island.is/application/core'
import { Application, Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

import {
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import { ReferenceDataApi, MyMockProvider } from '../dataProviders'

export const Prerequisites: Form = buildForm({
  id: 'PrerequisitesDraft',
  title: 'Skilyrði',
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'conditions',
      title: m.conditionsSection,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: 'Utanaðkomandi gögn',
          dataProviders: [
            buildDataProviderItem({
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
            }),
          ],
        }),
        buildMultiField({
          id: 'externalDataSuccess',
          title: 'Tókst að sækja gögn',
          children: [
            buildDescriptionField({
              id: 'externalDataSuccessDescription',
              title: '',
              description: (application: Application) =>
                `Gildið frá data provider: ${get(
                  application.externalData,
                  'getReferenceData.data.referenceData.numbers',
                  'fannst ekki',
                )}`,
            }),
            buildDescriptionField({
              id: 'externalDataSuccessDescription.mock',
              title: '',
              description: (application: Application) =>
                `Gildið frá mock data provider: ${get(
                  application.externalData,
                  'referenceMock.data.mockObject.mockString',
                  'fannst ekki',
                )}`,
            }),
            buildSubmitField({
              id: 'toDraft',
              placement: 'footer',
              title: 'Hefja umsókn',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: 'SUBMIT',
                  name: 'Hefja umsókn',
                  type: 'primary',
                },
              ],
            }),
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
      id: 'intro',
      title: m.introSection,
      children: [],
    }),
    buildSection({
      id: 'career',
      title: m.career,
      children: [],
    }),
    buildSection({
      id: 'confirmation',
      title: 'Staðfesta',
      children: [],
    }),
  ],
})
