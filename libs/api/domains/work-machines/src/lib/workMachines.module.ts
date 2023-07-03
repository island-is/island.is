import { Module } from '@nestjs/common'
import { WorkMachinesResolver } from './workMachines.resolver'
import { WorkMachinesService } from './workMachines.service'
import { WorkMachinesClientModule } from '@island.is/clients/work-machines'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

@Module({
  imports: [WorkMachinesClientModule, FeatureFlagModule],
  providers: [WorkMachinesResolver, WorkMachinesService],
})
export class WorkMachinesModule {}
