import { Query } from '@island.is/api/schema'
import {
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildMultiField,
  buildSubSection,
  coreErrorMessages,
} from '@island.is/application/core'
import { friggOrganizationsByTypeQuery } from '../../../graphql/sampleQuery'

export const fieldsRepeaterSubsection = buildSubSection({
  id: 'fieldsRepeaterSubsection',
  title: 'Fields Repeater Field',
  children: [
    buildMultiField({
      id: 'fieldsRepeater',
      title: 'Fields Repeater',
      children: [
        buildDescriptionField({
          id: 'fieldsRepeaterDescription',
          description:
            'FieldsRepeater works similarly to tableRepeater, in that it contains a set of fields to fill out and this set can be repeated as many times as needed. The difference is that in tableRepeater, the values go into a table, while in fieldsRepeater, all fields created are always visible. As with tableRepeater the async select fields can be set to update based on selections in other fields in the same form instance.',
        }),
        buildFieldsRepeaterField({
          id: 'fieldsRepeater',
          title: 'Fields Repeater',
          formTitle: 'Title for each form',
          width: 'full',
          fields: {
            input: {
              component: 'input',
              label: 'Regular input',
              width: 'half',
              type: 'text',
              format: '######-####',
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
            },
            selectAsyncPrimary: {
              component: 'selectAsync',
              label: 'Primary Select Async',
              placeholder: 'Placeholder...',
              loadingError: coreErrorMessages.failedDataProvider,
              loadOptions: async ({ apolloClient }) => {
                const { data } = await apolloClient.query<Query>({
                  query: friggOrganizationsByTypeQuery,
                })

                return (
                  data?.friggOrganizationsByType?.map((organization) => ({
                    value: `${organization.name}`,
                    label: `${organization.name}`,
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
                const { data } = await apolloClient.query<Query>({
                  query: friggOrganizationsByTypeQuery,
                })

                return (
                  data?.friggOrganizationsByType?.map((organization) => ({
                    value: `${organization.name} ${selectedValues?.[0] || ''}`,
                    label: `${organization.name} ${selectedValues?.[0] || ''}`,
                  })) ?? []
                )
              },
            },
            inputWithIndexinLabel: {
              component: 'input',
              label: (index) => `Regular input with index in label: ${index}`,
              width: 'full',
              type: 'text',
            },
          },
        }),
      ],
    }),
  ],
})
