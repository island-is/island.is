import { WrappedLoaderFn } from '@island.is/portals/core'
import { FormSystemForm, FormSystemFormResponse } from '@island.is/api/schema'
import { GET_FORMS, LoaderResponse } from '@island.is/form-system/graphql'
import { removeTypename } from '../../lib/utils/removeTypename'

export interface FormsLoaderQueryResponse {
  formSystemForms: FormSystemFormResponse
}

export const formsLoader: WrappedLoaderFn = ({ client }) => {
  return async (): Promise<LoaderResponse> => {
    const { data, error } = await client.query<FormsLoaderQueryResponse>({
      query: GET_FORMS
    })
    if (error) {
      throw error
    }
    if (!data) {
      throw new Error('No forms were found')
    }
    return {
      forms: removeTypename(data.formSystemForms?.forms) as FormSystemForm[]
    }

  }
}
