import { WrappedLoaderFn } from '@island.is/portals/core'
import { FormSystemForm } from '@island.is/api/schema'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { GET_FORMS } from '@island.is/form-system/graphql'

export interface FormsLoaderResponse {
  forms: FormSystemForm[]
}

export const formsLoader: WrappedLoaderFn = ({ client }) => {
  return async (): Promise<FormsLoaderResponse> => {
    const { data, error } = await client.query<FormsLoaderResponse>({
      query: GET_FORMS,
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
      forms: data.forms?.filter(
        (form) => form !== null,
      ) as FormSystemForm[],
    }
  }
}
