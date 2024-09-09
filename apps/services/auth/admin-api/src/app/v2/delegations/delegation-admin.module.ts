import { Module } from '@nestjs/common'

import { DelegationsModule as AuthDelegationsModule } from '@island.is/auth-api-lib'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { DelegationAdminController } from './delegation-admin.controller'

@Module({
  imports: [AuthDelegationsModule, FeatureFlagModule],
  controllers: [DelegationAdminController],
  providers: [],
})
export class DelegationAdminModule {}
