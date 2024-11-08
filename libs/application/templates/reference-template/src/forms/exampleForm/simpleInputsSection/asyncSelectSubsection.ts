import { buildAsyncSelectField } from '@island.is/application/core'
import { Context, Option } from '@island.is/application/types'
import {
  buildMultiField,
  buildSubSection,
} from 'libs/application/core/src/lib/formBuilders'
import { FriggSchoolsByMunicipality } from '../../../utils/types'
import { friggSchoolsByMunicipalityQuery } from '../../../graphql/sampleQuery'

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
        buildAsyncSelectField({
          id: 'asyncSelectSearchable',
          title: 'Async Select Searchable',
          isSearchable: true,
          loadingError: 'Loading error',
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
        buildAsyncSelectField({
          id: 'asyncSelectMulti',
          title: 'Async Select Multi select',
          isMulti: true,
          loadingError: 'Loading error',
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
      ],
    }),
  ],
})
