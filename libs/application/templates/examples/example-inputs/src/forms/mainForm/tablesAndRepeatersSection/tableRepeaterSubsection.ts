import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildTableRepeaterField,
  coreErrorMessages,
} from '@island.is/application/core'
import { friggSchoolsByMunicipalityQuery } from '../../../graphql/sampleQuery'
import { FriggSchoolsByMunicipality } from '../../../utils/types'

export const tableRepeaterSubsection = buildSubSection({
  id: 'repeater',
  title: 'Table Repeater',
  children: [
    buildMultiField({
      id: 'tableRepeater',
      title: 'Table Repeater Field',
      children: [
        buildDescriptionField({
          id: 'tableRepeaterDescription',
          description:
            'In the table repeater, you create a small form that the user fills out and the answers are then sorted into a table. Only one instance of this form is visible at a time. In the table, you can delete and edit rows, and you can disable this functionality. You can also insert data into the table from answers or external data, similar to staticTable.',
          marginBottom: 2,
        }),
        buildDescriptionField({
          id: 'tableRepeaterDescription2',
          description:
            'In the table repeater, you can use input, select, radio, checkbox, date, nationalIdWithName and phone as well as async select fields. The nationalIdWithName field can, just like the regular one, be set to enable company search. The async select fields can be used to load data from a remote source and they can also be set to update based on selections in other fields in the current form instance.',
        }),
        buildTableRepeaterField({
          id: 'tableRepeater',
          title: 'Table Repeater Field',
          formTitle: 'Table Repeater Form Title', // Todo: doesn't work
          addItemButtonText: 'Custom Add item text',
          saveItemButtonText: 'Custom Save item text',
          removeButtonTooltipText: 'Custom Remove item text',
          editButtonTooltipText: 'Custom Edit item text',
          editField: true,
          maxRows: 10,
          getStaticTableData: (_application) => {
            // Possibility to populate the table with data from the answers or external data
            // Populated data will not be editable or deletable
            // The prepopulated data will not be automatically run through the format function
            return [
              {
                input: 'John Doe',
                select: 'option 1',
                radio: 'option 2',
                checkbox: 'option 3',
                date: '2024-01-01',
                name: 'Test Name',
                nationalId: '000000-0000',
                phone: '6666666',
              },
              {
                input: 'Jane Doe',
                select: 'option 1',
                radio: 'option 2',
                checkbox: 'option 3',
                date: '2024-01-01',
                name: 'Test Name 2',
                nationalId: '100000-0000',
                phone: '6666666',
              },
            ]
          },
          // Possible fields: input, select, radio, checkbox, date, nationalIdWithName
          fields: {
            input: {
              component: 'input',
              label: 'Regular input',
              width: 'half',
              required: true,
              type: 'text',
            },
            select: {
              component: 'select',
              label: 'Select',
              width: 'half',
              options: [
                { label: 'Option 1', value: 'option1' },
                { label: 'Option 2', value: 'option2' },
              ],
            },
            radio: {
              component: 'radio',
              width: 'half',
              options: [
                { label: 'Option 1', value: 'option1' },
                { label: 'Option 2', value: 'option2' },
                { label: 'Option 3', value: 'option3' },
              ],
            },
            titleAboveCheckbox: {
              component: 'description',
              title: 'Title above checkbox',
              titleVariant: 'h5',
            },
            checkbox: {
              component: 'checkbox',
              options: [
                { label: 'Option 1', value: 'option1' },
                { label: 'Option 2', value: 'option2' },
              ],
            },
            date: {
              component: 'date',
              label: 'Date',
              width: 'half',
            },
            nationalIdWithName: {
              component: 'nationalIdWithName',
              label: 'National ID with name',
              searchCompanies: true,
              searchPersons: true,
            },
            phone: {
              component: 'phone',
              label: 'Phone',
              width: 'half',
            },
            selectAsyncPrimary: {
              component: 'selectAsync',
              label: 'Primary Select Async',
              placeholder: 'Placeholder...',
              loadingError: coreErrorMessages.failedDataProvider,
              loadOptions: async ({ apolloClient }) => {
                const { data } =
                  await apolloClient.query<FriggSchoolsByMunicipality>({
                    query: friggSchoolsByMunicipalityQuery,
                  })

                return (
                  data?.friggSchoolsByMunicipality?.map((municipality) => ({
                    value: `${municipality.name}`,
                    label: `${municipality.name}`,
                  })) ?? []
                )
              },
            },
            selectAsyncReliant: {
              component: 'selectAsync',
              label: 'Reliant Select Async',
              updateOnSelect: ['selectAsyncPrimary'],
              loadingError: coreErrorMessages.failedDataProvider,
              loadOptions: async ({ apolloClient, selectedValues }) => {
                try {
                  const { data } =
                    await apolloClient.query<FriggSchoolsByMunicipality>({
                      query: friggSchoolsByMunicipalityQuery,
                    })

                  return (
                    data?.friggSchoolsByMunicipality?.map((municipality) => ({
                      value: `${municipality.name} ${
                        selectedValues?.[0] || ''
                      }`,
                      label: `${municipality.name} ${
                        selectedValues?.[0] || ''
                      }`,
                    })) ?? []
                  )
                } catch (error) {
                  console.error('Error loading options:', error)
                  return []
                }
              },
            },
          },
          table: {
            // Format values for display in the table
            // In the format function, you can use the value, index in the repeater and the application object
            format: {
              input: (value, _i, _application) => {
                return `${value} - custom format`
              },
              nationalIdWithName: (value) => {
                return `${value} - custom format`
              },
            },
            // Overwrite header for the table. If not provided, the labels from the fields will be used
            header: [
              'Input',
              'Select',
              'Radio',
              'Checkbox',
              'Date',
              'Name',
              'NationalId',
              'Phone',
            ],
          },
        }),
      ],
    }),
  ],
})
