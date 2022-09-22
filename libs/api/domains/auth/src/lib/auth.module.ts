import { Module } from '@nestjs/common'

import { IdentityClientModule } from '@island.is/clients/identity'
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
  imports: [AuthPublicApiClientModule, IdentityClientModule],
})
export class AuthModule {}
