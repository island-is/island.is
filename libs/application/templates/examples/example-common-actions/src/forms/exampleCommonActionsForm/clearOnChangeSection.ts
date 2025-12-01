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
        buildAsyncSelectField({
          id: 'asyncSelectField',
          title: 'Async Select',
          loadingError: 'Loading error',
          clearOnChange: ['clearableTextField'],
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
        }),

        buildPhoneField({
          id: 'phoneField',
          title: 'Phone Field',
          clearOnChange: ['clearableTextField'],
        }),

        buildDateField({
          id: 'dateField',
          title: 'Date Field',
          clearOnChange: ['clearableTextField'],
        }),

        buildTextField({
          id: 'textField',
          title: 'Text Field',
          clearOnChange: ['clearableTextField'],
        }),

        buildRadioField({
          id: 'radioField',
          title: 'Radio Field',
          clearOnChange: ['clearableTextField'],
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
          options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
          ],
        }),

        buildNationalIdWithNameField({
          id: 'nationalIdWithNameField',
          title: 'NationalId With Name Field',
          clearOnChange: ['clearableTextField'],
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
