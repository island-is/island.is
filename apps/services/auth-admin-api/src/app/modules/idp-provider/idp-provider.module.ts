import {
  IdpProvider,
  IdpProviderService,
  AccessService,
  AdminAccess,
} from '@island.is/auth-api-lib'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { IdpProviderController } from './idp-provider.controller'

@Module({
  imports: [SequelizeModule.forFeature([IdpProvider, AdminAccess])],
  controllers: [IdpProviderController],
  providers: [IdpProviderService, AccessService],
})
export class IdpProviderModule {}
