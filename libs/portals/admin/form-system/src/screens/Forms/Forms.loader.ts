import { WrappedLoaderFn } from '@island.is/portals/core'
import {
  FormSystemGetFormsDocument,
  FormSystemGetFormsQuery,
} from './Forms.generated'
import { FormSystemForm } from '@island.is/api/schema'

export interface FormsLoaderResponse {
  forms: FormSystemForm[]
}

export const formsLoader: WrappedLoaderFn = ({ client }) => {
  return async (): Promise<FormsLoaderResponse> => {
    const { data, error } = await client.query<FormSystemGetFormsQuery>({
      query: FormSystemGetFormsDocument,
      variables: {
        input: {
          organizationId: 1,
        },
      },
    })
    if (error) {
      throw error
    }
    if (!data) {
      throw new Error('No forms were found')
    }
    return {
      forms: data.formSystemGetForms.forms?.filter(
        (form) => form !== null,
      ) as FormSystemForm[],
    }
  }
}
