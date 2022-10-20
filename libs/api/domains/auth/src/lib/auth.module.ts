import { Module } from '@nestjs/common'

import { IdentityClientModule } from '@island.is/clients/identity'
import { AuthPublicApiClientModule } from '@island.is/clients/auth-public-api'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

import { ActorDelegationsService } from './services/actorDelegations.service'
import { ApiScopeServiceV1 } from './services-v1/apiScope.service'
import { DomainService } from './services/domain.service'
import { MeDelegationsServiceV1 } from './services-v1/meDelegations.service'
import {
  ApiScopeResolver,
  DelegationResolver,
  DelegationScopeResolver,
  CustomDelegationResolver,
} from './resolvers'
import { MeDelegationsService } from './services/meDelegations.service'
import { ApiScopeService } from './services/apiScope.service'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { DataLoaderInterceptor } from '@island.is/nest/dataloader'
import { DomainLoader } from './loaders/domain.loader'
import { ApiScopeLoader } from './loaders/apiScope.loader'

@Module({
  providers: [
    DelegationResolver,
    CustomDelegationResolver,
    DelegationScopeResolver,
    ApiScopeResolver,
    DomainService,
    ActorDelegationsService,
    MeDelegationsService,
    MeDelegationsServiceV1,
    ApiScopeService,
    ApiScopeServiceV1,
    ApiScopeLoader,
    DomainLoader,
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
  ],
  imports: [AuthPublicApiClientModule, FeatureFlagModule, IdentityClientModule],
})
export class AuthModule {}
