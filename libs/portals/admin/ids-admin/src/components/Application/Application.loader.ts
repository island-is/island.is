import type { WrappedLoaderFn } from '@island.is/portals/core'
import {
  GetApplicationsByApplicationIdQuery,
  GetApplicationsByApplicationIdDocument,
} from './Application.generated'

export type AuthApplicationList = GetApplicationsByApplicationIdQuery['authAdminApplications']['data']
export type AuthApplicationTranslationList = GetApplicationsByApplicationIdQuery['authAdminApplications']['data'][0]['environments'][0]['displayName'][0]
export type AuthApplicationLifeTimeList = GetApplicationsByApplicationIdQuery['authAdminApplications']['data'][0]['environments'][0]['lifeTime']
export type AuthApplicationLBasicInfoList = GetApplicationsByApplicationIdQuery['authAdminApplications']['data'][0]['environments'][0]['basicInfo']
export type AuthApplicationApplicationUrlList = GetApplicationsByApplicationIdQuery['authAdminApplications']['data'][0]['environments'][0]['applicationUrls']
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

    return applicationsList.data?.authAdminApplications.data ?? []
  }
}
