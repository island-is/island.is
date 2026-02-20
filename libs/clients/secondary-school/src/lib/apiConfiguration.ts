import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import {
  SchoolsApi,
  ApplicationsApi,
  Configuration,
  StudentsApi,
  ProgrammesApi,
} from '../../gen/fetch'
import {
  SecondarySchoolClientConfig,
  SecondarySchoolPublicProgrammeClientConfig,
} from './secondarySchoolClient.config'

const configFactory = (
  xRoadConfig: ConfigType<typeof XRoadConfig>,
  config: ConfigType<typeof SecondarySchoolClientConfig>,
  idsClientConfig: ConfigType<typeof IdsClientConfig>,
  basePath: string,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-secondary-school',
    organizationSlug: 'midstod-menntunar-og-skolathjonustu',
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
  headers: {
    'X-Road-Client': xRoadConfig.xRoadClient,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  basePath,
})

const publicConfigFactory = (
  xRoadConfig: ConfigType<typeof XRoadConfig>,
  config: ConfigType<typeof SecondarySchoolClientConfig>,
  basePath: string,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-secondary-school-public',
    organizationSlug: 'midstod-menntunar-og-skolathjonustu',
  }),
  headers: {
    'X-Road-Client': xRoadConfig.xRoadClient,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  basePath,
})

export const exportedApis = [
  ApplicationsApi,
  SchoolsApi,
  StudentsApi,
  ProgrammesApi,
].map((Api) => ({
  provide: Api,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof SecondarySchoolClientConfig>,
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
    SecondarySchoolClientConfig.KEY,
    IdsClientConfig.KEY,
  ],
}))

// Public ProgrammesApi without authentication and different
export const publicProgrammesApiProvider = {
  provide: ProgrammesApi,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof SecondarySchoolPublicProgrammeClientConfig>,
  ) => {
    return new ProgrammesApi(
      new Configuration(
        publicConfigFactory(
          xRoadConfig,
          config,
          `${xRoadConfig.xRoadBasePath}/r1/${config.xroadPath}`,
        ),
      ),
    )
  },
  inject: [XRoadConfig.KEY, SecondarySchoolPublicProgrammeClientConfig.KEY],
}
