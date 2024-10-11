import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { AgriculturalUniversityOfIcelandCareerClientConfig } from './agriculturalUniversityOfIcelandCareerClient.config'
import { Configuration, StudentTranscriptApi } from './gen/fetch'

export const AgriculturalUniversityOfIcelandCareerClientProvider = {
  provide: StudentTranscriptApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<
      typeof AgriculturalUniversityOfIcelandCareerClientConfig
    >,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new StudentTranscriptApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-university-careers-agricultural-university-of-iceland',
          organizationSlug: 'landbunadarhaskoli-islands',
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
    AgriculturalUniversityOfIcelandCareerClientConfig.KEY,
    IdsClientConfig.KEY,
  ],
}
