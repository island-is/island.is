import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { TransferOfMachineOwnershipTemplateService } from './transfer-of-machine-ownership.service'
import { ConfigModule } from '@nestjs/config'
import {
  TransferOfMachineOwnershipClientConfig,
  TransferOfMachineOwnershipClientModule,
} from '@island.is/clients/aosh/transfer-of-machine-ownership'
import {
  ChargeFjsV2ClientConfig,
  ChargeFjsV2ClientModule,
} from '@island.is/clients/charge-fjs-v2'

export class TransferOfMachineOwnershipTemplateModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: TransferOfMachineOwnershipTemplateModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        TransferOfMachineOwnershipClientModule,
        ChargeFjsV2ClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            TransferOfMachineOwnershipClientConfig,
            ChargeFjsV2ClientConfig,
          ],
        }),
      ],
      providers: [TransferOfMachineOwnershipTemplateService],
      exports: [TransferOfMachineOwnershipTemplateService],
    }
  }
}
