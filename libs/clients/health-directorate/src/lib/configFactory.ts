import { IdsClientConfig, XRoadConfig } from '@island.is/nest/config'
import { ConfigType } from '@nestjs/config'
import { HealthDirectorateClientConfig } from './healthDirectorateClient.config'
import { Scope } from './healthDirectorateClient.types'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

export const ConfigFactory = (
  xroadConfig: ConfigType<typeof XRoadConfig>,
  config: ConfigType<typeof HealthDirectorateClientConfig>,
  idsClientConfig: ConfigType<typeof IdsClientConfig>,
  scopes: Array<Scope>,
  autoAuth: boolean,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-health-directorate',
    organizationSlug: 'landlaeknir',
    autoAuth:
      autoAuth && idsClientConfig.isConfigured
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
