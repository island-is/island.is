import { TransferOfMachineOwnershipClientModule } from '@island.is/clients/aosh/transfer-of-machine-ownership'
import { Module } from '@nestjs/common'
import { AoshApi } from './aosh.service'
import { AoshResolver } from './aosh.resolver'

@Module({
  imports: [TransferOfMachineOwnershipClientModule],
  providers: [AoshResolver, AoshApi],
  exports: [AoshApi],
})
export class AoshModule {}
