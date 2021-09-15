import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import {
  DelegationsService,
  Delegation,
  DelegationScopeService,
  DelegationScope,
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
  ResourcesService,
  DELEGATIONS_AUTH_CONFIG,
} from '@island.is/auth-api-lib'
import { AuthConfig } from '@island.is/auth-nest-tools'
import { environment } from '../../../environments'
import { DelegationsController } from './delegations.controller'
import { RskModule } from '@island.is/clients/rsk/v2'
import { RskConfig } from './rsk.config'
import { NationalRegistryModule } from '@island.is/clients/national-registry-v2'
import { NationalRegistryConfig } from './national-registry.config'

const delegationAuthConfig: AuthConfig = environment.auth

@Module({
  imports: [
    SequelizeModule.forFeature([
      Delegation,
      DelegationScope,
      ApiScope,
      IdentityResource,
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
    ]),
    RskModule.register(RskConfig),
    NationalRegistryModule.register(NationalRegistryConfig),
  ],
  controllers: [DelegationsController],
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
