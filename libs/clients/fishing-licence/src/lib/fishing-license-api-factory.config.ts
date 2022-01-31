import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { FishingLicenseClientConfig } from './fishing-license.config'

export const FishingLicenseApiFactoryConfig = (
  xRoadConfig: ConfigType<typeof XRoadConfig>,
  config: ConfigType<typeof FishingLicenseClientConfig>,
) =>
  new Configuration({
    fetchApi: createEnhancedFetch({
      name: 'clients-fishing-license',
      treat400ResponsesAsErrors: true,
      logErrorResponseBody: true,
      ...config.fetch,
    }),
    basePath: `${xRoadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}/`,
    headers: {
      Accept: 'application/json',
      'X-Road-Client': xRoadConfig.xRoadClient,
    },
  })
