import { Module } from '@nestjs/common'
import { TransferOfMachineOwnershipClient } from './transferOfMachineOwnershipClient.service'
import { exportedApis } from './apiConfiguration'

@Module({
  providers: [TransferOfMachineOwnershipClient, ...exportedApis],
  exports: [TransferOfMachineOwnershipClient],
})
export class TransferOfMachineOwnershipClientModule {}
