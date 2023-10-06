import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { FirearmLicenseClientConfig } from './firearmLicenseClient.config'
import { Configuration, FirearmApplicationApi } from '../../gen/fetch'
import { Provider } from '@nestjs/common'
import { FirearmApi } from './firearmApi.services'

export const FirearmLicenseApiProvider: Provider<FirearmApi> = {
  provide: FirearmApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof FirearmLicenseClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
    const api = new FirearmApplicationApi(
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
    )

    return new FirearmApi(api)
  },
  inject: [
    XRoadConfig.KEY,
    FirearmLicenseClientConfig.KEY,
    IdsClientConfig.KEY,
  ],
}
