import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { TransferOfMachineOwnershipClientConfig } from './transferOfMachineOwnershipClient.config'
import {
  MachinesApi,
  Configuration,
  MachineOwnerChangeApi,
  MachineSupervisorChangeApi,
  MachineCategoryApi,
} from '../../gen/fetch'

const configFactory = (
  xRoadConfig: ConfigType<typeof XRoadConfig>,
  config: ConfigType<typeof TransferOfMachineOwnershipClientConfig>,
  idsClientConfig: ConfigType<typeof IdsClientConfig>,
  basePath: string,
  acceptHeader: string,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-aosh-transfer-of-machine-ownership',
    organizationSlug: 'vinnueftirlitid',
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
  headers: {
    'X-Road-Client': xRoadConfig.xRoadClient,
    'Content-Type': 'application/json',
    Accept: acceptHeader,
  },
  basePath,
})

export class CustomMachineApi extends MachinesApi {}

export const exportedApis = [
  {
    api: MachinesApi,
    provide: MachinesApi,
    acceptHeader: 'application/vnd.ver.machines.hateoas.v1+json',
  },
  {
    api: MachinesApi,
    provide: CustomMachineApi,
    acceptHeader: 'application/vnd.ver.machine.hateoas.v1+json',
  },
  {
    api: MachineOwnerChangeApi,
    provide: MachineOwnerChangeApi,
    acceptHeader: 'application/json',
  },
  {
    api: MachineSupervisorChangeApi,
    provide: MachineSupervisorChangeApi,
    acceptHeader: 'application/json-patch+json',
  },
  {
    api: MachineCategoryApi,
    provide: MachineCategoryApi,
    acceptHeader: 'application/json',
  },
].map((item) => ({
  provide: item.provide,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof TransferOfMachineOwnershipClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
    return new item.api(
      new Configuration(
        configFactory(
          xRoadConfig,
          config,
          idsClientConfig,
          `${xRoadConfig.xRoadBasePath}/r1/${config.xroadPath}`,
          item.acceptHeader,
        ),
      ),
    )
  },
  inject: [
    XRoadConfig.KEY,
    TransferOfMachineOwnershipClientConfig.KEY,
    IdsClientConfig.KEY,
  ],
}))
