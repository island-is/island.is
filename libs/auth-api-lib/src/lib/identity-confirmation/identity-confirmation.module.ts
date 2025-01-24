import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { ZendeskModule, ZendeskServiceConfig } from '@island.is/clients/zendesk'
import { IdentityConfirmationService } from './identity-confirmation.service'
import { IdentityConfirmation } from './models/Identity-Confirmation.model'

@Module({
  imports: [
    ZendeskModule,
    SequelizeModule.forFeature([IdentityConfirmation]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ZendeskServiceConfig],
      envFilePath: ['.env', '.env.secret'],
    }),
  ],
  providers: [IdentityConfirmationService],
  exports: [IdentityConfirmationService],
})
export class IdentityConfirmationModule {}
