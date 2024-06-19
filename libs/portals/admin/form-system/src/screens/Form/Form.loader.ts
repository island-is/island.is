import type { WrappedLoaderFn } from '@island.is/portals/core'
import { FormSystemFormResponse } from '@island.is/api/schema'

import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import {
  FormSystemGetFormDocument,
  FormSystemGetFormQuery,
} from './Form.generated'
import {
  FormSystemGetInputQuery,
  FormSystemGetInputDocument,
} from './GetInput.generated'

export interface FormLoaderResponse {
  formBuilder: FormSystemFormResponse
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
        },
      })
    if (formError) {
      throw formError
    }
    if (!formData) {
      throw new Error(`No form data found for ${params.formId}`)
    }

    //Inputs had null values thus I need to fetch them again for some reason...
    const formBuilder = formData.formSystemGetForm
    const updatedInputs = formBuilder.form?.inputsList?.length
      ? await Promise.all(
          formBuilder.form.inputsList.map(async (input) => {
            const { data: updatedInput, error: inputError } =
              await client.query<FormSystemGetInputQuery>({
                query: FormSystemGetInputDocument,
                fetchPolicy: 'network-only',
                variables: {
                  input: {
                    id: Number(input?.id),
                  },
                },
              })
            return updatedInput?.formSystemGetInput
          }),
        )
      : []
    const updatedFormBuilder = {
      ...formBuilder,
      form: {
        ...formBuilder.form,
        inputsList: updatedInputs,
      },
    }

    return {
      formBuilder: updatedFormBuilder as FormSystemFormResponse,
      client,
    }
  }
}
