import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { Configuration} from '../../gen/fetch'
import { ReykjavikUniversityApplicationClientConfig } from './reykjavikUniversityClient.config'

const configFactory = (
  xRoadConfig: ConfigType<typeof XRoadConfig>,
  config: ConfigType<typeof ReykjavikUniversityApplicationClientConfig>,
  idsClientConfig: ConfigType<typeof IdsClientConfig>,
  basePath: string,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-university-application-reykjavik-university',
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

export const ApiConfiguration = {
  provide: 'ReykjavikUniversityApplicationClientApiConfiguration',
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof ReykjavikUniversityApplicationClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
    return new Configuration(
        configFactory(
          xRoadConfig,
          config,
          idsClientConfig,
          `${xRoadConfig.xRoadBasePath}/r1/${config.xroadPath}`,
        )
    )
  },
  inject: [
    XRoadConfig.KEY,
    ReykjavikUniversityApplicationClientConfig.KEY,
    IdsClientConfig.KEY,
  ],
}
