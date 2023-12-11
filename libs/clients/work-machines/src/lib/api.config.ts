import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { WorkMachinesClientConfig } from './workMachines.config'

export const ConfigFactory = (
  xroadConfig: ConfigType<typeof XRoadConfig>,
  config: ConfigType<typeof WorkMachinesClientConfig>,
  idsClientConfig: ConfigType<typeof IdsClientConfig>,
  acceptHeader: string,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-work-machines',
    organizationSlug: 'vinnueftirlitid',
    logErrorResponseBody: true,
    autoAuth: idsClientConfig.isConfigured
      ? {
          mode: 'tokenExchange',
          issuer: idsClientConfig.issuer,
          clientId: idsClientConfig.clientId,
          clientSecret: idsClientConfig.clientSecret,
          scope: config.fetch.scope,
        }
      : undefined,
  }),
  basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
  headers: {
    'X-Road-Client': xroadConfig.xRoadClient,
    Accept: acceptHeader,
  },
})
