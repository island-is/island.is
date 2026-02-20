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

import { ActorDelegationsService } from './services/actorDelegations.service'
import { ApiScopeService } from './services/apiScope.service'
import { ClientsService } from './services/clients.service'
import { ConsentService } from './services/consent.service'
import { ConsentTenantsService } from './services/consentTenants.service'
import { DomainService } from './services/domain.service'
import { MeDelegationsService } from './services/meDelegations.service'
import { LoginRestrictionResolver } from './resolvers/loginRestriction.resolver'
import { LoginRestrictionService } from './services/loginRestriction.service'
import { ConsentTenantsResolver } from './resolvers/consentTenants.resolver'
import { DelegationResolver } from './resolvers/delegation.resolver'
import { CustomDelegationResolver } from './resolvers/customDelegation.resolver'
import { MergedDelegationResolver } from './resolvers/mergedDelegation.resolver'
import { DelegationScopeResolver } from './resolvers/delegationScope.resolver'
import { ApiScopeResolver } from './resolvers/apiScope.resolver'
import { DomainResolver } from './resolvers/domain.resolver'
import { ClientResolver } from './resolvers/client.resolver'
import { ConsentResolver } from './resolvers/consent.resolver'
import { PasskeyResolver } from './resolvers/passkey.resolver'
import { PasskeyService } from './services/passkey.service'
import { ScopeCategoriesResolver } from './resolvers/scopeCategories.resolver'

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
    ClientsService,
    ConsentResolver,
    ConsentService,
    ConsentTenantsResolver,
    ConsentTenantsService,
    LoginRestrictionResolver,
    LoginRestrictionService,
    PasskeyService,
    PasskeyResolver,
    ScopeCategoriesResolver,
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
