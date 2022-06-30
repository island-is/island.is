import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { FirearmLicenseClientConfig } from './firearmLicenseClient.config'
import { Configuration, FirearmApplicationApi } from '../../gen/fetch'
import { Provider } from '@nestjs/common'

export const FirearmLicenseApiProvider: Provider<FirearmApplicationApi> = {
  provide: FirearmApplicationApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof FirearmLicenseClientConfig>,
  ) =>
    new FirearmApplicationApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-firearm-license',
          logErrorResponseBody: true,
        }),
        basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
        headers: {
          'X-Road-Client': xroadConfig.xRoadClient,
          Accept: 'application/json',
        },
      }),
    ),
  inject: [XRoadConfig.KEY, FirearmLicenseClientConfig.KEY],
}
