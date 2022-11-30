import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { IdsClientConfig } from '@island.is/nest/config'
import { ConfigType } from '@nestjs/config'
import { InfoLockApi, Configuration } from '../../gen/fetch'
import { VehicleInfolocksClientConfig } from './vehicleInfolocksClient.config'

const configFactory = (
  config: ConfigType<typeof VehicleInfolocksClientConfig>,
  idsClientConfig: ConfigType<typeof IdsClientConfig>,
  basePath: string,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-transport-authority-vehicle-infolocks',
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
    provide: InfoLockApi,
    useFactory: (
      config: ConfigType<typeof VehicleInfolocksClientConfig>,
      idsClientConfig: ConfigType<typeof IdsClientConfig>,
    ) => {
      return new InfoLockApi(
        new Configuration(
          configFactory(
            config,
            idsClientConfig,
            `${config.xroadBaseUrl}/r1/${config.xroadPath}`,
          ),
        ),
      )
    },
    inject: [VehicleInfolocksClientConfig.KEY, IdsClientConfig.KEY],
  },
]
