import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { AdrAndMachineLicenseClientConfig } from './adr-and-machine-license.config'

export const ApiConfig = {
  provide: 'AdrAndMachineClientProviderConfiguration',
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof AdrAndMachineLicenseClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-adr-and-machine-license',
        organizationSlug: 'vinnueftirlitid',
        logErrorResponseBody: true,
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
      }),
      basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xroadConfig.xRoadClient,
        Accept: 'application/json',
      },
    }),
  inject: [
    XRoadConfig.KEY,
    AdrAndMachineLicenseClientConfig.KEY,
    IdsClientConfig.KEY,
  ],
}
