import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { OrganDonationClientConfig } from './organDonation.config'
import {
  Configuration,
  MeDonorStatusApi,
  DonationExceptionsApi,
} from './gen/fetch'

const configFactory = (
  xRoadConfig: ConfigType<typeof XRoadConfig>,
  config: ConfigType<typeof OrganDonationClientConfig>,
  idsClientConfig: ConfigType<typeof IdsClientConfig>,
) => ({
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
})

export const exportedApis = [MeDonorStatusApi, DonationExceptionsApi].map(
  (Api) => ({
    provide: Api,
    scope: LazyDuringDevScope,
    useFactory: (
      xRoadConfig: ConfigType<typeof XRoadConfig>,
      config: ConfigType<typeof OrganDonationClientConfig>,
      idsClientConfig: ConfigType<typeof IdsClientConfig>,
    ) => {
      return new Api(
        new Configuration(configFactory(xRoadConfig, config, idsClientConfig)),
      )
    },
    inject: [
      XRoadConfig.KEY,
      OrganDonationClientConfig.KEY,
      IdsClientConfig.KEY,
    ],
  }),
)
