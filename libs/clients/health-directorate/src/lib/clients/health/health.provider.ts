import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { HealthDirectorateVaccinationsClientConfig } from './health.config'
import {
  Configuration,
  MeDispensationsApi,
  MeReferralsApi,
  MeWaitingListsApi,
} from './gen/fetch'

export const HealthApiProvider = {
  provide: [MeDispensationsApi, MeReferralsApi, MeWaitingListsApi],
  scope: LazyDuringDevScope,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof HealthDirectorateVaccinationsClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => [
    new MeDispensationsApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-health-directorate-dispensations',
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
    ),
    new MeReferralsApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-health-directorate-referrals',
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
    ),
    new MeWaitingListsApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-health-directorate-waiting-lists',
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
    ),
  ],
  inject: [
    XRoadConfig.KEY,
    HealthDirectorateVaccinationsClientConfig.KEY, // TODO: Change to correct key
    IdsClientConfig.KEY,
  ],
}
