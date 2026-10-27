import { Module } from '@nestjs/common'

import { DelegationsModule as AuthDelegationsModule } from '@island.is/auth-api-lib'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { DelegationAdminController } from './delegation-admin.controller'
import { MeDelegationOverviewController } from './me-delegation-overview.controller'

@Module({
  imports: [AuthDelegationsModule, FeatureFlagModule],
  controllers: [DelegationAdminController, MeDelegationOverviewController],
  providers: [],
})
export class DelegationAdminModule {}
