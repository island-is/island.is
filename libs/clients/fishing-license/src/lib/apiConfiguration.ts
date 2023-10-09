import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { FishingLicenseClientConfig } from './FishingLicenseClientConfig'
import { Configuration } from './gen/fetch'

export const ApiConfiguration = {
  provide: 'FishingLicenseClientApiConfiguration',
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof FishingLicenseClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-fishing-license',
        organizationSlug: 'fiskistofa',
        timeout: 30000, // 30 sec timeout
        logErrorResponseBody: true,
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
      basePath: `${xRoadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        Accept: 'application/json',
        'X-Road-Client': xRoadConfig.xRoadClient,
      },
    }),
  inject: [
    XRoadConfig.KEY,
    FishingLicenseClientConfig.KEY,
    IdsClientConfig.KEY,
  ],
}
