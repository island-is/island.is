import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { FishingLicenseClientConfig } from './FishingLicenseClientConfig'
import { Configuration } from './gen/fetch'

export const FishingLicenseApiFactoryConfig = (
  xRoadConfig: ConfigType<typeof XRoadConfig>,
  config: ConfigType<typeof FishingLicenseClientConfig>,
  idsClientConfig: ConfigType<typeof IdsClientConfig>,
) =>
  new Configuration({
    fetchApi: createEnhancedFetch({
      name: 'clients-fishing-license',
      treat400ResponsesAsErrors: true,
      logErrorResponseBody: true,
      autoAuth: idsClientConfig.clientSecret
        ? {
            mode: 'tokenExchange',
            issuer: idsClientConfig.issuer,
            clientId: idsClientConfig.clientId,
            clientSecret: idsClientConfig.clientSecret,
            scope: config.scope,
          }
        : undefined,
    }),
    basePath: `${xRoadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}/`,
    headers: {
      Accept: 'application/json',
      'X-Road-Client': xRoadConfig.xRoadClient,
    },
  })
