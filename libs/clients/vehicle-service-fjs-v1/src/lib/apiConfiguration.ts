import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { IdsClientConfig } from '@island.is/nest/config'
import { ConfigType } from '@nestjs/config'
import { DefaultApi, Configuration } from '../../gen/fetch'
import { VehicleServiceFjsV1ClientConfig } from './vehicleServiceFjsV1Client.config'

const configFactory = (
  config: ConfigType<typeof VehicleServiceFjsV1ClientConfig>,
  idsClientConfig: ConfigType<typeof IdsClientConfig>,
  basePath: string,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-vehicle-service-fjs-v1',
    autoAuth: idsClientConfig.isConfigured
      ? {
          mode: 'tokenExchange',
          issuer: idsClientConfig.issuer,
          clientId: idsClientConfig.clientId,
          clientSecret: idsClientConfig.clientSecret,
          scope: config.scope,
        }
      : undefined,
  }),
  headers: {
    'X-Road-Client': config.xroadClientId,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  basePath,
})

export const exportedApis = [
  {
    provide: DefaultApi,
    useFactory: (
      config: ConfigType<typeof VehicleServiceFjsV1ClientConfig>,
      idsClientConfig: ConfigType<typeof IdsClientConfig>,
    ) => {
      return new DefaultApi(
        new Configuration(
          configFactory(
            config,
            idsClientConfig,
            `${config.xroadBaseUrl}/r1/${config.xroadPath}`,
          ),
        ),
      )
    },
    inject: [VehicleServiceFjsV1ClientConfig.KEY, IdsClientConfig.KEY],
  },
]
