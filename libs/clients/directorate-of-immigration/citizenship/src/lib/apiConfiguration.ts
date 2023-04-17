import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
// import { CitizenshipApi, Configuration } from '../../gen/fetch'
import { CitizenshipClientConfig } from './citizenshipClient.config'

const configFactory = (
  xRoadConfig: ConfigType<typeof XRoadConfig>,
  config: ConfigType<typeof CitizenshipClientConfig>,
  idsClientConfig: ConfigType<typeof IdsClientConfig>,
  basePath: string,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-directorate-of-immigration-citizenship',
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
  //   provide: CitizenshipApi,
  //   useFactory: (
  //     xRoadConfig: ConfigType<typeof XRoadConfig>,
  //     config: ConfigType<typeof CitizenshipClientConfig>,
  //     idsClientConfig: ConfigType<typeof IdsClientConfig>,
  //   ) => {
  //     return new CitizenshipApi(
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
  //     CitizenshipClientConfig.KEY,
  //     IdsClientConfig.KEY,
  //   ],
  // },
]
