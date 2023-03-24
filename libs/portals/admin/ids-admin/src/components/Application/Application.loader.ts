import type { WrappedLoaderFn } from '@island.is/portals/core'
import {
  GetApplicationsByApplicationIdQuery,
  GetApplicationsByApplicationIdDocument,
} from './Application.generated'

export type AuthApplication = GetApplicationsByApplicationIdQuery['authAdminApplication']
export type AuthApplicationTranslation = GetApplicationsByApplicationIdQuery['authAdminApplication']['environments'][0]['displayName'][0]
export type AuthApplicationLifeTime = GetApplicationsByApplicationIdQuery['authAdminApplication']['environments'][0]['lifeTime']
export type AuthApplicationLBasicInfo = GetApplicationsByApplicationIdQuery['authAdminApplication']['environments'][0]['basicInfo']
export type AuthApplicationApplicationUrl = GetApplicationsByApplicationIdQuery['authAdminApplication']['environments'][0]['applicationUrls']
export const applicationLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ params }): Promise<AuthApplication> => {
    if (!params['tenant']) {
      throw new Error('Tenant not found')
    }

    const applicationsList = await client.query<GetApplicationsByApplicationIdQuery>(
      {
        query: GetApplicationsByApplicationIdDocument,
        variables: {
          input: {
            tenantId: params['tenant'],
            applicationId: params['application'],
          },
        },
      },
    )

    if (applicationsList.error) {
      throw applicationsList.error
    }

    if (!applicationsList.data?.authAdminApplication) {
      throw new Error('Application not found')
    }

    return (
      applicationsList.data?.authAdminApplication ?? ({} as AuthApplication)
    )
  }
}
