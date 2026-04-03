import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { TransferOfMachineOwnershipTemplateService } from './transfer-of-machine-ownership.service'
import { ConfigModule } from '@nestjs/config'
import {
  WorkMachinesClientConfig,
  WorkMachinesClientModule,
} from '@island.is/clients/work-machines'
import { PaymentModule } from '@island.is/application/api/payment'
@Module({
  imports: [
    SharedTemplateAPIModule,
    WorkMachinesClientModule,
    PaymentModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [WorkMachinesClientConfig],
    }),
  ],
  providers: [TransferOfMachineOwnershipTemplateService],
  exports: [TransferOfMachineOwnershipTemplateService],
})
export class TransferOfMachineOwnershipTemplateModule {}
