import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { MachinesApi, Configuration } from '../../gen/fetch'
import { TransferOfMachineOwnershipClientConfig } from './transferOfMachineOwnershipClient.config'

export const configFactory = (
  xRoadConfig: ConfigType<typeof XRoadConfig>,
  config: ConfigType<typeof TransferOfMachineOwnershipClientConfig>,
  idsClientConfig: ConfigType<typeof IdsClientConfig>,
  basePath: string,
  acceptHeader: string,
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
    Accept: acceptHeader,
  },
  basePath,
})
