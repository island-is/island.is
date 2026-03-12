import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { TransferOfMachineOwnershipTemplateService } from './transfer-of-machine-ownership.service'
import { ConfigModule } from '@nestjs/config'
import {
  WorkMachinesClientConfig,
  WorkMachinesClientModule,
} from '@island.is/clients/work-machines'

import { ClientsPaymentsModule } from '@island.is/clients/payments'
@Module({
  imports: [
    SharedTemplateAPIModule,
    WorkMachinesClientModule,
    ClientsPaymentsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [WorkMachinesClientConfig],
    }),
  ],
  providers: [TransferOfMachineOwnershipTemplateService],
  exports: [TransferOfMachineOwnershipTemplateService],
})
export class TransferOfMachineOwnershipTemplateModule {}
