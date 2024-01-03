import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType } from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { UniversityGatewayApiClientConfig } from './universityGatewayApiClient.config'

export const ApiConfiguration = {
  provide: 'UniversityGatewayApiClientConfiguration',
  useFactory: (config: ConfigType<typeof UniversityGatewayApiClientConfig>) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-university-gateway-api',
      }),
      basePath: config.basePath,
    })
  },
  inject: [UniversityGatewayApiClientConfig.KEY],
}
