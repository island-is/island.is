import { Module } from '@nestjs/common'

import { DirectorateOfEqualityClientModule } from '@island.is/clients/directorate-of-equality'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

import { AccessResolver } from './access.resolver'
import { DirectorateOfEqualityResolver } from './directorate-of-equality.resolver'
import { DirectorateOfEqualityService } from './directorate-of-equality.service'
import { ReportResolver } from './report.resolver'

@Module({
  imports: [DirectorateOfEqualityClientModule, FeatureFlagModule],
  providers: [
    AccessResolver,
    DirectorateOfEqualityResolver,
    ReportResolver,
    DirectorateOfEqualityService,
  ],
})
export class DirectorateOfEqualityModule {}
