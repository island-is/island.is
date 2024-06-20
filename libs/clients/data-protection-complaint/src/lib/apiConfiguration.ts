import { ConfigType, XRoadConfig } from '@island.is/nest/config'
import { DataProtectionComplaintClientConfig } from './data-protection-complaint-client.config'
import { Configuration } from '../gen/fetch'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

export const ApiConfiguration = {
  provide: 'DataProtectionClientApiConfiguration',
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof DataProtectionComplaintClientConfig>,
  ) =>
    new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'data-protection-complaint-client',
        organizationSlug: 'personuvernd',
        logErrorResponseBody: true,
        timeout: 60 * 1000, // 60 sec
      }),
      basePath: `${xRoadConfig.xRoadBasePath}/r1/${config.XRoadProviderId}`,
      headers: {
        'X-Road-Client': xRoadConfig.xRoadClient,
        Accept: 'application/json',
      },
    }),
  inject: [XRoadConfig.KEY, DataProtectionComplaintClientConfig.KEY],
}
