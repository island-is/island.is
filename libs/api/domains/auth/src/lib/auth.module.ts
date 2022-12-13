import { Module } from '@nestjs/common'

import { IdentityClientModule } from '@island.is/clients/identity'

import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { AuthDelegationApiClientModule } from '@island.is/clients/auth/delegation-api'
import { AuthPublicApiClientModule } from '@island.is/clients/auth/public-api'
import { ActorDelegationsService } from './services/actorDelegations.service'
import { ApiScopeServiceV1 } from './services-v1/apiScope.service'
import { ApiScopeServiceV2 } from './services-v2/apiScope.service'
import { DomainService } from './services/domain.service'
import { MeDelegationsServiceV1 } from './services-v1/meDelegations.service'
import { MeDelegationsServiceV2 } from './services-v2/meDelegations.service'
import {
  ApiScopeResolver,
  DelegationResolver,
  DelegationScopeResolver,
  CustomDelegationResolver,
  DomainResolver,
  MergedDelegationResolver,
} from './resolvers'
import { MeDelegationsService } from './services/meDelegations.service'
import { ApiScopeService } from './services/apiScope.service'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { DataLoaderInterceptor } from '@island.is/nest/dataloader'
import { DomainLoader } from './loaders/domain.loader'
import { ApiScopeLoader } from './loaders/apiScope.loader'
import { CmsModule } from '@island.is/cms'

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
    MeDelegationsServiceV1,
    MeDelegationsServiceV2,
    ApiScopeService,
    ApiScopeServiceV1,
    ApiScopeServiceV2,
    ApiScopeLoader,
    DomainLoader,
    CmsModule,
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
  ],
  imports: [
    AuthPublicApiClientModule,
    AuthDelegationApiClientModule,
    FeatureFlagModule,
    IdentityClientModule,
  ],
})
export class AuthModule {}
