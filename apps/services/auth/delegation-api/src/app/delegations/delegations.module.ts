import { Module } from '@nestjs/common'

import { DelegationsModule as AuthDelegationsModule } from '@island.is/auth-api-lib'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

import { MeDelegationsController } from './me-delegations.controller'
import { DelegationIndexController } from './delegation-index.controller'
import { DelegationsController } from './delegations.controller'

@Module({
  imports: [AuthDelegationsModule, FeatureFlagModule],
  controllers: [
    MeDelegationsController,
    DelegationIndexController,
    DelegationsController,
  ],
  providers: [],
})
export class DelegationsModule {}
