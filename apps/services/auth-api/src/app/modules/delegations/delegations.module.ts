import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  ApiScope,
  Delegation,
  DELEGATIONS_AUTH_CONFIG,
  DelegationScope,
  DelegationScopeService,
  DelegationsService,
  IdentityResource,
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

import { environment } from '../../../environments'

import { DelegationsController } from './delegations.controller'

const delegationAuthConfig: AuthConfig = environment.auth

@Module({
  imports: [
    SequelizeModule.forFeature([
      Delegation,
      DelegationScope,
      ApiScope,
      IdentityResource,
      PersonalRepresentative,
      PersonalRepresentativeType,
      PersonalRepresentativeRight,
      PersonalRepresentativeRightType,
      PersonalRepresentativeScopePermission,
    ]),
    RskProcuringClientModule,
    NationalRegistryClientModule,
    FeatureFlagModule,
  ],
  controllers: [DelegationsController],
  providers: [
    DelegationsService,
    DelegationScopeService,
    PersonalRepresentativeService,
    {
      provide: DELEGATIONS_AUTH_CONFIG,
      useValue: delegationAuthConfig,
    },
  ],
})
export class DelegationsModule {}
