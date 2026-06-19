import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { FinancialManagementAuthorityClientConfig } from './financialManagementAuthorityClient.config'

export const ApiConfig = {
  provide: 'FinancialManagementAuthorityClientConfiguration',
  scope: LazyDuringDevScope,
  useFactory: (
    config: ConfigType<typeof FinancialManagementAuthorityClientConfig>,
  ) => {
    const authServer = config.authenticationServer.replace(/\/+$/, '')
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-financial-management-authority',
        organizationSlug: 'fjarsysla-rikisins',
        logErrorResponseBody: true,
        timeout: 20000,
        autoAuth: {
          mode: 'token',
          clientId: config.clientId.trim(),
          clientSecret: config.clientSecret.trim(),
          scope: config.scope.split(' '),
          issuer: authServer,
          tokenEndpoint: `${authServer}/connect/token`,
        },
      }),
      basePath: config.basePath,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
  },
  inject: [FinancialManagementAuthorityClientConfig.KEY],
}
