import {
  buildAsyncSelectField,
  buildDescriptionField,
  buildDividerField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { FriggSchoolsByMunicipality } from '../../../utils/types'
import { friggSchoolsByMunicipalityQuery } from '../../../graphql/sampleQuery'

export const setOnChangeSubsection = buildSubSection({
  id: 'setOnChangeSubsection',
  title: 'Set on change',
  children: [
    buildMultiField({
      id: 'setOnChangeMultiField',
      title: 'Set on change',
      children: [
        buildDescriptionField({
          id: 'descriptionField',
          description: `Set on change allows a field to set value in other fields when its value or selection changes.
            Below are some examples of fields that will set value in the bottom field when changed.
            Note that the fields that are set can be anywhere in the application, not just on the same screen.`,
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
          setOnChange: async (optionValue) => [
            {
              key: 'settableTextField',
              value: 'This is the value that was selected: ' + optionValue,
            },
          ],
          loadOptions: async ({ apolloClient }) => {
            const { data } =
              await apolloClient.query<FriggSchoolsByMunicipality>({
                query: friggSchoolsByMunicipalityQuery,
              })

            return (
              data?.friggSchoolsByMunicipality?.map((municipality) => ({
                value: municipality.name,
                label: municipality.name,
              })) ?? []
            )
          },
        }),

        buildSelectField({
          id: 'selectField',
          title: 'Select',
          isClearable: true,
          setOnChange: async (optionValue) => [
            {
              key: 'settableTextField',
              value: 'This is the value that was selected: ' + optionValue,
            },
          ],
          options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
          ],
        }),

        buildDividerField({}),

        buildTextField({
          id: 'settableTextField',
          title: 'Settable TextField',
          placeholder: 'Text entered here will be replaced',
        }),
      ],
    }),
  ],
})
