import type { WrappedLoaderFn } from '@island.is/portals/core'
import {
  GetApplicationsByIdDocument,
  GetApplicationsByIdQuery,
} from './Applications.generated'

export type AuthApplicationsList = GetApplicationsByIdQuery['authAdminApplications']['data']

export const applicationsLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ params }): Promise<AuthApplicationsList> => {
    if (!params['tenant']) {
      throw new Error('Tenant not found')
    }

    const applicationsList = await client.query<GetApplicationsByIdQuery>({
      query: GetApplicationsByIdDocument,
      variables: {
        tenantId: params['tenant'],
      },
    })

    if (applicationsList.error) {
      throw applicationsList.error
    }

    return applicationsList.data?.authAdminApplications.data ?? []
  }
}
