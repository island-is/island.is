import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { TransferOfMachineOwnershipTemplateService } from './transfer-of-machine-ownership.service'
import { ConfigModule } from '@nestjs/config'
import {
  TransferOfMachineOwnershipClientConfig,
  TransferOfMachineOwnershipClientModule,
} from '@island.is/clients/aosah/transfer-of-machine-ownership'

export class TransferOfMachineOwnershipTemplateModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: TransferOfMachineOwnershipTemplateModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        TransferOfMachineOwnershipClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [TransferOfMachineOwnershipClientConfig],
        }),
      ],
      providers: [TransferOfMachineOwnershipTemplateService],
      exports: [TransferOfMachineOwnershipTemplateService],
    }
  }
}
