import { Configuration } from '../../gen/fetch'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
} from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { RightsPortalClientConfig } from './clients-rights-portal.config'

export const ApiConfig = {
  provide: 'RightsPortalApiProviderConfiguration',
  scope: LazyDuringDevScope,
  useFactory: (
    config: ConfigType<typeof RightsPortalClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-rights-portal',
        timeout: config.fetch.timeout,
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
      basePath: 'https://midgardur-test.sjukra.is/minarsidur',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }),
  inject: [RightsPortalClientConfig.KEY, IdsClientConfig.KEY],
}
