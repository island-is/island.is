import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { WorkMachinesClientConfig } from './workMachines.config'

export const ApiConfig = {
  provide: 'WorkMachinesClientProviderConfiguration',
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof WorkMachinesClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new Configuration({
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
        Accept: 'application/vnd.ver.hateoas.v1+json',
      },
    }),
  inject: [XRoadConfig.KEY, WorkMachinesClientConfig.KEY, IdsClientConfig.KEY],
}
