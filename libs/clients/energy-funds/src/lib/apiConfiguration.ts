import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  XRoadConfig,
  IdsClientConfig,
} from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { EnergyFundsClientConfig } from './energyFundsClient.config'

export const ApiConfiguration = {
  provide: 'EnergyFundsClientApiConfiguration',
  useFactory: (
    config: ConfigType<typeof EnergyFundsClientConfig>,
    xroadConfig: ConfigType<typeof XRoadConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-energy-funds',
        organizationSlug: 'fjarsysla-rikisins',
        logErrorResponseBody: true,
        autoAuth: idsClientConfig.isConfigured
          ? {
              mode: 'auto',
              issuer: idsClientConfig.issuer,
              clientId: idsClientConfig.clientId,
              clientSecret: idsClientConfig.clientSecret,
              scope: config.tokenExchangeScope,
            }
          : undefined,
      }),
      basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xroadConfig.xRoadClient,
      },
    })
  },
  inject: [EnergyFundsClientConfig.KEY, XRoadConfig.KEY, IdsClientConfig.KEY],
}
