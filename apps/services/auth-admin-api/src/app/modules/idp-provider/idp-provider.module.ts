import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  AccessService,
  ApiScopeUser,
  ApiScopeUserAccess,
  IdpProvider,
  IdpProviderService,
} from '@island.is/auth-api-lib'

import { IdpProviderController } from './idp-provider.controller'

@Module({
  imports: [
    SequelizeModule.forFeature([IdpProvider, ApiScopeUserAccess, ApiScopeUser]),
  ],
  controllers: [IdpProviderController],
  providers: [IdpProviderService, AccessService],
})
export class IdpProviderModule {}
