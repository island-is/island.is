import { Module } from '@nestjs/common'
import { WorkMachinesService } from './workMachines.service'
import { WorkMachinesClientModule } from '@island.is/clients/work-machines'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { PaginatedCollectionResolver } from './resolvers/paginatedCollection.resolver'
import { WorkMachineResolver } from './resolvers/workMachine.resolver'
import { DeprecatedResolver } from './resolvers/deprecated.resolver'

@Module({
  imports: [WorkMachinesClientModule, FeatureFlagModule],
  providers: [
    PaginatedCollectionResolver,
    WorkMachineResolver,
    DeprecatedResolver,
    WorkMachinesService,
  ],
})
export class WorkMachinesModule {}
