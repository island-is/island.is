import {
  IdpProvider,
  IdpProviderService,
  AccessService,
  ApiScopeUserAccess,
  ApiScopeUser,
} from '@island.is/auth-api-lib'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { IdpProviderController } from './idp-provider.controller'

@Module({
  imports: [
    SequelizeModule.forFeature([IdpProvider, ApiScopeUserAccess, ApiScopeUser]),
  ],
  controllers: [IdpProviderController],
  providers: [IdpProviderService, AccessService],
})
export class IdpProviderModule {}
