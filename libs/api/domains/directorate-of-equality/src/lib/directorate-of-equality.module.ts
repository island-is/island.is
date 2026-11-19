import { Module } from '@nestjs/common'

import { DirectorateOfEqualityClientModule } from '@island.is/clients/directorate-of-equality'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

import { DirectorateOfEqualityResolver } from './directorate-of-equality.resolver'
import { DirectorateOfEqualityService } from './directorate-of-equality.service'

@Module({
  imports: [DirectorateOfEqualityClientModule, FeatureFlagModule],
  providers: [DirectorateOfEqualityResolver, DirectorateOfEqualityService],
})
export class DirectorateOfEqualityModule {}
