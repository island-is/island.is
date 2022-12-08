import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import { RskProcuringClientModule } from '@island.is/clients/rsk/procuring'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

import { ClientAllowedScope } from '../clients/models/client-allowed-scope.model'
import { Client } from '../clients/models/client.model'
import { PersonalRepresentativeModule } from '../personal-representative/personal-representative.module'
import { ApiScope } from '../resources/models/api-scope.model'
import { IdentityResource } from '../resources/models/identity-resource.model'
import { ResourcesModule } from '../resources/resources.module'
import { DelegationScopeService } from './delegation-scope.service'
import { DelegationsOutgoingService } from './delegations-outgoing.service'
import { DelegationsService } from './delegations.service'
import { DelegationsIncomingService } from './delegations-incoming.service'
import { DelegationScope } from './models/delegation-scope.model'
import { Delegation } from './models/delegation.model'
import { NamesService } from './names.service'
import { DelegationsIncomingWardService } from './delegations-incoming-ward.service'
import { IncomingDelegationsCompanyService } from './delegations-incoming-company.service'
import { DelegationsIncomingCustomService } from './delegations-incoming-custom.service'
import { DelegationsIncomingRepresentativeService } from './delegations-incoming-representative.service'

@Module({
  imports: [
    ResourcesModule,
    PersonalRepresentativeModule,
    NationalRegistryClientModule,
    RskProcuringClientModule,
    FeatureFlagModule,
    SequelizeModule.forFeature([
      ApiScope,
      IdentityResource,
      Delegation,
      DelegationScope,
      Client,
      ClientAllowedScope,
    ]),
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
  ],
  exports: [
    DelegationsService,
    DelegationsOutgoingService,
    DelegationsIncomingService,
    DelegationScopeService,
  ],
})
export class DelegationsModule {}
