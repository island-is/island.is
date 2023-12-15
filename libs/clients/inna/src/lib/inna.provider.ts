import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { Provider } from '@nestjs/common'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { Configuration, DefaultApi } from '../../gen/fetch'
import { InnaClientConfig } from './inna.config'

export const InnaClientProvider: Provider<DefaultApi> = {
  provide: DefaultApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof InnaClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new DefaultApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-inna',
          // organizationSlug: 'menntamalastofnun',
          logErrorResponseBody: true,
          /*autoAuth: idsClientConfig.isConfigured
            ? {
                mode: 'tokenExchange',
                issuer: idsClientConfig.issuer,
                clientId: idsClientConfig.clientId,
                clientSecret: idsClientConfig.clientSecret,
                scope: ['@mms.is/inna'],
              }
            : undefined,*/
        }),
        basePath: `https://api-test.inna.is/namsferlaveita`,
        // basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
        headers: {
          // 'X-Road-Client': xroadConfig.xRoadClient,
          Accept: 'application/json',
        },
      }),
    ),
  inject: [XRoadConfig.KEY, InnaClientConfig.KEY, IdsClientConfig.KEY],
}
