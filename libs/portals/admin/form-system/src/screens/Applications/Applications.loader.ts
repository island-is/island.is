import { WrappedLoaderFn } from '@island.is/portals/core'
import { FormSystemForm, FormSystemFormResponse } from '@island.is/api/schema'
import { GET_FORMS } from '@island.is/form-system/graphql'
import { removeTypename } from '../../lib/utils/removeTypename'
import { Option } from '@island.is/island-ui/core'

export interface ApplicationsLoaderQueryResponse {
  formSystemGetAllForms?: FormSystemFormResponse
}

export interface ApplicationsLoaderResponse {
  forms: FormSystemForm[]
  organizations: Option<string>[]
}

export const applicationsLoader: WrappedLoaderFn = ({ client }) => {
  return async (): Promise<ApplicationsLoaderResponse> => {
    const { data, error } = await client.query<ApplicationsLoaderQueryResponse>(
      {
        query: GET_FORMS,
        variables: {
          input: {
            nationalId: '0',
          },
        },
        fetchPolicy: 'no-cache',
      },
    )
    if (error) {
      throw error
    }
    if (!data) {
      throw new Error('No forms were found')
    }

    const forms = data.formSystemGetAllForms?.forms
      ?.filter((form) => form !== null)
      .map((form) => removeTypename(form)) as FormSystemForm[]

    const organizations = data.formSystemGetAllForms?.organizations?.map(
      (org) => ({
        label: org?.label,
        value: org?.value,
        isSelected: org?.isSelected,
      }),
    ) as Option<string>[]

    return {
      forms,
      organizations,
    }
  }
}
