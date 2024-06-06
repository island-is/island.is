import get from 'lodash/get'
import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildTextField,
  buildKeyValueField,
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
      id: 'testMultiFieldSpaces',
      title: 'Test MultiField Spaces',
      children: [
        buildMultiField({
          id: 'testMultiFieldSpaces',
          title: 'Test MultiField Spaces',
          space: 'containerGutter',
          children: [
            buildKeyValueField({
              label: 'Test MultiField Spaces',
              condition: (answers) => true,
              value: 'Test MultiField Spaces',
            }),
            buildKeyValueField({
              label: 'Test MultiField Spaces',
              condition: (answers) => true,
              value: 'Test MultiField Spaces',
            }),
            buildKeyValueField({
              label: 'Test MultiField Spaces',
              condition: (answers) => true,
              value: 'Test MultiField Spaces',
            }),
            buildKeyValueField({
              label: 'Test MultiField Spaces',
              condition: (answers) => false,
              value: 'Test MultiField Spaces',
            }),
            buildDescriptionField({
              id: 'testMultiFieldSpacesDescription',
              title: 'Test MultiField Spaces Description',
              description: 'This is a test description',
              condition: (formValue) => false,
            }),
            buildDescriptionField({
              id: 'testMultiFieldSpacesDescriptionA',
              title: 'Test MultiField Spaces DescriptionA',
              description: 'This is a test descriptionA',
            }),
            buildTextField({
              id: 'injuredPersonInformation.jobTitle',
              title: 'testInput',
              backgroundColor: 'blue',
              width: 'full',
              maxLength: 100,
            }),
            buildDescriptionField({
              id: 'testMultiFieldSpacesDescriptionAA',
              title: 'Test MultiField Spaces DescriptionAA',
              description: 'This is a test descriptionAA',
              condition: (formValue) => false,
              space: 'gutter',
            }),
            buildDescriptionField({
              id: 'testMultiFieldSpacesDescriptionAAA',
              title: 'Test MultiField Spaces DescriptionAAA',
              description: 'This is a test descriptionAAA',
              space: 'gutter',
            }),
            buildDescriptionField({
              id: 'testMultiFieldSpacesDescriptionAAA',
              title: 'Test MultiField Spaces DescriptionAAAA',
              description: 'This is a test descriptionAAAA',
            }),
          ],
        }),
      ],
    }),
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
