import { Query } from '@island.is/api/schema'
import {
  buildAsyncSelectField,
  buildDescriptionField,
  buildDividerField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { friggOrganizationsByTypeQuery } from '../../../graphql/sampleQuery'

export const asyncSelectSubsection = buildSubSection({
  id: 'asyncSelectSubsection',
  title: 'Async Select Subsection',
  children: [
    buildMultiField({
      id: 'asyncSelectMultiField',
      title: 'Async Select',
      children: [
        buildAsyncSelectField({
          id: 'asyncSelect',
          title: 'Async Select',
          placeholder: 'Placeholder text',
          loadingError: 'Loading error',
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
        buildAsyncSelectField({
          id: 'asyncSelectSearchable',
          title: 'Async Select Searchable',
          isSearchable: true,
          loadingError: 'Loading error',
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
        buildAsyncSelectField({
          id: 'asyncSelectMulti',
          title: 'Async Select Multi select',
          isMulti: true,
          loadingError: 'Loading error',
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
        buildDividerField({}),
        buildDescriptionField({
          id: 'asyncSelectDescription',
          title: 'Value dependent async select',
          description:
            'Sometimes the options you might want to present to a user must depend on the value of another async select field. Value dependent async select offers just that. Multi select fields are also supported and selected values will be passed as an array.',
          titleVariant: 'h3',
          marginBottom: [2],
        }),

        buildAsyncSelectField({
          id: 'primaryAsyncSelect',
          title: 'Primary Async Select',
          placeholder: 'This will inform the dependent async select',
          loadingError: 'Loading error',
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

        buildAsyncSelectField({
          id: 'dependentAsyncSelect',
          title: 'Dependent Async Select',
          placeholder: 'Will re-fetch when the primary async select is changed',
          loadingError: 'Loading error',
          updateOnSelect: ['primaryAsyncSelect'],
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
        }),
      ],
    }),
  ],
})
