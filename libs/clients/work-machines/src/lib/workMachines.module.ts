import { Module } from '@nestjs/common'
import { apiProviders } from './providers'
import { WorkMachinesClientService } from './workMachines.service'
import { ApiConfig } from './api.config'

@Module({
  providers: [WorkMachinesClientService, ApiConfig, ...apiProviders],
  exports: [WorkMachinesClientService],
})
export class WorkMachinesClientModule {}
