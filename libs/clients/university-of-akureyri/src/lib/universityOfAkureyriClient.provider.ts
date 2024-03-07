import { Configuration, StudentTranscriptApi } from '../../gen/fetch'
import { Provider } from '@nestjs/common'
import {
  ConfigType,
  XRoadConfig,
  LazyDuringDevScope,
  IdsClientConfig,
} from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { UniversityOfAkureyriClientConfig } from './universityOfAkureyriClient.config'

export const DisabilityLicenseApiProvider: Provider<StudentTranscriptApi> = {
  provide: StudentTranscriptApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof UniversityOfAkureyriClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new StudentTranscriptApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          logErrorResponseBody: true,
          name: 'clients-disability-license',
          organizationSlug: 'tryggingastofnun',
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
        basePath: `${xroadConfig.xRoadBasePath}/r1/${config.path}`,
        headers: {
          'X-Road-Client': xroadConfig.xRoadClient,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }),
    ),
  inject: [
    XRoadConfig.KEY,
    UniversityOfAkureyriClientConfig.KEY,
    IdsClientConfig.KEY,
  ],
}
