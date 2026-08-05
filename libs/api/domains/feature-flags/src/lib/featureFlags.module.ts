import { Module } from '@nestjs/common'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

import { FeatureFlagsResolver } from './featureFlags.resolver'
import { FeatureFlagsService } from './featureFlags.service'

@Module({
  imports: [FeatureFlagModule],
  providers: [FeatureFlagsResolver, FeatureFlagsService],
})
export class FeatureFlagsApiModule {}
