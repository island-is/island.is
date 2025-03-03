import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'

export const getDataFromExternalDataSection = buildSection({
  id: 'getDataFromExternalData',
  title: 'External data',
  children: [
    buildMultiField({
      id: 'externalDataSuccess',
      children: [
        buildDescriptionField({
          id: 'externalDataSuccessTitle',
          title: 'Example of data being fetched from external data',
          marginBottom: [4],
        }),
        buildDescriptionField({
          id: 'externalDataSuccessDescription',
          title: 'Value from data provider',
          titleVariant: 'h4',
          description: (application: Application) => {
            const value = getValueViaPath<string>(
              application.externalData,
              'getReferenceData.data.referenceData.applicantName',
            )

            return value ?? 'Not found'
          },
        }),
        buildDescriptionField({
          id: 'externalDataSuccessDescription2',
          description: (application: Application) => {
            const value = getValueViaPath<number>(
              application.externalData,
              'getReferenceData.data.referenceData.numbers',
            )

            return value ? `${value}` : 'Not found'
          },
          marginBottom: [2],
        }),
        buildDescriptionField({
          id: 'externalDataSuccessDescriptionMock',
          title: 'Value from mock data provider',
          titleVariant: 'h4',
          description: (application: Application) => {
            const value = getValueViaPath<string>(
              application.externalData,
              'referenceMock.data.mockObject.mockString',
            )
            return value ?? 'Not found'
          },
        }),
      ],
    }),
  ],
})
