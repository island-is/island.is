import { Module } from '@nestjs/common'

import { AuthDelegationApiClientModule } from '@island.is/clients/auth/delegation-api'
import { AuthPublicApiClientModule } from '@island.is/clients/auth/public-api'
import { IdentityClientModule } from '@island.is/clients/identity'
import { CmsModule } from '@island.is/cms'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

import { DomainLoader } from './loaders/domain.loader'
import { ApiScopeLoader } from './loaders/apiScope.loader'
import { ClientLoader } from './loaders/client.loader'
import {
  ApiScopeResolver,
  DelegationResolver,
  DelegationScopeResolver,
  CustomDelegationResolver,
  DomainResolver,
  MergedDelegationResolver,
} from './resolvers'
import { ActorDelegationsService } from './services/actorDelegations.service'
import { DomainService } from './services/domain.service'
import { MeDelegationsService } from './services/meDelegations.service'
import { ApiScopeService } from './services/apiScope.service'

@Module({
  providers: [
    DelegationResolver,
    CustomDelegationResolver,
    MergedDelegationResolver,
    DelegationScopeResolver,
    ApiScopeResolver,
    DomainResolver,
    DomainService,
    ActorDelegationsService,
    MeDelegationsService,
    ApiScopeService,
    ApiScopeLoader,
    ClientLoader,
    DomainLoader,
    CmsModule,
  ],
  imports: [
    AuthPublicApiClientModule,
    AuthDelegationApiClientModule,
    FeatureFlagModule,
    IdentityClientModule,
  ],
})
export class AuthModule {}
