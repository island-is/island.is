import { Module } from '@nestjs/common'

import {
  ClientsModule,
  DelegationsModule as AuthDelegationsModule,
} from '@island.is/auth-api-lib'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

import { ActorDelegationsController } from './actorDelegations.controller'

@Module({
  imports: [AuthDelegationsModule, ClientsModule, FeatureFlagModule],
  controllers: [ActorDelegationsController],
  providers: [],
})
export class DelegationsModule {}
