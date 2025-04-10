import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { Configuration, EinstaklingarApi, IslandIsApi } from '../../gen/fetch'
import { NationalRegistryV3ApplicationsClientConfig } from './nationalRegistryV3Applications.config'

export const ApiConfigWithIdsAuth = {
  provide:
    'NationalRegistryV3ApplicationsClientProviderConfigurationWithIdsAuth',
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof NationalRegistryV3ApplicationsClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-national-registry-v3-applications',
        organizationSlug: 'thjodskra',
        timeout: config.fetchTimeout,
        autoAuth: idsClientConfig.isConfigured
          ? {
              mode: 'tokenExchange',
              issuer: idsClientConfig.issuer,
              clientId: idsClientConfig.clientId,
              clientSecret: idsClientConfig.clientSecret,
              scope: [],
            }
          : undefined,
      }),
      basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xroadConfig.xRoadClient,
        Accept: 'application/json',
      },
    }),
  inject: [
    XRoadConfig.KEY,
    NationalRegistryV3ApplicationsClientConfig.KEY,
    IdsClientConfig.KEY,
  ],
}

export const ApiConfigWithB2CAuth = {
  provide:
    'NationalRegistryV3ApplicationsClientProviderConfigurationWithB2CAuth',
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof NationalRegistryV3ApplicationsClientConfig>,
  ) =>
    new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-national-registry-v3-applications',
        organizationSlug: 'thjodskra',
        timeout: config.fetchTimeout,
        autoAuth: {
          mode: 'token',
          clientId: config.clientId,
          clientSecret: config.clientSecret,
          scope: [config.scope],
          issuer: '',
          tokenEndpoint: config.endpoint,
        },
      }),
      basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xroadConfig.xRoadClient,
        Accept: 'application/json',
      },
    }),
  inject: [XRoadConfig.KEY, NationalRegistryV3ApplicationsClientConfig.KEY],
}

export const exportedApis = [
  {
    provide: EinstaklingarApi,
    useFactory: (configuration: Configuration) => {
      return new EinstaklingarApi(configuration)
    },
    inject: [ApiConfigWithIdsAuth.provide],
  },
  {
    provide: IslandIsApi,
    useFactory: (configuration: Configuration) => {
      return new IslandIsApi(configuration)
    },
    inject: [ApiConfigWithB2CAuth.provide],
  },
]
