import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'

import { Configuration } from '../../gen/fetch'
import { NationalRegistryClientConfig } from './nationalRegistryClient.config'
import { getCache } from './cache'

export const ApiConfiguration = {
  provide: 'NationalRegistryClientApiConfiguration',
  // Necessary because of cache-manager.
  // eslint-disable-next-line local-rules/no-async-module-init
  useFactory: async (
    config: ConfigType<typeof NationalRegistryClientConfig>,
    xroadConfig: ConfigType<typeof XRoadConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-national-registry-v2',
        organizationSlug: 'thjodskra-islands',
        cache: await getCache(config),
        timeout: config.fetchTimeout,
        autoAuth: idsClientConfig.isConfigured
          ? {
              mode: 'auto',
              issuer: idsClientConfig.issuer,
              clientId: idsClientConfig.clientId,
              clientSecret: idsClientConfig.clientSecret,
              scope: config.tokenExchangeScope,
              tokenExchange: {
                requestActorToken: config.requestActorToken,
              },
            }
          : undefined,
      }),
      basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xroadConfig.xRoadClient,
      },
    })
  },
  inject: [
    NationalRegistryClientConfig.KEY,
    XRoadConfig.KEY,
    IdsClientConfig.KEY,
  ],
}
