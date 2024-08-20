import { Configuration, StudentTranscriptApi } from './gen/fetch'
import { Provider } from '@nestjs/common'
import { UniversityOfAkureyriCareerClientConfig } from './universityOfAkureyriCareerClient.config'
import {
  ConfigType,
  XRoadConfig,
  LazyDuringDevScope,
  IdsClientConfig,
} from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

export const UniversityOfAkureyriCareerClientProvider: Provider<StudentTranscriptApi> =
  {
    provide: StudentTranscriptApi,
    scope: LazyDuringDevScope,
    useFactory: (
      xroadConfig: ConfigType<typeof XRoadConfig>,
      config: ConfigType<typeof UniversityOfAkureyriCareerClientConfig>,
      idsClientConfig: ConfigType<typeof IdsClientConfig>,
    ) =>
      new StudentTranscriptApi(
        new Configuration({
          fetchApi: createEnhancedFetch({
            logErrorResponseBody: true,
            name: 'clients-university-careers-university-of-akureyri',
            organizationSlug: 'haskolinn-a-akureyri',
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
            'Content-Type': 'application/json',
          },
        }),
      ),
    inject: [
      XRoadConfig.KEY,
      UniversityOfAkureyriCareerClientConfig.KEY,
      IdsClientConfig.KEY,
    ],
  }
