import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { TranslationModule } from '../translation/translation.module'
import { ClientsService } from './clients.service'
import { AdminClientsService } from './admin/admin-clients.service'
import { ClientAllowedCorsOrigin } from './models/client-allowed-cors-origin.model'
import { ClientClaim } from './models/client-claim.model'
import { ClientGrantType } from './models/client-grant-type.model'
import { ClientRedirectUri } from './models/client-redirect-uri.model'
import { ClientPostLogoutRedirectUri } from './models/client-post-logout-redirect-uri.model'
import { Client } from './models/client.model'
import { ClientAllowedScope } from './models/client-allowed-scope.model'
import { ClientIdpRestrictions } from './models/client-idp-restrictions.model'
import { ClientSecret } from './models/client-secret.model'
import { ClientsTranslationService } from './clients-translation.service'
import { Domain } from '../resources/models/domain.model'
import { ApiScope } from '../resources/models/api-scope.model'
import { AdminScopeService } from '../resources/admin/admin-scope.service'
import { ApiScopeUserClaim } from '../resources/models/api-scope-user-claim.model'
import { ApiScopeCategory } from '../resources/models/api-scope-category.model'
import { ApiScopeTag } from '../resources/models/api-scope-tag.model'
import { AdminTranslationService } from '../resources/admin/services/admin-translation.service'
import { ClientDelegationType } from './models/client-delegation-type.model'
import { DelegationTypeModel } from '../delegations/models/delegation-type.model'
import { DelegationProviderModel } from '../delegations/models/delegation-provider.model'
import { ApiScopeDelegationType } from '../resources/models/api-scope-delegation-type.model'

@Module({
  imports: [
    SequelizeModule.forFeature([
      Client,
      ClientAllowedCorsOrigin,
      ClientAllowedScope,
      ClientClaim,
      ClientGrantType,
      ClientIdpRestrictions,
      ClientPostLogoutRedirectUri,
      ClientRedirectUri,
      ClientSecret,
      ClientDelegationType,
      DelegationTypeModel,
      DelegationProviderModel,
      Domain,
      ApiScope,
      ApiScopeUserClaim,
      ApiScopeDelegationType,
      ApiScopeCategory,
      ApiScopeTag,
    ]),
    TranslationModule,
  ],
  providers: [
    ClientsService,
    AdminClientsService,
    ClientsTranslationService,
    AdminScopeService,
    AdminTranslationService,
  ],
  exports: [
    ClientsService,
    AdminClientsService,
    AdminScopeService,
    AdminTranslationService,
    SequelizeModule,
  ],
})
export class ClientsModule {}
