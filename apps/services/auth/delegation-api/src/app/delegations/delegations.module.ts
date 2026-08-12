import { Module } from '@nestjs/common'

import { DelegationsModule as AuthDelegationsModule } from '@island.is/auth-api-lib'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

import { MeDelegationsController } from './me-delegations.controller'
import { DelegationIndexController } from './delegation-index.controller'
import { DelegationsController } from './delegations.controller'
import { DelegationRequestsController } from './delegation-requests.controller'

@Module({
  imports: [AuthDelegationsModule, FeatureFlagModule],
  controllers: [
    MeDelegationsController,
    DelegationIndexController,
    DelegationsController,
    DelegationRequestsController,
  ],
  providers: [],
})
export class DelegationsModule {}
