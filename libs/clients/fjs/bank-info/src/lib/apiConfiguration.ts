import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { BankInfoClientConfig } from './bankinfo.config'

export const ApiConfiguration = {
  provide: 'BankinfoClientApiConfiguration',
  useFactory: (
    config: ConfigType<typeof BankInfoClientConfig>,
    xroadConfig: ConfigType<typeof XRoadConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-fjs-bankInfo',
        organizationSlug: 'fjarsysla-rikisins',
        logErrorResponseBody: true,
        autoAuth: idsClientConfig.isConfigured
          ? {
              mode: 'auto',
              issuer: idsClientConfig.issuer,
              clientId: idsClientConfig.clientId,
              clientSecret: idsClientConfig.clientSecret,
              scope: config.tokenExchangeScope,
            }
          : undefined,
      }),
      basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        Accept: 'application/json',
        'X-Road-Client': xroadConfig.xRoadClient,
      },
    })
  },
  inject: [BankInfoClientConfig.KEY, XRoadConfig.KEY, IdsClientConfig.KEY],
}
