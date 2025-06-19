import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { PermitApplicationApi, Configuration } from '../../gen/fetch'
import { ExemptionForTransportationClientConfig } from './exemptionForTransportationClient.config'

const configFactory = (
  xRoadConfig: ConfigType<typeof XRoadConfig>,
  config: ConfigType<typeof ExemptionForTransportationClientConfig>,
  idsClientConfig: ConfigType<typeof IdsClientConfig>,
  basePath: string,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-transport-authority-exemption-for-transportation',
    organizationSlug: 'samgongustofa',
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
  {
    provide: PermitApplicationApi,
    useFactory: (
      xRoadConfig: ConfigType<typeof XRoadConfig>,
      config: ConfigType<typeof ExemptionForTransportationClientConfig>,
      idsClientConfig: ConfigType<typeof IdsClientConfig>,
    ) => {
      return new PermitApplicationApi(
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
      ExemptionForTransportationClientConfig.KEY,
      IdsClientConfig.KEY,
    ],
  },
]
