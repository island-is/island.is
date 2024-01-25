import { Module } from '@nestjs/common'
import { apiProviders } from './providers'
import { WorkMachinesClientService } from './workMachines.service'

@Module({
  providers: [WorkMachinesClientService, ...apiProviders],
  exports: [WorkMachinesClientService],
})
export class WorkMachinesClientModule {}
