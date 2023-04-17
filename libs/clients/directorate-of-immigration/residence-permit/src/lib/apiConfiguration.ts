import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
// import { ResidencePermitApi, Configuration } from '../../gen/fetch'
import { ResidencePermitClientConfig } from './residencePermitClient.config'

const configFactory = (
  xRoadConfig: ConfigType<typeof XRoadConfig>,
  config: ConfigType<typeof ResidencePermitClientConfig>,
  idsClientConfig: ConfigType<typeof IdsClientConfig>,
  basePath: string,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-directorate-of-immigration-residence-permit',
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

export const exportedApis = [
  // {
  //   provide: ResidencePermitApi,
  //   useFactory: (
  //     xRoadConfig: ConfigType<typeof XRoadConfig>,
  //     config: ConfigType<typeof ResidencePermitClientConfig>,
  //     idsClientConfig: ConfigType<typeof IdsClientConfig>,
  //   ) => {
  //     return new ResidencePermitApi(
  //       new Configuration(
  //         configFactory(
  //           xRoadConfig,
  //           config,
  //           idsClientConfig,
  //           `${xRoadConfig.xRoadBasePath}/r1/${config.xroadPath}`,
  //         ),
  //       ),
  //     )
  //   },
  //   inject: [
  //     XRoadConfig.KEY,
  //     ResidencePermitClientConfig.KEY,
  //     IdsClientConfig.KEY,
  //   ],
  // },
]
