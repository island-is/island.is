import { Module } from '@nestjs/common'
import { TransferOfMachineOwnershipClient } from './transferOfMachineOwnershipClient.service'
import { exportedApis } from './apiConfiguration'

@Module({
  providers: [...exportedApis, TransferOfMachineOwnershipClient],
  exports: [TransferOfMachineOwnershipClient],
})
export class TransferOfMachineOwnershipClientModule {}
