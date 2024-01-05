import { Configuration, StudentTranscriptApi } from '../../gen/fetch'
import { Provider } from '@nestjs/common'
import {
  ConfigType,
  XRoadConfig,
  LazyDuringDevScope,
  IdsClientConfig,
} from '@island.is/nest/config'
import { UniversityOfIcelandClientConfig } from './universityOfIcelandClient.config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

export const UniversityOfIcelandApiProvider: Provider<StudentTranscriptApi> = {
  provide: StudentTranscriptApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof UniversityOfIcelandClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new StudentTranscriptApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          logErrorResponseBody: true,
          name: 'clients-university-of-iceland',
          organizationSlug: 'haskoli-islands',
          timeout: config.fetch.timeout,
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
        basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
        headers: {
          'X-Road-Client': xroadConfig.xRoadClient,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }),
    ),
  inject: [
    XRoadConfig.KEY,
    UniversityOfIcelandClientConfig.KEY,
    IdsClientConfig.KEY,
  ],
}
