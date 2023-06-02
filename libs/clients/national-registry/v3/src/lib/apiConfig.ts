import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'

import { Configuration } from '../../gen/fetch'
import { NationalRegistryV3ClientConfig } from './nationalRegistryV3.config'

export const ApiConfig = {
  provide: 'NationalRegistryV3ClientProviderConfiguration',
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof NationalRegistryV3ClientConfig>,
  ) =>
    new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-national-registry-v3',
        timeout: config.fetchTimeout,
        autoAuth: {
          mode: 'token',
          clientId: config.clientId,
          clientSecret: config.clientSecret,
          scope: [config.scope],
          issuer: '',
          tokenEndpoint: config.endpoint,
        },
      }),
      basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xroadConfig.xRoadClient,
        Accept: 'application/json',
      },
    }),
  inject: [XRoadConfig.KEY, NationalRegistryV3ClientConfig.KEY],
}
