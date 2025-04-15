import { WrappedLoaderFn } from '@island.is/portals/core'
import { FormSystemForm, FormSystemFormResponse } from '@island.is/api/schema'
import { GET_FORMS, LoaderResponse } from '@island.is/form-system/graphql'
import { removeTypename } from '../../lib/utils/removeTypename'
import { Option } from '@island.is/island-ui/core'

export interface FormsLoaderQueryResponse {
  formSystemForms: FormSystemFormResponse
}

export const formsLoader: WrappedLoaderFn = ({ client, userInfo }) => {
  return async (): Promise<LoaderResponse> => {
    const { data, error } = await client.query<FormsLoaderQueryResponse>({
      query: GET_FORMS,
      variables: {
        input: {
          nationalId: userInfo?.profile.nationalId,
        },
      },
      fetchPolicy: 'no-cache',
    })
    if (error) {
      throw error
    }
    if (!data) {
      throw new Error('No forms were found')
    }

    const forms = data.formSystemForms?.forms
      ?.filter((form) => form !== null)
      .map((form) => removeTypename(form)) as FormSystemForm[]

    const organizations = data.formSystemForms?.organizations?.map((org) => ({
      label: org?.label,
      value: org?.value,
      isSelected: org?.isSelected,
    })) as Option<string>[]

    const isAdmin = userInfo?.scopes.includes(
      '@admin.island.is/form-system:admin',
    )

    const organizationNationalId = userInfo?.profile.nationalId

    return {
      forms,
      organizations,
      isAdmin,
      organizationNationalId,
    }
  }
}
