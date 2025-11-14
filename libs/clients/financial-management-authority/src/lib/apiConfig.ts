import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { FinancialManagementAuthorityClientConfig } from './financialManagementAuthorityClient.config'

export const ApiConfig = {
  provide: 'FinancialManagementAuthorityClientConfiguration',
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof FinancialManagementAuthorityClientConfig>,
  ) => {
    const credentials = Buffer.from(
      `${config.username}:${config.password}`,
      'binary',
    ).toString('base64')

    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-financial-management-authority',
        organizationSlug: 'fjarsysla-rikisins',
        logErrorResponseBody: true,
        timeout: 20000,
      }),
      basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xroadConfig.xRoadClient,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials}`,
      },
    })
  },
  inject: [
    XRoadConfig.KEY,
    FinancialManagementAuthorityClientConfig.KEY,
  ],
}
