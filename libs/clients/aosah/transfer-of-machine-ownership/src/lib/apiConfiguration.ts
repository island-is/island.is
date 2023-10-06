import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { MachinesApi, Configuration } from '../../gen/fetch'
import { TransferOfMachineOwnershipClientConfig } from './transferOfMachineOwnershipClient.config'

const configFactory = (
  xRoadConfig: ConfigType<typeof XRoadConfig>,
  config: ConfigType<typeof TransferOfMachineOwnershipClientConfig>,
  idsClientConfig: ConfigType<typeof IdsClientConfig>,
  basePath: string,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-aosah-transfer-of-machine-ownership',
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
    Accept: 'application/vnd.ver.machines.hateoas.v1+json',
  },
  basePath,
})

export const exportedApis = [
  {
    provide: MachinesApi,
    useFactory: (
      xRoadConfig: ConfigType<typeof XRoadConfig>,
      config: ConfigType<typeof TransferOfMachineOwnershipClientConfig>,
      idsClientConfig: ConfigType<typeof IdsClientConfig>,
    ) => {
      return new MachinesApi(
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
      TransferOfMachineOwnershipClientConfig.KEY,
      IdsClientConfig.KEY,
    ],
  },
]
