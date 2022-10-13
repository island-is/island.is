import { Module } from '@nestjs/common'

import { DelegationsModule as AuthDelegationsModule } from '@island.is/auth-api-lib'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { ProblemModule } from '@island.is/nest/problem'

import { MeDelegationsController } from './meDelegations.controller'

@Module({
  imports: [AuthDelegationsModule, FeatureFlagModule, ProblemModule],
  controllers: [MeDelegationsController],
  providers: [],
})
export class DelegationsModule {}
