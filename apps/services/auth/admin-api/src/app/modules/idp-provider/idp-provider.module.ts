import { IdpProvider, IdpProviderService } from '@island.is/auth-api-lib'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { IdpProviderController } from './idp-provider.controller'

@Module({
  imports: [SequelizeModule.forFeature([IdpProvider])],
  controllers: [IdpProviderController],
  providers: [IdpProviderService],
})
export class IdpProviderModule {}
