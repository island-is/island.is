import { Module } from '@nestjs/common'

import { IdentityModule } from '@island.is/api/domains/identity'
import { AuthPublicApiClientModule } from '@island.is/clients/auth-public-api'

import { ActorDelegationsService } from './actorDelegations.service'
import { ApiScopeService } from './apiScope.service'
import { MeDelegationsService } from './meDelegations.service'
import {
  ApiScopeResolver,
  DelegationResolver,
  DelegationScopeResolver,
} from './resolvers'

@Module({
  providers: [
    DelegationResolver,
    DelegationScopeResolver,
    ApiScopeResolver,
    MeDelegationsService,
    ActorDelegationsService,
    ApiScopeService,
  ],
  imports: [AuthPublicApiClientModule, IdentityModule],
})
export class AuthModule {}
