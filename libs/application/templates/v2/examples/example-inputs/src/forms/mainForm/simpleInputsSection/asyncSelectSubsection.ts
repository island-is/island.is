import { Query } from '@island.is/api/schema'
import { SubSectionBuilder } from '@island.is/application/core'
import { friggOrganizationsByTypeQuery } from '../../../graphql/sampleQuery'

export const asyncSelectSubsection = new SubSectionBuilder(
  'asyncSelectSubsection',
  'Async Select Subsection',
)
  .addPage('asyncSelectMultiField', 'Async Select', (page) => {
    page
      .addAsyncSelectField('asyncSelect', 'Async Select', {
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
      })
      .addAsyncSelectField('asyncSelectSearchable', 'Async Select Searchable', {
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
      })
      .addAsyncSelectField('asyncSelectMulti', 'Async Select Multi select', {
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
      })
      .addDividerField()
      .addDescriptionField(
        'asyncSelectDescription',
        'Value dependent async select',
        {
          description:
            'Sometimes the options you might want to present to a user must depend on the value of another async select field. Value dependent async select offers just that. Multi select fields are also supported and selected values will be passed as an array.',
          titleVariant: 'h3',
          marginBottom: [2],
        },
      )
      .addAsyncSelectField('primaryAsyncSelect', 'Primary Async Select', {
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
      })
      .addAsyncSelectField('dependentAsyncSelect', 'Dependent Async Select', {
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
      })
  })
  .build()
