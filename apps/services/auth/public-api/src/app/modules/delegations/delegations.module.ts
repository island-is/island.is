import { Module } from '@nestjs/common'

import { DelegationsModule as AuthDelegationsModule } from '@island.is/auth-api-lib'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

import { ActorDelegationsController } from './actorDelegations.controller'
import { MeDelegationsController } from './meDelegations.controller'

@Module({
  imports: [AuthDelegationsModule, FeatureFlagModule],
  controllers: [ActorDelegationsController, MeDelegationsController],
  providers: [],
})
export class DelegationsModule {}
