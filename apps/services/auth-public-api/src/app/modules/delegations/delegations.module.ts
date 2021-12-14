import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  ApiResource,
  ApiResourceScope,
  ApiResourceSecret,
  ApiResourceUserClaim,
  ApiScope,
  ApiScopeGroup,
  ApiScopeUser,
  ApiScopeUserAccess,
  ApiScopeUserClaim,
  Delegation,
  DELEGATIONS_AUTH_CONFIG,
  DelegationScope,
  DelegationScopeService,
  DelegationsService,
  Domain,
  IdentityResource,
  IdentityResourceUserClaim,
  ResourcesService,
} from '@island.is/auth-api-lib'
import { AuthConfig } from '@island.is/auth-nest-tools'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import { RskModule } from '@island.is/clients/rsk/v2'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { ProblemModule } from '@island.is/nest/problem'

import { environment } from '../../../environments'
import { ActorDelegationsController } from './actorDelegations.controller'
import { MeDelegationsController } from './meDelegations.controller'
import { RskConfig } from './rsk.config'

const delegationAuthConfig: AuthConfig = environment.auth

@Module({
  imports: [
    SequelizeModule.forFeature([
      IdentityResource,
      IdentityResourceUserClaim,
      ApiScope,
      ApiScopeUserClaim,
      ApiResource,
      ApiResourceUserClaim,
      ApiResourceScope,
      ApiResourceSecret,
      ApiScopeUserAccess,
      ApiScopeUser,
      ApiScopeGroup,
      Domain,
      Delegation,
      DelegationScope,
    ]),
    RskModule.register(RskConfig),
    NationalRegistryClientModule,
    FeatureFlagModule,
    ProblemModule,
  ],
  controllers: [ActorDelegationsController, MeDelegationsController],
  providers: [
    DelegationsService,
    DelegationScopeService,
    ResourcesService,
    {
      provide: DELEGATIONS_AUTH_CONFIG,
      useValue: delegationAuthConfig,
    },
  ],
})
export class DelegationsModule {}
