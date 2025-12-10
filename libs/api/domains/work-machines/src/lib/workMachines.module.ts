import { Module } from '@nestjs/common'
import { WorkMachinesService } from './workMachines.service'
import { WorkMachinesClientModule } from '@island.is/clients/work-machines'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { CollectionResolver } from './resolvers/collection.resolver'
import { WorkMachineResolver } from './resolvers/workMachine.resolver'
import { DeprecatedResolver } from './resolvers/deprecated.resolver'
import { SubCategoryResolver } from './resolvers/subCategory.resolver'
import { ModelResolver } from './resolvers/model.resolver'
import { TypeClassificationsResolver } from './resolvers/typeClassifications.resolver'
import { TypeClassificationResolver } from './resolvers/typeClassification.resolver'

@Module({
  imports: [WorkMachinesClientModule, FeatureFlagModule],
  providers: [
    CollectionResolver,
    WorkMachineResolver,
    DeprecatedResolver,
    TypeClassificationResolver,
    TypeClassificationsResolver,
    ModelResolver,
    SubCategoryResolver,
    WorkMachinesService,
  ],
})
export class WorkMachinesModule {}
