import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { FirearmLicenseClientConfig } from '../firearmLicenseClient.config'
import { Configuration, FirearmApplicationApi } from '../../../gen/fetch'
import { Provider } from '@nestjs/common'
import { FIREARM_APPLICATION_API } from '../firearmApi.types'

export const FirearmApiProvider: Provider<FirearmApplicationApi> = {
  provide: FIREARM_APPLICATION_API,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof FirearmLicenseClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new FirearmApplicationApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-firearm-license',
          organizationSlug: 'rikislogreglustjori',
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
    ),
  inject: [
    XRoadConfig.KEY,
    FirearmLicenseClientConfig.KEY,
    IdsClientConfig.KEY,
  ],
}
