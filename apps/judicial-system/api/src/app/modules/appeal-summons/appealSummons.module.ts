import { Module } from '@nestjs/common'

import { FeatureModule } from '../feature/feature.module'
import {
  AppealSummonsResolver,
  CaseAppealSummonsResolver,
} from './appealSummons.resolver'

@Module({
  imports: [FeatureModule],
  providers: [AppealSummonsResolver, CaseAppealSummonsResolver],
})
export class AppealSummonsModule {}
