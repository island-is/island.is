import { HealthDirectorateClientModule } from '@island.is/clients/health-directorate'
import { Module } from '@nestjs/common'
import { HealthDirectorateResolver } from './health-directorate.resolver'
import { HealthDirectorateService } from './health-directorate.service'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

@Module({
  imports: [HealthDirectorateClientModule, FeatureFlagModule],
  providers: [HealthDirectorateResolver, HealthDirectorateService],
})
export class HealthDirectorateModule {}
