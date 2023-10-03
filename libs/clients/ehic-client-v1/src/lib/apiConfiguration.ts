import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { EhicClientConfig } from './ehicClientConfig'

export const ApiConfiguration = {
  provide: 'EhicClientV1ApiConfiguration',
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof EhicClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-ehic-client-v1',
        organizationSlug: 'sjukratryggingar',
        timeout: 60000,
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
      basePath: `${xRoadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        Accept: 'application/json',
        'X-Road-Client': xRoadConfig.xRoadClient,
      },
    }),
  inject: [XRoadConfig.KEY, EhicClientConfig.KEY, IdsClientConfig.KEY],
}
