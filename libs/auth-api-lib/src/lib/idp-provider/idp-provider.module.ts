import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { IdpProviderService } from './idp-provider.service'
import { IdpProvider } from './models/idp-provider.model'

@Module({
  imports: [SequelizeModule.forFeature([IdpProvider])],
  providers: [IdpProviderService],
  exports: [IdpProviderService],
})
export class IdpProviderModule {}
