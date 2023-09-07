import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType } from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { UniversityGatewayReykjavikUniversityClientConfig } from './reykjavikUniversityClient.config'

export const ApiConfiguration = {
  provide: 'UniversityGatewayReykjavikUniversityClientApiConfiguration',
  useFactory: (
    config: ConfigType<typeof UniversityGatewayReykjavikUniversityClientConfig>,
  ) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-university-gateway-reykjavik-university',
        timeout: config.fetch.timeout,
      }),
      basePath: config.url,
      headers: {
        ClientId: config.clientId,
        Secret: config.secret,
      },
    })
  },
  inject: [UniversityGatewayReykjavikUniversityClientConfig.KEY],
}
