import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { BifrostUniversityCareerClientConfig } from './bifrostUniversityCareerClient.config'
import { Configuration, StudentTranscriptApi } from './gen/fetch'

export const BifrostUniversityCareerClientProvider = {
  provide: StudentTranscriptApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof BifrostUniversityCareerClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new StudentTranscriptApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-university-careers-bifrost-university',
          organizationSlug: 'bifrost',
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
    BifrostUniversityCareerClientConfig.KEY,
    IdsClientConfig.KEY,
  ],
}
