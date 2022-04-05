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
  Client,
  ClientAllowedCorsOrigin,
  ClientAllowedScope,
  ClientClaim,
  ClientGrantType,
  ClientIdpRestrictions,
  ClientPostLogoutRedirectUri,
  ClientRedirectUri,
  ClientSecret,
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
import {
  PersonalRepresentative,
  PersonalRepresentativeRight,
  PersonalRepresentativeRightType,
  PersonalRepresentativeScopePermission,
  PersonalRepresentativeService,
  PersonalRepresentativeType,
} from '@island.is/auth-api-lib/personal-representative'
import { AuthConfig } from '@island.is/auth-nest-tools'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import { RskProcuringClientModule } from '@island.is/clients/rsk/procuring'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { ProblemModule } from '@island.is/nest/problem'

import { environment } from '../../../environments'
import { ActorDelegationsController } from './actorDelegations.controller'
import { MeDelegationsController } from './meDelegations.controller'

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
      Client,
      ClientAllowedCorsOrigin,
      ClientAllowedScope,
      ClientClaim,
      ClientGrantType,
      ClientIdpRestrictions,
      ClientPostLogoutRedirectUri,
      ClientRedirectUri,
      ClientSecret,
      Domain,
      Delegation,
      DelegationScope,
      PersonalRepresentative,
      PersonalRepresentativeType,
      PersonalRepresentativeRight,
      PersonalRepresentativeRightType,
      PersonalRepresentativeScopePermission,
    ]),
    RskProcuringClientModule,
    NationalRegistryClientModule,
    FeatureFlagModule,
    ProblemModule,
  ],
  controllers: [ActorDelegationsController, MeDelegationsController],
  providers: [
    DelegationsService,
    DelegationScopeService,
    ResourcesService,
    PersonalRepresentativeService,
    {
      provide: DELEGATIONS_AUTH_CONFIG,
      useValue: delegationAuthConfig,
    },
  ],
})
export class DelegationsModule {}
