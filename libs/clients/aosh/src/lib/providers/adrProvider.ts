import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { Provider } from '@nestjs/common'
import { Configuration, AdrApi } from '../../../gen/fetch'
import { AoshClientConfig } from '../aosh.config'

export const AdrApiProvider: Provider<AdrApi> = {
  provide: AdrApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof AoshClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new AdrApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-adr',
          autoAuth: idsClientConfig.isConfigured
            ? {
                mode: 'tokenExchange',
                issuer: idsClientConfig.issuer,
                clientId: config.fetch.clientId,
                clientSecret: idsClientConfig.clientSecret,
                scope: config.fetch.scope,
              }
            : undefined,
          timeout: config.fetch.timeout,
        }),
        basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
        headers: {
          'X-Road-Client': xroadConfig.xRoadClient,
          Accept: 'application/json',
        },
      }),
    ),
  inject: [XRoadConfig.KEY, AoshClientConfig.KEY, IdsClientConfig.KEY],
}
