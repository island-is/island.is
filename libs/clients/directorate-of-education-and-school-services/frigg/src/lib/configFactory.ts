import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { FriggClientConfig } from './frigg.config'
import { Scope } from './frigg.type'

export const ConfigFactory = (
  xroadConfig: ConfigType<typeof XRoadConfig>,
  config: ConfigType<typeof FriggClientConfig>,
  idsClientConfig: ConfigType<typeof IdsClientConfig>,
  scopes: Array<Scope>,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-mms-frigg',
    organizationSlug: 'menntamalastofnun',
    autoAuth: idsClientConfig.isConfigured
      ? {
          mode: 'tokenExchange',
          issuer: idsClientConfig.issuer,
          clientId: idsClientConfig.clientId,
          clientSecret: idsClientConfig.clientSecret,
          scope: scopes,
        }
      : undefined,
  }),
  basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
  headers: {
    'X-Road-Client': xroadConfig.xRoadClient,
  },
})
