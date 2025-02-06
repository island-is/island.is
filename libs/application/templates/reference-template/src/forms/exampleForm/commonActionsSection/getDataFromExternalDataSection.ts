import {
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
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
          title: '',
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
        buildTextField({
          id: 'testTextField',
          title: 'Text field',
          width: 'half',
        }),
        buildFieldsRepeaterField({
          id: 'testRepeater',
          title: 'Repeater',
          fields: {
            select: {
              component: 'select',
              label: 'Select',
              width: 'half',
              options: [
                { label: 'Option 1', value: 'option1' },
                { label: 'Option 2', value: 'option2' },
                { label: 'Option 3', value: 'option3' },
                { label: 'Option 4', value: 'option4' },
                { label: 'Option 5', value: 'option5' },
              ],
            },
          },
        }),
        buildSelectField({
          condition: (answers) => {
            const test = getValueViaPath<Array<{ select: string }>>(
              answers,
              'testRepeater',
            )
            return test && test.length > 1 ? true : false
          },
          id: 'externalDataSuccessRepeaterSelect',
          title: 'Select',
          width: 'half',
          options: (application: Application) => {
            const testSelect = getValueViaPath<Array<{ select: string }>>(
              application.answers,
              'testRepeater',
            )

            return testSelect
              ?.map((option) => {
                if (!option.select) {
                  return null
                }
                return {
                  label: option.select,
                  value: option.select,
                }
              })
              .filter(Boolean) as Array<{ label: string; value: string }>
          },
        }),
        // buildAsyncSelectField({
        //   id: 'asyncTest',
        //   title: 'Async select',
        //   width: 'half',
        //   updateOnSelect: 'testRepeater',
        //   loadOptions: async () => {
        //     return [
        //       { label: 'Option 1', value: 'option1' },
        //       { label: 'Option 2', value: 'option2' },
        //       { label: 'Option 3', value: 'option3' },
        //       { label: 'Option 4', value: 'option4' },
        //       { label: 'Option 5', value: 'option5' },
        //     ]
        //   },
        // }),
      ],
    }),
  ],
})
