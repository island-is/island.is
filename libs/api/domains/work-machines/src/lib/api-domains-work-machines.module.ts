import { Module } from '@nestjs/common'
import { WorkMachinesResolver } from './api-domains-work-machines.resolver'
import { WorkMachinesService } from './api-domains-work-machines.service'
import { WorkMachinesClientModule } from '@island.is/clients/work-machines'

@Module({
  imports: [WorkMachinesClientModule],
  providers: [WorkMachinesResolver, WorkMachinesService],
  exports: [WorkMachinesService],
})
export class WorkMachinesModule {}
