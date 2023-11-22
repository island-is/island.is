import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { HealthDirectorateClientConfig } from './healthDirectorateClient.config'
import {
  Configuration,
  StarfsleyfiAMinumSidumApi,
  VottordApi,
} from '../../gen/fetch'

const configFactory = (
  xRoadConfig: ConfigType<typeof XRoadConfig>,
  config: ConfigType<typeof HealthDirectorateClientConfig>,
  idsClientConfig: ConfigType<typeof IdsClientConfig>,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-health-directorate',
    organizationSlug: 'landlaeknir',
    logErrorResponseBody: true,
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
  basePath: `${xRoadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
  headers: {
    'X-Road-Client': xRoadConfig.xRoadClient,
    Accept: 'application/json',
  },
})

export const exportedApis = [StarfsleyfiAMinumSidumApi, VottordApi].map(
  (Api) => ({
    provide: Api,
    scope: LazyDuringDevScope,
    useFactory: (
      xRoadConfig: ConfigType<typeof XRoadConfig>,
      config: ConfigType<typeof HealthDirectorateClientConfig>,
      idsClientConfig: ConfigType<typeof IdsClientConfig>,
    ) => {
      return new Api(
        new Configuration(configFactory(xRoadConfig, config, idsClientConfig)),
      )
    },
    inject: [
      XRoadConfig.KEY,
      HealthDirectorateClientConfig.KEY,
      IdsClientConfig.KEY,
    ],
  }),
)
