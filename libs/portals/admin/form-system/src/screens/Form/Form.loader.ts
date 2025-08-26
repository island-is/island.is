import type { WrappedLoaderFn } from '@island.is/portals/core'
import { FormSystemFormResponse } from '@island.is/api/schema'
import {
  FormLoaderResponse,
  GET_FORM,
  LoaderResponse,
} from '@island.is/form-system/graphql'
import { removeTypename } from '../../lib/utils/removeTypename'

interface FormLoaderQueryResponse {
  formSystemForm: FormSystemFormResponse
}

export const formLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ params }): Promise<LoaderResponse> => {
    if (!params.formId) {
      throw new Error('FormId not provided in parameters')
    }

    try {
      const { data, loading } = await client.query<FormLoaderQueryResponse>({
        query: GET_FORM,
        variables: {
          input: {
            id: params.formId,
          },
        },
        fetchPolicy: 'no-cache',
      })
      if (!loading && !data) {
        throw new Error('No form data found')
      }
      return removeTypename(data.formSystemForm) as FormLoaderResponse
    } catch (error) {
      throw new Error(`Failed to load form: ${error.message}`)
    }
  }
}
