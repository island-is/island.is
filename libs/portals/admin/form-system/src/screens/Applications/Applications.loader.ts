import { WrappedLoaderFn } from '@island.is/portals/core'
import {
  FormSystemApplication,
  FormSystemApplicationResponse,
} from '@island.is/api/schema'
import {
  GET_APPLICATIONS,
  LoaderResponse,
} from '@island.is/form-system/graphql'
import { removeTypename } from '../../lib/utils/removeTypename'
import { Option } from '@island.is/island-ui/core'

export interface ApplicationsLoaderQueryResponse {
  formSystemApplications?: FormSystemApplicationResponse
}

export const applicationsLoader: WrappedLoaderFn = ({ client, userInfo }) => {
  return async (): Promise<LoaderResponse> => {
    const { data, error } = await client.query<ApplicationsLoaderQueryResponse>(
      {
        query: GET_APPLICATIONS,
        variables: {
          input: {
            organizationNationalId: userInfo?.profile.nationalId,
            page: 1,
            limit: 20,
            isTest: true,
          },
        },
        fetchPolicy: 'no-cache',
      },
    )
    if (error) {
      throw error
    }
    if (!data) {
      throw new Error('No applications were found')
    }

    const applications = data.formSystemApplications?.applications
      ?.filter((application) => application !== null)
      .map((application) =>
        removeTypename(application),
      ) as FormSystemApplication[]

    const organizations = data.formSystemApplications?.organizations?.map(
      (org) => ({
        label: org?.label,
        value: org?.value,
        isSelected: org?.isSelected,
      }),
    ) as Option<string>[]

    const isAdmin = userInfo?.scopes.includes(
      '@admin.island.is/form-system:admin',
    )

    const organizationNationalId = userInfo?.profile.nationalId

    return {
      applications: applications,
      organizations,
      isAdmin,
      organizationNationalId,
    }
  }
}
