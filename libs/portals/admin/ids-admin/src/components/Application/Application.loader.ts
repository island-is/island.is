import type { WrappedLoaderFn } from '@island.is/portals/core'
import {
  GetApplicationsByApplicationIdQuery,
  GetApplicationsByApplicationIdDocument,
} from './Application.generated'

export type AuthApplicationList = GetApplicationsByApplicationIdQuery['authAdminApplication']
export type AuthApplicationTranslationList = GetApplicationsByApplicationIdQuery['authAdminApplication']['environments'][0]['displayName'][0]
export type AuthApplicationLifeTimeList = GetApplicationsByApplicationIdQuery['authAdminApplication']['environments'][0]['lifeTime']
export type AuthApplicationLBasicInfoList = GetApplicationsByApplicationIdQuery['authAdminApplication']['environments'][0]['basicInfo']
export type AuthApplicationApplicationUrlList = GetApplicationsByApplicationIdQuery['authAdminApplication']['environments'][0]['applicationUrls']
export const applicationLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ params }): Promise<AuthApplicationList> => {
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
      applicationsList.data?.authAdminApplication ?? ({} as AuthApplicationList)
    )
  }
}
