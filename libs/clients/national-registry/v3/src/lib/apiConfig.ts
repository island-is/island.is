import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'

import { Configuration } from '../../gen/fetch'
import { NationalRegistryV3ClientConfig } from './nationalRegistryV3.config'

export const ApiConfig = {
  provide: 'NationalRegistryV3ClientProviderConfiguration',
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof NationalRegistryV3ClientConfig>,
    //idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-national-registry-v3',
        organizationSlug: 'thjodskra-islands',
        timeout: config.fetchTimeout,
        //idsClientConfig.isConfigured
        autoAuth:
          //?
          {
            mode: 'token',
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            scope: [config.scope],
            issuer: '', //idsClientConfig.issuer,
            tokenEndpoint: config.endpoint,
          },
        //: undefined,
      }),
      basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xroadConfig.xRoadClient,
        Accept: 'application/json',
      },
    }),
  inject: [
    XRoadConfig.KEY,
    NationalRegistryV3ClientConfig.KEY,
    //IdsClientConfig.KEY,
  ],
}
