import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import {
  ExampleEndpointsForUniversitiesApi,
  Configuration,
} from '../../gen/fetch'
import { UniversityGatewayUniversityOfIcelandClientConfig } from './universityOfIcelandClient.config'

const configFactory = (
  xRoadConfig: ConfigType<typeof XRoadConfig>,
  config: ConfigType<typeof UniversityGatewayUniversityOfIcelandClientConfig>,
  idsClientConfig: ConfigType<typeof IdsClientConfig>,
  basePath: string,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-university-gateway-university-of-iceland',
    autoAuth: idsClientConfig.isConfigured
      ? {
          mode: 'auto',
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

export const exportedApis = [
  {
    provide: ExampleEndpointsForUniversitiesApi,
    useFactory: (
      xRoadConfig: ConfigType<typeof XRoadConfig>,
      config: ConfigType<
        typeof UniversityGatewayUniversityOfIcelandClientConfig
      >,
      idsClientConfig: ConfigType<typeof IdsClientConfig>,
    ) => {
      return new ExampleEndpointsForUniversitiesApi(
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
      UniversityGatewayUniversityOfIcelandClientConfig.KEY,
      IdsClientConfig.KEY,
    ],
  },
]
