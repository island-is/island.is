import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { ChangeMachineSupervisorTemplateService } from './change-machine-supervisor.service'
import { ConfigModule } from '@nestjs/config'
import {
  TransferOfMachineOwnershipClientConfig,
  TransferOfMachineOwnershipClientModule,
} from '@island.is/clients/aosh/transfer-of-machine-ownership'

export class ChangeMachineSupervisorTemplateModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: ChangeMachineSupervisorTemplateModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        TransferOfMachineOwnershipClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [TransferOfMachineOwnershipClientConfig],
        }),
      ],
      providers: [ChangeMachineSupervisorTemplateService],
      exports: [ChangeMachineSupervisorTemplateService],
    }
  }
}
