import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import {
  DelegationsService,
  Delegation,
  DelegationScope,
  DelegationScopeService,
  IdentityResource,
  ApiScope,
  DELEGATIONS_AUTH_CONFIG,
} from '@island.is/auth-api-lib'
import { AuthConfig } from '@island.is/auth-nest-tools'
import { environment } from '../../../environments'
import { DelegationsController } from './delegations.controller'
import { RskModule } from '@island.is/clients/rsk/v2'
import { RskConfig } from './rsk.config'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'

const delegationAuthConfig: AuthConfig = environment.auth

@Module({
  imports: [
    SequelizeModule.forFeature([
      Delegation,
      DelegationScope,
      ApiScope,
      IdentityResource,
    ]),
    RskModule.register(RskConfig),
    NationalRegistryClientModule,
  ],
  controllers: [DelegationsController],
  providers: [
    DelegationsService,
    DelegationScopeService,
    {
      provide: DELEGATIONS_AUTH_CONFIG,
      useValue: delegationAuthConfig,
    },
  ],
})
export class DelegationsModule {}
