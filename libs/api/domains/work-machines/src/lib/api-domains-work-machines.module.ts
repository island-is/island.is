import { Module } from '@nestjs/common'
import { WorkMachinesResolver } from './api-domains-work-machines.resolver'
import { WorkMachinesService } from './api-domains-work-machines.service'
import { WorkMachinesClientModule } from '@island.is/clients/work-machines'
import { DisabilityLicenseClientModule } from '@island.is/clients/disability-license'

@Module({
  providers: [WorkMachinesResolver, WorkMachinesService],
  imports: [WorkMachinesClientModule, DisabilityLicenseClientModule],
})
export class WorkMachinesModule {}
