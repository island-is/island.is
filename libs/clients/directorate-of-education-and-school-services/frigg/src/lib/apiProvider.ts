import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { Configuration, KeyOptionsManagementApi } from '../../gen/fetch'
import { ConfigFactory } from './configFactory'
import { FriggClientConfig } from './frigg.config'
import { Api, Scope } from './frigg.type'
import { Provider } from '@nestjs/common'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
/*
const apiCollection: Array<{ api: Api; scopes: Array<Scope> }> = [
  {
    api: KeyOptionsManagementApi,
    scopes: ['@tr.is/umsoknir:read'],
  },
]

export const apiProvider = apiCollection.map((apiRecord) => ({
  provide: apiRecord.api,
  scope: LazyDuringDevScope,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof FriggClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
    return new apiRecord.api(
      new Configuration(
        ConfigFactory(xRoadConfig, config, idsClientConfig, apiRecord.scopes),
      ),
    )
  },
  inject: [XRoadConfig.KEY, FriggClientConfig.KEY, IdsClientConfig.KEY],
}))*/

export const KeyOptionsManagementApiProvider: Provider<KeyOptionsManagementApi> =
  {
    provide: 'KeyOptionsManagementApi',
    scope: LazyDuringDevScope,
    useFactory: (
      xroadConfig: ConfigType<typeof XRoadConfig>,
      config: ConfigType<typeof FriggClientConfig>,
      idsClientConfig: ConfigType<typeof IdsClientConfig>,
    ) =>
      new KeyOptionsManagementApi(
        new Configuration({
          fetchApi: createEnhancedFetch({
            logErrorResponseBody: true,
            name: 'clients-mms-frigg',
            organizationSlug: 'menntamalastofnun',
            autoAuth: idsClientConfig.isConfigured
              ? {
                  mode: 'tokenExchange',
                  issuer: idsClientConfig.issuer,
                  clientId: idsClientConfig.clientId,
                  clientSecret: idsClientConfig.clientSecret,
                  scope: [],
                }
              : undefined,
            // timeout: config.fetch.timeout,
          }),
          basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
          headers: {
            'X-Road-Client': xroadConfig.xRoadClient,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }),
      ),
    inject: [XRoadConfig.KEY, IdsClientConfig.KEY], //FriggClientConfig.KEY,
  }
