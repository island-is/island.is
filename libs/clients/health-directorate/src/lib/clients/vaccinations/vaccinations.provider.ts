import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { HealthDirectorateVaccinationsClientConfig } from './vaccinations.config'
import { Configuration, MeVaccinationsApi } from './gen/fetch'

// Make as array to keep the option open for more APIs
export const VaccinationsApiProvider = {
  provide: MeVaccinationsApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof HealthDirectorateVaccinationsClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
    return new MeVaccinationsApi(
      new Configuration({
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
      }),
    )
  },
  inject: [
    XRoadConfig.KEY,
    HealthDirectorateVaccinationsClientConfig.KEY,
    IdsClientConfig.KEY,
  ],
}
