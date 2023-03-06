import { Configuration, MinarsidurApiApi } from '../../gen/fetch'
import { Provider } from '@nestjs/common'
import {
  ConfigType,
  LazyDuringDevScope,
  IdsClientConfig,
} from '@island.is/nest/config'
import { RigthsPortalClientConfig } from './clients-rights-portal.config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

export const RightsPortalApiProvider: Provider<MinarsidurApiApi> = {
  provide: MinarsidurApiApi,
  scope: LazyDuringDevScope,
  useFactory: (config: ConfigType<typeof RigthsPortalClientConfig>) =>
    new MinarsidurApiApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-rights-portal',
          timeout: config.fetch.timeout,
          autoAuth: undefined,
          //idsClientConfig.isConfigured
          //   ? {
          //       mode: 'tokenExchange',
          //       issuer: idsClientConfig.issuer,
          //       clientId: idsClientConfig.clientId,
          //       clientSecret: idsClientConfig.clientSecret,
          //       scope: config.scope,
          //     }
          //   : undefined,
        }),
        basePath: 'https://midgardur-test.sjukra.is/minarsidur',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }),
    ),

  inject: [RigthsPortalClientConfig.KEY, IdsClientConfig.KEY],
}
