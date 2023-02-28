import { Configuration, BaseAPI } from '../../gen/fetch'
import { Provider } from '@nestjs/common'
import {
  ConfigType,
  LazyDuringDevScope,
  IdsClientConfig,
} from '@island.is/nest/config'
import { IcelandicHealthInsuranceClientConfig } from './clients-icelandic-health-insurance.config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

export const IcelandicHealthInsuranceApiProvider: Provider<BaseAPI> = {
  provide: BaseAPI,
  scope: LazyDuringDevScope,
  useFactory: (
    config: ConfigType<typeof IcelandicHealthInsuranceClientConfig>,
  ) =>
    new BaseAPI(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-icelandic-health-insurance',
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

        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }),
    ),

  inject: [IcelandicHealthInsuranceClientConfig.KEY, IdsClientConfig.KEY],
}
