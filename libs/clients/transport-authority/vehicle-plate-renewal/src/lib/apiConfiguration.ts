import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { PlateOwnershipApi, Configuration } from '../../gen/fetch'
import { VehiclePlateRenewalClientConfig } from './vehiclePlateRenewalClient.config'

const configFactory = (
  basePath: string,
  xRoadConfig: ConfigType<typeof XRoadConfig>,
  config: ConfigType<typeof VehiclePlateRenewalClientConfig>,
  idsClientConfig?: ConfigType<typeof IdsClientConfig>,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-transport-authority-vehicle-plate-renewal',
    organizationSlug: 'samgongustofa',
    autoAuth: idsClientConfig?.isConfigured
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

export class PlateOwnershipApiWithoutIdsAuth extends PlateOwnershipApi {}

export const exportedApis = [
  {
    provide: PlateOwnershipApi,
    useFactory: (
      xRoadConfig: ConfigType<typeof XRoadConfig>,
      config: ConfigType<typeof VehiclePlateRenewalClientConfig>,
      idsClientConfig: ConfigType<typeof IdsClientConfig>,
    ) => {
      return new PlateOwnershipApi(
        new Configuration(
          configFactory(
            `${xRoadConfig.xRoadBasePath}/r1/${config.xroadPath}`,
            xRoadConfig,
            config,
            idsClientConfig,
          ),
        ),
      )
    },
    inject: [
      XRoadConfig.KEY,
      VehiclePlateRenewalClientConfig.KEY,
      IdsClientConfig.KEY,
    ],
  },
  {
    provide: PlateOwnershipApiWithoutIdsAuth,
    useFactory: (
      xRoadConfig: ConfigType<typeof XRoadConfig>,
      config: ConfigType<typeof VehiclePlateRenewalClientConfig>,
    ) => {
      return new PlateOwnershipApiWithoutIdsAuth(
        new Configuration(
          configFactory(
            `${xRoadConfig.xRoadBasePath}/r1/${config.xroadPath}`,
            xRoadConfig,
            config,
          ),
        ),
      )
    },
    inject: [XRoadConfig.KEY, VehiclePlateRenewalClientConfig.KEY],
  },
]
