import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { Configuration, CoursesApi, ProgramsApi } from '../../gen/fetch'
import { UniversityOfAkureyriApplicationClientConfig } from './universityOfAkureyriClient.config'

const configFactory = (
  xRoadConfig: ConfigType<typeof XRoadConfig>,
  config: ConfigType<typeof UniversityOfAkureyriApplicationClientConfig>,
  idsClientConfig: ConfigType<typeof IdsClientConfig>,
  basePath: string,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-university-application-university-of-akureyri',
    autoAuth: idsClientConfig.isConfigured
      ? {
          mode: 'auto',
          issuer: idsClientConfig.issuer,
          clientId: idsClientConfig.clientId,
          clientSecret: idsClientConfig.clientSecret,
          scope: config.scope,
        }
      : undefined,
    timeout: config.fetchTimeout,
  }),
  headers: {
    'X-Road-Client': xRoadConfig.xRoadClient,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  basePath,
})

export const exportedApis = [ProgramsApi, CoursesApi].map((Api) => ({
  provide: Api,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof UniversityOfAkureyriApplicationClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
    return new Api(
      new Configuration(
        configFactory(
          xRoadConfig,
          config,
          idsClientConfig,
          `${xRoadConfig.xRoadBasePath}/r1/${config.xroadPath}`,
        ),
      ),
    )
  },
  inject: [
    XRoadConfig.KEY,
    UniversityOfAkureyriApplicationClientConfig.KEY,
    IdsClientConfig.KEY,
  ],
}))
