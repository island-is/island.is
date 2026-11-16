import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { FriggClientConfig } from './friggClient.config'

export const ConfigFactory = (
  xroadConfig: ConfigType<typeof XRoadConfig>,
  config: ConfigType<typeof FriggClientConfig>,
  idsClientConfig: ConfigType<typeof IdsClientConfig>,
  // The scopes this api's token exchange asks for; they differ per api, so the
  // caller passes them in (see apiProvider).
  scope: string[],
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-mms-frigg',
    organizationSlug: 'midstod-menntunar-og-skolathjonustu',
    autoAuth: idsClientConfig.isConfigured
      ? {
          mode: 'tokenExchange',
          issuer: idsClientConfig.issuer,
          clientId: idsClientConfig.clientId,
          clientSecret: idsClientConfig.clientSecret,
          scope,
        }
      : undefined,
  }),
  basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
  headers: {
    'X-Road-Client': xroadConfig.xRoadClient,
  },
})
