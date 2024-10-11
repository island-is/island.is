import {
  ConfigType,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ShipApi, Configuration } from '../../gen/fetch'
import { ShipRegistryClientConfig } from './ship-registry.config'

export const ApiConfig = {
  provide: 'ShipRegistryClientConfig',
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof ShipRegistryClientConfig>,
  ) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-ship-registry',
        logErrorResponseBody: true,
      }),
      basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xroadConfig.xRoadClient,
        Accept: 'application/json',
      },
    })
  },
  inject: [XRoadConfig.KEY, ShipRegistryClientConfig.KEY],
}

export const ApiProviders = [ShipApi].map((api) => ({
  provide: api,
  useFactory: (config: Configuration) => {
    return new api(config)
  },
  inject: [ApiConfig.provide],
}))
