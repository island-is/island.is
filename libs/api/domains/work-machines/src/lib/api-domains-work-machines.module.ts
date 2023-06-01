import { Module } from '@nestjs/common'
import { WorkMachinesResolver } from './api-domains-work-machines.resolver'
import { WorkMachinesService } from './api-domains-work-machines.service'
import { WorkMachinesClientModule } from '@island.is/clients/work-machines'
import { DisabilityLicenseClientModule } from '@island.is/clients/disability-license'

@Module({
  imports: [WorkMachinesClientModule, DisabilityLicenseClientModule],
  providers: [WorkMachinesResolver, WorkMachinesService],
})
export class WorkMachinesModule {}
