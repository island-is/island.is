import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { FirearmLicenseClientConfig } from './firearmLicenseClient.config'
import { Configuration, FirearmApplicationApi } from '../../gen/fetch'
import { Provider } from '@nestjs/common'
import { OpenFirearmApi } from './openFirearmApi.services'

export const OpenFirearmLicenseApiProvider: Provider<OpenFirearmApi> = {
  provide: OpenFirearmApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof FirearmLicenseClientConfig>,
  ) => {
    const api = new FirearmApplicationApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-firearm-license',
          logErrorResponseBody: true,
        }),
        basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
        headers: {
          'X-Road-Client': xroadConfig.xRoadClient,
          'X-Api-Key': config.xRoadFirearmOpenApiKey,
          Accept: 'application/json',
        },
      }),
    )

    return new OpenFirearmApi(api)
  },
  inject: [XRoadConfig.KEY, FirearmLicenseClientConfig.KEY],
}
