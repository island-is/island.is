import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { NationalRegistryV3ApplicationsClientConfig } from './nationalRegistryV3Applications.config'

export const ApiConfig = {
  provide: 'NationalRegistryV3ApplicationsClientProviderConfiguration',
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
        // autoAuth: {
        //   mode: 'token',
        //   clientId: config.clientId,
        //   clientSecret: config.clientSecret,
        //   scope: [config.scope],
        //   issuer: '',
        //   tokenEndpoint: config.endpoint,
        // },
        autoAuth: {
          mode: 'tokenExchange',
          issuer: idsClientConfig.issuer,
          clientId: idsClientConfig.clientId,
          clientSecret: idsClientConfig.clientSecret,
          scope: [],
        },
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
