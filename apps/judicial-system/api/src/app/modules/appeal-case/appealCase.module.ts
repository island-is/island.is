import { Module } from '@nestjs/common'

import { FeatureModule } from '../feature/feature.module'
import { AppealCaseResolver } from './appealCase.resolver'
import { LimitedAccessAppealCaseResolver } from './limitedAccessAppealCase.resolver'

@Module({
  imports: [FeatureModule],
  providers: [AppealCaseResolver, LimitedAccessAppealCaseResolver],
})
export class AppealCaseModule {}
