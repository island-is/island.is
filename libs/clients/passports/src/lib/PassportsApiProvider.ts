import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  LazyDuringDevScope,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'

import {
  Configuration,
  DeliveryAddressApi,
  IdentityDocumentApi,
  PreregistrationApi,
} from '../../gen/fetch'
import { PassportsClientConfig } from './passports.config'

export const ApiConfiguration = {
  provide: 'PassportsClientApiConfiguration',
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
    config: ConfigType<typeof PassportsClientConfig>,
  ) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-passports',
        organizationSlug: 'thjodskra-islands',
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
    })
  },
  inject: [XRoadConfig.KEY, IdsClientConfig.KEY, PassportsClientConfig.KEY],
}

export const PassportsApis = [
  IdentityDocumentApi,
  PreregistrationApi,
  DeliveryAddressApi,
].map((Api) => ({
  provide: Api,
  scope: LazyDuringDevScope,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [ApiConfiguration.provide],
}))
