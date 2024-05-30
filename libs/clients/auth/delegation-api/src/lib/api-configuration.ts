import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, IdsClientConfig } from '@island.is/nest/config'

import { Configuration } from '../../gen/fetch'
import { AuthDelegationApiClientConfig } from './auth-delegation-api-client.config'

export const ApiConfiguration = {
  provide: 'AuthDelegationApiClientConfiguration',
  useFactory: (
    config: ConfigType<typeof AuthDelegationApiClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-auth-delegation-api',
        organizationSlug: 'stafraent-island',
        autoAuth:
          idsClientConfig.isConfigured && config.machineClientScope.length > 0
            ? {
                mode: 'token',
                issuer: idsClientConfig.issuer,
                clientId: idsClientConfig.clientId,
                clientSecret: idsClientConfig.clientSecret,
                scope: config.machineClientScope,
              }
            : undefined,
      }),
      basePath: config.basePath,
    })
  },
  inject: [AuthDelegationApiClientConfig.KEY, IdsClientConfig.KEY],
}
