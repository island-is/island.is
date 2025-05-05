import { Module } from '@nestjs/common'
import { SeminarsResolver } from './seminars.resolver'
import { SeminarsService } from './seminars.service'
import { SeminarsClientModule } from '@island.is/clients/seminars-ver'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

@Module({
  imports: [SeminarsClientModule, FeatureFlagModule],
  providers: [SeminarsResolver, SeminarsService],
})
export class SeminarsModule {}
