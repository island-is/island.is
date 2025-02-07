import { WrappedLoaderFn } from '@island.is/portals/core'
import { FormSystemForm, FormSystemFormResponse } from '@island.is/api/schema'
import { GET_FORMS } from '@island.is/form-system/graphql'
import { removeTypename } from '../../lib/utils/removeTypename'
import { gql } from '@apollo/client'
// import { OrganizationTitleByNationalIdLoader } from '@island.is/cms'
// import type { OrganizationTitleByNationalIdDataLoader } from '@island.is/cms'

export interface FormsLoaderQueryResponse {
  formSystemGetAllForms?: FormSystemFormResponse
}

export interface FormsLoaderResponse {
  forms: FormSystemForm[]
  organizationNationalIds: string[]
  // organizationTitles: string[]
}

// const GET_ORGANIZATION_TITLES = gql`
//   query GetOrganizationTitles($organizationNationalIds: [String!]!) {
//     getOrganizationTitles(organizationNationalIds: $organizationNationalIds) {
//       shortTitle
//     }
//   }
// `

export const formsLoader: WrappedLoaderFn = ({ client }) => {
  return async (): Promise<FormsLoaderResponse> => {
    const { data, error } = await client.query<FormsLoaderQueryResponse>({
      query: GET_FORMS,
      fetchPolicy: 'no-cache',
    })
    if (error) {
      throw error
    }
    if (!data) {
      throw new Error('No forms were found')
    }

    // const organizationNationalIds = data.formSystemGetAllForms
    //   ?.organizationNationalIds as string[]

    // console.log('organizationNationalIds', organizationNationalIds)

    // const { data: organizationTitlesData } = await client.query({
    //   query: GET_ORGANIZATION_TITLES,
    //   variables: { organizationNationalIds: organizationNationalIds },
    // })

    // return {
    //   forms: data.formSystemGetAllForms?.forms
    //     ?.filter((form) => form !== null)
    //     .map((form) => removeTypename(form)) as FormSystemForm[],
    //   organizationNationalIds,
    //   organizationTitles: organizationTitlesData.getOrganizationTitles,
    // }

    return {
      forms: data.formSystemGetAllForms?.forms
        ?.filter((form) => form !== null)
        .map((form) => removeTypename(form)) as FormSystemForm[],
      organizationNationalIds: data.formSystemGetAllForms
        ?.organizationNationalIds as string[],
    }
  }
}
