import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { FiskistofaClientConfig } from './fiskistofaClient.config'

export const ApiConfiguration = {
  provide: 'FiskistofaClientAPiConfiguration',
  scope: LazyDuringDevScope,
  useFactory: (clientConfig: ConfigType<typeof FiskistofaClientConfig>) =>
    new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-fiskistofa',
        organizationSlug: 'fiskistofa',
        ...clientConfig.fetch,
        autoAuth: {
          clientId: clientConfig.accessTokenServiceClientId,
          clientSecret: clientConfig.accessTokenServiceClientSecret,
          scope: clientConfig.scope,
          issuer: clientConfig.accessTokenServiceAudience,
          tokenEndpoint: clientConfig.accessTokenServiceUrl,
          mode: 'token',
          audience: clientConfig.accessTokenServiceAudience,
        },
      }),
      basePath: clientConfig.url,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }),
  inject: [FiskistofaClientConfig.KEY],
}
