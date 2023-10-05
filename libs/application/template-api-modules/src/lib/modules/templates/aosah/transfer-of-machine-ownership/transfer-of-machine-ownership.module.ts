import { DynamicModule } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../../shared'

// The base config that template api modules are registered with by default
// (configurable inside `template-api.module.ts`)
import { BaseTemplateAPIModuleConfig } from '../../../../types'

// Here you import your module service
import { TransferOfMachineOwnershipTemplateService } from './transfer-of-machine-ownership.service'
import { ConfigModule } from '@nestjs/config'
import {
  AosahClientConfig,
  AosahClientModule,
} from '@island.is/clients/aosah/transfer-of-machine-ownership'

export class TransferOfMachineOwnershipTemplateModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: TransferOfMachineOwnershipTemplateModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        AosahClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [AosahClientConfig],
        }),
      ],
      providers: [TransferOfMachineOwnershipTemplateService],
      exports: [TransferOfMachineOwnershipTemplateService],
    }
  }
}
