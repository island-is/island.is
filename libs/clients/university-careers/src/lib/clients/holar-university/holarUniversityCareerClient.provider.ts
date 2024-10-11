import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { HolarUniversityCareerClientConfig } from './holarUniversityCareerClient.config'
import { Configuration, StudentTranscriptApi } from './gen/fetch'

export const HolarUniversityCareerClientProvider = {
  provide: StudentTranscriptApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof HolarUniversityCareerClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new StudentTranscriptApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-university-careers-holar-university',
          organizationSlug: 'holaskoli-haskolinn-a-holum',
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
        basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xroadPath}`,
        headers: {
          'X-Road-Client': xroadConfig.xRoadClient,
          Accept: 'application/json',
        },
      }),
    ),
  inject: [
    XRoadConfig.KEY,
    HolarUniversityCareerClientConfig.KEY,
    IdsClientConfig.KEY,
  ],
}
