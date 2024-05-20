import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { Configuration, DefaultApi } from '../../gen/fetch'
import { LawAndOrderClientConfig } from './lawAndOrderClient.config'
import { Provider } from '@nestjs/common'

export const LawAndOrderApiProvider: Provider<DefaultApi> = {
  provide: DefaultApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof LawAndOrderClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new DefaultApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-law-and-order',
          organizationSlug: 'domsmalaraduneytid',
          autoAuth: idsClientConfig.isConfigured
            ? {
                mode: 'tokenExchange',
                issuer: idsClientConfig.issuer,
                clientId: idsClientConfig.clientId,
                clientSecret: idsClientConfig.clientSecret,
                scope: config.scope,
              }
            : undefined,
        }),
        basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
        headers: {
          'X-Road-Client': xroadConfig.xRoadClient,
          Accept: 'application/json',
          //ApiKey: config.apiKey,
        },
      }),
    ),
  inject: [XRoadConfig.KEY, LawAndOrderClientConfig.KEY, IdsClientConfig.KEY],
}
