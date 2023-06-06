import { Provider } from '@nestjs/common'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { Configuration, MachinesApi } from '../../gen/fetch'
import { WorkMachinesClientConfig } from './workMachines.config'

export const WorkMachinesApiProvider: Provider<MachinesApi> = {
  provide: MachinesApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof WorkMachinesClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new MachinesApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-work-machines',
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
          timeout: config.fetch.timeout,
        }),
        basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
        headers: {
          'X-Road-Client': xroadConfig.xRoadClient,
          Accept: 'application/vnd.ver.hateoas.v1+json',
        },
      }),
    ),
  inject: [XRoadConfig.KEY, WorkMachinesClientConfig.KEY, IdsClientConfig.KEY],
}
