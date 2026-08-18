import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { DataGatewayClientConfig } from './dataGatewayClient.config'

export const ApiConfiguration = {
  provide: 'DataGatewayApiConfiguration',
  scope: LazyDuringDevScope,
  useFactory: (config: ConfigType<typeof DataGatewayClientConfig>) =>
    new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-mms-data-gateway',
        autoAuth: {
          mode: 'token',
          issuer: config.baseUrl,
          tokenEndpoint: `${config.baseUrl}/auth/connect/token`,
          clientId: config.clientId,
          clientSecret: config.clientSecret,
          scope: config.scope,
        },
      }),
      basePath: config.baseUrl,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }),
  inject: [DataGatewayClientConfig.KEY],
}
