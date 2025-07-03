import { Provider } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import {
  LegalGazetteCommonApplicationApi,
  Configuration,
} from '../../gen/fetch'
import { IdsClientConfig, XRoadConfig } from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { LegalGazetteClientConfig } from './legalGazetteClient.config'

export const LegalGazetteClientProvider: Provider<LegalGazetteCommonApplicationApi> =
  {
    provide: LegalGazetteCommonApplicationApi,
    useFactory: (
      xroadConfig: ConfigType<typeof XRoadConfig>,
      config: ConfigType<typeof LegalGazetteClientConfig>,
      idsClientConfig: ConfigType<typeof IdsClientConfig>,
    ) =>
      new LegalGazetteCommonApplicationApi(
        new Configuration({
          fetchApi: createEnhancedFetch({
            name: 'clients-legal-gazette',
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
          },
        }),
      ),
    inject: [
      XRoadConfig.KEY,
      LegalGazetteClientConfig.KEY,
      IdsClientConfig.KEY,
    ],
  }
