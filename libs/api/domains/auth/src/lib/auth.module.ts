import { Module } from '@nestjs/common'

import { AuthDelegationApiClientModule } from '@island.is/clients/auth/delegation-api'
import { AuthIdsApiClientModule } from '@island.is/clients/auth/ids-api'
import { AuthPublicApiClientModule } from '@island.is/clients/auth/public-api'
import { IdentityClientModule } from '@island.is/clients/identity'
import { CmsModule } from '@island.is/cms'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

import { ApiScopeLoader } from './loaders/apiScope.loader'
import { ClientLoader } from './loaders/client.loader'
import { DomainLoader } from './loaders/domain.loader'
import {
  ApiScopeResolver,
  ClientResolver,
  ConsentResolver,
  CustomDelegationResolver,
  DelegationResolver,
  DelegationScopeResolver,
  DomainResolver,
  MergedDelegationResolver,
} from './resolvers'
import { ConsentTenantsResolver } from './resolvers/consentTenants.resolver'
import { ActorDelegationsService } from './services/actorDelegations.service'
import { ApiScopeService } from './services/apiScope.service'
import { ClientsService } from './services/clients.service'
import { ConsentService } from './services/consent.service'
import { ConsentTenantsService } from './services/consentTenants.service'
import { DomainService } from './services/domain.service'
import { MeDelegationsService } from './services/meDelegations.service'

@Module({
  providers: [
    DelegationResolver,
    CustomDelegationResolver,
    MergedDelegationResolver,
    DelegationScopeResolver,
    ApiScopeResolver,
    DomainResolver,
    ClientResolver,
    DomainService,
    ActorDelegationsService,
    MeDelegationsService,
    ApiScopeService,
    ApiScopeLoader,
    ClientLoader,
    DomainLoader,
    CmsModule,
    ClientsService,
    ConsentResolver,
    ConsentService,
    ConsentTenantsResolver,
    ConsentTenantsService,
  ],
  imports: [
    AuthPublicApiClientModule,
    AuthDelegationApiClientModule,
    FeatureFlagModule,
    IdentityClientModule,
    AuthIdsApiClientModule,
  ],
})
export class AuthModule {}
