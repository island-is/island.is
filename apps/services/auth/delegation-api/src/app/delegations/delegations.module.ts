import { Module } from '@nestjs/common'

import { DelegationsModule as AuthDelegationsModule } from '@island.is/auth-api-lib'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

import { MeDelegationConfirmationsController } from './me-delegation-confirmations.controller'
import { MeDelegationsController } from './me-delegations.controller'
import { DelegationIndexController } from './delegation-index.controller'
import { DelegationsController } from './delegations.controller'

@Module({
  imports: [AuthDelegationsModule, FeatureFlagModule],
  controllers: [
    MeDelegationsController,
    MeDelegationConfirmationsController,
    DelegationIndexController,
    DelegationsController,
  ],
  providers: [],
})
export class DelegationsModule {}
