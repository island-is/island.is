import { Module } from '@nestjs/common'

import { FeatureModule } from '../feature/feature.module'
import {
  AppealCaseAppealSummonsResolver,
  AppealSummonsResolver,
} from './appealSummons.resolver'

@Module({
  imports: [FeatureModule],
  providers: [AppealSummonsResolver, AppealCaseAppealSummonsResolver],
})
export class AppealSummonsModule {}
