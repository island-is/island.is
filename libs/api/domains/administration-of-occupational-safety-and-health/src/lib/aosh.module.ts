import {
  TransferOfMachineOwnershipClientConfig,
  TransferOfMachineOwnershipClientModule,
} from '@island.is/clients/aosh/transfer-of-machine-ownership'
import { Module } from '@nestjs/common'
import { AoshApi } from './aosh.service'
import { ConfigModule } from '@nestjs/config'
import { AoshResolver } from './aosh.resolver'

@Module({
  imports: [
    TransferOfMachineOwnershipClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [TransferOfMachineOwnershipClientConfig],
    }),
  ],
  providers: [AoshResolver, AoshApi],
  exports: [AoshApi],
})
export class AoshModule {}
