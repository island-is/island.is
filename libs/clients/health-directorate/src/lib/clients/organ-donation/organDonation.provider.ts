import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { HealthDirectorateOrganDonationClientConfig } from './organDonation.config'
import {
  Configuration,
  MeOrganDonorStatusApi,
  DonationExceptionsApi,
} from './gen/fetch'

export const OrganDonorApiProvider = {
  provide: MeOrganDonorStatusApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof HealthDirectorateOrganDonationClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
    return new MeOrganDonorStatusApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-health-directorate-organ-donation',
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
    )
  },
  inject: [
    XRoadConfig.KEY,
    HealthDirectorateOrganDonationClientConfig.KEY,
    IdsClientConfig.KEY,
  ],
}

export const OrganExceptionsApiProvider = {
  provide: DonationExceptionsApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof HealthDirectorateOrganDonationClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
    return new DonationExceptionsApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-health-directorate-organ-donation-exceptions',
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
    )
  },
  inject: [
    XRoadConfig.KEY,
    HealthDirectorateOrganDonationClientConfig.KEY,
    IdsClientConfig.KEY,
  ],
}
