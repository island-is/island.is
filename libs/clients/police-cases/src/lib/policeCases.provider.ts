import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { Configuration, MittLogreglanAPIApi } from '../../gen/fetch'
import { Provider } from '@nestjs/common'
import { PoliceCasesClientConfig } from './policeCases.config'

export const PoliceCasesApiProvider: Provider<MittLogreglanAPIApi> = {
  provide: MittLogreglanAPIApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof PoliceCasesClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new MittLogreglanAPIApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-police-cases',
          organizationSlug: 'rikislogreglustjori',
          autoAuth: idsClientConfig.isConfigured
            ? {
                mode: 'tokenExchange',
                issuer: idsClientConfig.issuer,
                clientId: idsClientConfig.clientId,
                clientSecret: idsClientConfig.clientSecret,
                scope: [],
              }
            : undefined,
        }),
        basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
        headers: {
          'X-Road-Client': xroadConfig.xRoadClient,
          'x-api-key': config.xRoadPoliceCasesApiKey,
          Accept: 'application/json',
        },
      }),
    ),
  inject: [XRoadConfig.KEY, PoliceCasesClientConfig.KEY, IdsClientConfig.KEY],
}
