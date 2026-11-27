import { Module } from '@nestjs/common'

import { FeatureModule } from '../feature/feature.module'
import { LimitedAccessVerdictResolver } from './limitedAccessVerdict.resolver'
import { VerdictResolver } from './verdict.resolver'

@Module({
  imports: [FeatureModule],
  providers: [VerdictResolver, LimitedAccessVerdictResolver],
})
export class VerdictModule {}
