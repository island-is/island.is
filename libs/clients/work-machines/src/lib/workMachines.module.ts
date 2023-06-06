import { Module } from '@nestjs/common'
import { WorkMachinesApiProvider } from './workMachines.provider'
import { WorkMachinesClientService } from './workMachines.service'

@Module({
  providers: [WorkMachinesClientService, WorkMachinesApiProvider],
  exports: [WorkMachinesClientService],
})
export class WorkMachinesClientModule {}
