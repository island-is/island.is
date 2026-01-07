import { Query } from '@island.is/api/schema'
import {
  buildAsyncSelectField,
  buildCheckboxField,
  buildDateField,
  buildDescriptionField,
  buildDividerField,
  buildMultiField,
  buildNationalIdWithNameField,
  buildPhoneField,
  buildRadioField,
  buildSection,
  buildSelectField,
  buildTextField,
} from '@island.is/application/core'
import { friggOrganizationsByTypeQuery } from '../../graphql/sample'

export const clearOnChangeSection = buildSection({
  id: 'clearOnChangeSubsection',
  title: 'Clear on change',
  children: [
    buildMultiField({
      id: 'clearOnChangeMultiField',
      title: 'Clear on change',
      children: [
        buildDescriptionField({
          id: 'descriptionField',
          description: `Clear on change allows a field to clear other fields when its value or selection changes.
            Below are some examples of fields that will clear the bottom field when changed.
            Note that the fields that are cleared can be anywhere in the application, not just on the same screen.`,
        }),
        buildDescriptionField({
          id: 'descriptionField2',
          description: `To try it out simply enter some text in the bottom text field
          and change the selections in any of the other fields.`,
        }),
        buildDescriptionField({
          id: 'descriptionField3',
          description: `The "empty" value for the fields that are cleared can be specified using the clearOnChangeDefaultValue property. Note that although we are using a string here the values can be strings, numbers or booleans`,
        }),
        buildAsyncSelectField({
          id: 'asyncSelectField',
          title: 'Async Select',
          loadingError: 'Loading error',
          clearOnChange: ['clearableTextField'],
          clearOnChangeDefaultValue: 'Cleared by async select field',
          loadOptions: async ({ apolloClient }) => {
            const { data } = await apolloClient.query<Query>({
              query: friggOrganizationsByTypeQuery,
            })

            return (
              data?.friggOrganizationsByType?.map((organization) => ({
                value: organization.name,
                label: organization.name,
              })) ?? []
            )
          },
        }),

        buildSelectField({
          id: 'selectField',
          title: 'Select',
          clearOnChange: ['clearableTextField'],
          options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
          ],
          clearOnChangeDefaultValue: 'Cleared by select field',
        }),

        buildPhoneField({
          id: 'phoneField',
          title: 'Phone Field',
          clearOnChange: ['clearableTextField'],
          clearOnChangeDefaultValue: 'Cleared by phone field',
        }),

        buildDateField({
          id: 'dateField',
          title: 'Date Field',
          clearOnChange: ['clearableTextField'],
          clearOnChangeDefaultValue: 'Cleared by date field',
        }),

        buildTextField({
          id: 'textField',
          title: 'Text Field',
          clearOnChange: ['clearableTextField'],
          clearOnChangeDefaultValue: 'Cleared by text field',
        }),

        buildRadioField({
          id: 'radioField',
          title: 'Radio Field',
          clearOnChange: ['clearableTextField'],
          clearOnChangeDefaultValue: 'Cleared by radio field',
          options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
          ],
        }),

        buildCheckboxField({
          id: 'checkboxField',
          title: 'Checkbox Field',
          marginTop: 2,
          clearOnChange: ['clearableTextField'],
          clearOnChangeDefaultValue: 'Cleared by checkbox field',
          options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
          ],
        }),

        buildNationalIdWithNameField({
          id: 'nationalIdWithNameField',
          title: 'NationalId With Name Field',
          clearOnChange: ['clearableTextField'],
          clearOnChangeDefaultValue: 'Cleared by national id with name field',
        }),

        buildDividerField({}),

        buildTextField({
          id: 'clearableTextField',
          title: 'Clearable TextField',
          placeholder: 'Text entered here will be cleared',
        }),
      ],
    }),
  ],
})
