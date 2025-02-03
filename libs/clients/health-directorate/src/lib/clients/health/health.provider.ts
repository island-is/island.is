import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import {
  Configuration,
  MeDispensationsApi,
  MePrescriptionsApi,
  MeReferralsApi,
  MeWaitingListsApi,
} from './gen/fetch'
import { HealthDirectorateHealthClientConfig } from './health.config'

export const sharedApiConfig = {
  provide: 'HealthApiProviderConfiguration',
  scope: LazyDuringDevScope,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof HealthDirectorateHealthClientConfig>, // TODO: Change to correct key
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-health-directorate-health',
        organizationSlug: 'landlaeknir',
        logErrorResponseBody: true,
        autoAuth: idsClientConfig.isConfigured
          ? {
              mode: 'tokenExchange',
              issuer: idsClientConfig.issuer,
              clientId: idsClientConfig.clientId,
              clientSecret: idsClientConfig.clientSecret,
              scope: config.scope,
            }
          : undefined,
      }),
      basePath: `${xRoadConfig.xRoadBasePath}/r1/${config.xroadPath}`,
      headers: {
        'X-Road-Client': xRoadConfig.xRoadClient,
        Accept: 'application/json',
      },
    }),
  inject: [
    XRoadConfig.KEY,
    HealthDirectorateHealthClientConfig.KEY, // TODO: Change to correct key
    IdsClientConfig.KEY,
  ],
}

export const exportedHealthApis = [
  MeWaitingListsApi,
  MeReferralsApi,
  MePrescriptionsApi,
  MeDispensationsApi,
].map((Api) => ({
  provide: Api,
  useFactory: (configuration: Configuration) => {
    return new Api(configuration)
  },
  inject: [sharedApiConfig.provide],
}))
