import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { Configuration, FirearmApplicationApi } from '../../../gen/fetch'
import { Provider } from '@nestjs/common'
import { OPEN_FIREARM_APPLICATION_API } from '../firearmApi.types'
import { OpenFirearmLicenseClientConfig } from '../openFirearmLicenseClient.config'

export const OpenFirearmApiProvider: Provider<FirearmApplicationApi> = {
  provide: OPEN_FIREARM_APPLICATION_API,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof OpenFirearmLicenseClientConfig>,
  ) =>
    new FirearmApplicationApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-firearm-license',
        }),
        basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
        headers: {
          'X-Road-Client': xroadConfig.xRoadClient,
          'X-Api-Key': config.xRoadFirearmOpenApiKey,
          Accept: 'application/json',
        },
      }),
    ),
  inject: [XRoadConfig.KEY, OpenFirearmLicenseClientConfig.KEY],
}
