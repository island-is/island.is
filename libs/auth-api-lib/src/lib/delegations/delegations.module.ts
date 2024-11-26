import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { RskRelationshipsClientModule } from '@island.is/clients-rsk-relationships'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import { CompanyRegistryClientModule } from '@island.is/clients/rsk/company-registry'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { ZendeskModule } from '@island.is/clients/zendesk'

import { ClientAllowedScope } from '../clients/models/client-allowed-scope.model'
import { Client } from '../clients/models/client.model'
import { PersonalRepresentativeModule } from '../personal-representative/personal-representative.module'
import { ApiScopeDelegationType } from '../resources/models/api-scope-delegation-type.model'
import { ApiScopeUserAccess } from '../resources/models/api-scope-user-access.model'
import { ApiScope } from '../resources/models/api-scope.model'
import { IdentityResource } from '../resources/models/identity-resource.model'
import { ResourcesModule } from '../resources/resources.module'
import { UserIdentitiesModule } from '../user-identities/user-identities.module'
import { UserSystemNotificationModule } from '../user-notification'
import { DelegationAdminCustomService } from './admin/delegation-admin-custom.service'
import { DelegationProviderService } from './delegation-provider.service'
import { DelegationScopeService } from './delegation-scope.service'
import { IncomingDelegationsCompanyService } from './delegations-incoming-company.service'
import { DelegationsIncomingCustomService } from './delegations-incoming-custom.service'
import { DelegationsIncomingRepresentativeService } from './delegations-incoming-representative.service'
import { DelegationsIncomingWardService } from './delegations-incoming-ward.service'
import { DelegationsIncomingService } from './delegations-incoming.service'
import { DelegationsIndexService } from './delegations-index.service'
import { DelegationsOutgoingService } from './delegations-outgoing.service'
import { DelegationsService } from './delegations.service'
import { DelegationDelegationType } from './models/delegation-delegation-type.model'
import { DelegationIndexMeta } from './models/delegation-index-meta.model'
import { DelegationIndex } from './models/delegation-index.model'
import { DelegationProviderModel } from './models/delegation-provider.model'
import { DelegationScope } from './models/delegation-scope.model'
import { DelegationTypeModel } from './models/delegation-type.model'
import { Delegation } from './models/delegation.model'
import { NamesService } from './names.service'

@Module({
  imports: [
    ResourcesModule,
    PersonalRepresentativeModule,
    NationalRegistryClientModule,
    RskRelationshipsClientModule,
    CompanyRegistryClientModule,
    ZendeskModule,
    UserIdentitiesModule,
    FeatureFlagModule,
    SequelizeModule.forFeature([
      ApiScope,
      ApiScopeDelegationType,
      IdentityResource,
      Delegation,
      DelegationScope,
      DelegationIndex,
      DelegationIndexMeta,
      Client,
      ClientAllowedScope,
      ApiScopeUserAccess,
      DelegationTypeModel,
      DelegationProviderModel,
      DelegationDelegationType,
    ]),
    UserSystemNotificationModule,
    SyslumennClientModule,
  ],
  providers: [
    DelegationsService,
    DelegationsOutgoingService,
    DelegationsIncomingService,
    DelegationScopeService,
    NamesService,
    DelegationsIncomingWardService,
    IncomingDelegationsCompanyService,
    DelegationsIncomingCustomService,
    DelegationsIncomingRepresentativeService,
    DelegationsIndexService,
    DelegationProviderService,
    DelegationAdminCustomService,
  ],
  exports: [
    DelegationsService,
    DelegationsOutgoingService,
    DelegationsIncomingService,
    DelegationScopeService,
    DelegationsIndexService,
    DelegationProviderService,
    DelegationAdminCustomService,
  ],
})
export class DelegationsModule {}
