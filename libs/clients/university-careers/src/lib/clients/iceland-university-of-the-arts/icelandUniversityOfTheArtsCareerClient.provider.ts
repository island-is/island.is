import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { Configuration, StudentTranscriptApi } from './gen/fetch'
import { IcelandUniversityOfTheArtsCareerClientConfig } from './icelandUniversityOfTheArtsCareerClient.config'

export const IcelandUniversityOfTheArtsCareerClientProvider = {
  provide: StudentTranscriptApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof IcelandUniversityOfTheArtsCareerClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new StudentTranscriptApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-university-careers-iceland-university-of-the-arts',
          organizationSlug: 'lhi',
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
    IcelandUniversityOfTheArtsCareerClientConfig.KEY,
    IdsClientConfig.KEY,
  ],
}
