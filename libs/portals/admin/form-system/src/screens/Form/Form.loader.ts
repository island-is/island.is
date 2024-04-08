import type { WrappedLoaderFn } from '@island.is/portals/core'
import { FormSystemFormResponse } from '@island.is/api/schema'

import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { FormSystemGetFormDocument, FormSystemGetFormQuery } from '../../gql/Form.generated'

export interface FormLoaderResponse {
  formBuilder: FormSystemFormResponse,
  client: ApolloClient<NormalizedCacheObject>
}


export const formLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ params }): Promise<FormLoaderResponse> => {
    if (!params.formId) {
      throw new Error('FormId not provided in parameters')
    }
    const { data: formData, error: formError } =
      await client.query<FormSystemGetFormQuery>({
        query: FormSystemGetFormDocument,
        fetchPolicy: 'network-only',
        variables: {
          input: {
            id: Number(params.formId),
          },
        }
      })
    if (formError) {
      throw formError
    }
    if (!formData) {
      throw new Error(`No form data found for ${params.formId}`)
    }
    return {
      formBuilder: formData.formSystemGetForm,
      client
    }
  }
}
