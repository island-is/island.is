import { Module } from '@nestjs/common'
import { TransferOfMachineOwnershipClient } from './transferOfMachineOwnershipClient.service'
import { configFactory } from './apiConfiguration'
import {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import {
  MachinesApi,
  Configuration,
  MachineOwnerChangeApi,
} from '../../gen/fetch'
import { TransferOfMachineOwnershipClientConfig } from './transferOfMachineOwnershipClient.config'
import { CustomMachineApi } from './customMachineApi'

@Module({
  providers: [
    TransferOfMachineOwnershipClient,
    {
      provide: MachinesApi, // Use this name for injection
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
              'application/vnd.ver.machines.hateoas.v1+json', // Set the desired Accept header
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
    {
      provide: CustomMachineApi, // Use this name for injection
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
              'application/vnd.ver.machine.hateoas.v1+json', // Set the desired Accept header
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
    {
      provide: MachineOwnerChangeApi,
      useFactory: (
        xRoadConfig: ConfigType<typeof XRoadConfig>,
        config: ConfigType<typeof TransferOfMachineOwnershipClientConfig>,
        idsClientConfig: ConfigType<typeof IdsClientConfig>,
      ) => {
        return new MachineOwnerChangeApi(
          new Configuration(
            configFactory(
              xRoadConfig,
              config,
              idsClientConfig,
              `${xRoadConfig.xRoadBasePath}/r1/${config.xroadPath}`,
              'application/json', // Set the desired Accept header
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
  ],
  exports: [TransferOfMachineOwnershipClient],
})
export class TransferOfMachineOwnershipClientModule {}
