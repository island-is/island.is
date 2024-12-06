import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'

export const getDataFromExternalDataSubsection = buildSubSection({
  id: 'getDataFromExternalData',
  title: 'External data',
  children: [
    buildMultiField({
      id: 'externalDataSuccess',
      title: '',
      children: [
        buildDescriptionField({
          id: 'externalDataSuccessTitle',
          title: 'Dæmi um að gögn séu sótt úr external data',
          marginBottom: [4],
        }),
        buildDescriptionField({
          id: 'externalDataSuccessDescription',
          title: 'Gildi frá data provider',
          titleVariant: 'h4',
          description: (application: Application) => {
            const value = getValueViaPath<string>(
              application.externalData,
              'getReferenceData.data.referenceData.applicantName',
            )

            return value ?? 'Fannst ekki'
          },
        }),
        buildDescriptionField({
          id: 'externalDataSuccessDescription2',
          title: '',
          description: (application: Application) => {
            const value = getValueViaPath<number>(
              application.externalData,
              'getReferenceData.data.referenceData.numbers',
            )

            return value ? `${value}` : 'Fannst ekki'
          },
          marginBottom: [2],
        }),
        buildDescriptionField({
          id: 'externalDataSuccessDescriptionMock',
          title: 'Gildi frá mock data provider',
          titleVariant: 'h4',
          description: (application: Application) => {
            const value = getValueViaPath<string>(
              application.externalData,
              'referenceMock.data.mockObject.mockString',
            )
            return value ?? 'Fannst ekki'
          },
        }),
      ],
    }),
  ],
})
