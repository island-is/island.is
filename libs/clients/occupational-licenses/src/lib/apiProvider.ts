import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { Provider } from '@nestjs/common'
import { Configuration, StarfsleyfiAMinumSidumApi } from '../../gen/fetch'
import { OccupationalLicensesClientConfig } from './client.config'

export const OccupationalLicensesApiProvider: Provider<StarfsleyfiAMinumSidumApi> = {
  provide: StarfsleyfiAMinumSidumApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof OccupationalLicensesClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new StarfsleyfiAMinumSidumApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-occupational-licenses',
          autoAuth: idsClientConfig.isConfigured
            ? {
                mode: 'tokenExchange',
                issuer: idsClientConfig.issuer,
                clientId: idsClientConfig.clientId,
                clientSecret: idsClientConfig.clientSecret,
                scope: [''],
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
    OccupationalLicensesClientConfig.KEY,
    IdsClientConfig.KEY,
  ],
}
