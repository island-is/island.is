import { Provider } from '@nestjs/common/interfaces/modules/provider.interface'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  LazyDuringDevScope,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'

import { Configuration, IdentityDocumentApi } from '../../gen/fetch'
import { PassportsClientConfig } from './passports.config'

export const PassportsApiProvider: Provider<IdentityDocumentApi> = {
  provide: IdentityDocumentApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
    config: ConfigType<typeof PassportsClientConfig>,
  ) =>
    new IdentityDocumentApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-passports',
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
          logErrorResponseBody: true,
        }),
        basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
        headers: {
          'X-Road-Client': xroadConfig.xRoadClient,
          Accept: 'application/json',
        },
      }),
    ),
  inject: [XRoadConfig.KEY, IdsClientConfig.KEY, PassportsClientConfig.KEY],
}
