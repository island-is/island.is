import { Configuration, DefaultApi } from '../../gen/fetch'
import { Provider } from '@nestjs/common'
import {
  ConfigType,
  XRoadConfig,
  LazyDuringDevScope,
  IdsClientConfig,
} from '@island.is/nest/config'
import { DisabilityLicenseClientConfig } from './disabilityLicenseClient.config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { DisabilityLicenseService } from './disabilityLicenseClient.service'

export const DisabilityLicenseApiProvider: Provider<DisabilityLicenseService> = {
  provide: DisabilityLicenseService,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof DisabilityLicenseClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
    const api = new DefaultApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          logErrorResponseBody: true,
          name: 'clients-disability-license',
          timeout: config.fetch.timeout,
          autoAuth: idsClientConfig.isConfigured
            ? {
                mode: 'tokenExchange',
                issuer: idsClientConfig.issuer,
                clientId: idsClientConfig.clientId,
                clientSecret: idsClientConfig.clientSecret,
                scope: config.fetch.scope,
              }
            : undefined,
        }),
        basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
        headers: {
          'X-Road-Client': xroadConfig.xRoadClient,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }),
    )
    return new DisabilityLicenseService(api)
  },
  inject: [
    XRoadConfig.KEY,
    DisabilityLicenseClientConfig.KEY,
    IdsClientConfig.KEY,
  ],
}
