import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { SocialInsuranceAdministrationClientConfig } from './config/socialInsuranceAdministrationClient.config'
import { Scope } from './socialInsuranceAdministrationClient.type'

export const ConfigFactory = (
  xroadConfig: ConfigType<typeof XRoadConfig>,
  config: ConfigType<typeof SocialInsuranceAdministrationClientConfig>,
  idsClientConfig: ConfigType<typeof IdsClientConfig>,
  scopes: Array<Scope>,
  autoAuth: boolean,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-tr',
    organizationSlug: 'tryggingastofnun',
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
