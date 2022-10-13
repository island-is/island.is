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
import { DelegationsService } from './delegations.service'
import { DelegationScopeService } from './delegationScope.service'
import { DelegationScope } from './models/delegation-scope.model'
import { Delegation } from './models/delegation.model'
import { DelegationsOutgoingService } from './delegationsOutgoing.service'

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
    DelegationScopeService,
  ],
  exports: [
    DelegationsService,
    DelegationsOutgoingService,
    DelegationScopeService,
  ],
})
export class DelegationsModule {}
