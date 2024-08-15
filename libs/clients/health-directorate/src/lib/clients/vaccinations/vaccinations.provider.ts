import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { VaccinationsClientConfig } from './vaccinations.config'
import { Configuration, MeVaccinationsApi } from './gen/fetch'

const configFactory = (
  xRoadConfig: ConfigType<typeof XRoadConfig>,
  config: ConfigType<typeof VaccinationsClientConfig>,
  idsClientConfig: ConfigType<typeof IdsClientConfig>,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-health-directorate-vaccinations',
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

// Make as array to keep the option open for more APIs
export const exportedApis = [MeVaccinationsApi].map((Api) => ({
  provide: Api,
  scope: LazyDuringDevScope,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof VaccinationsClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
    return new Api(
      new Configuration(configFactory(xRoadConfig, config, idsClientConfig)),
    )
  },
  inject: [XRoadConfig.KEY, VaccinationsClientConfig.KEY, IdsClientConfig.KEY],
}))
