import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'

import { SmsModule, smsModuleConfig } from '@island.is/nova-sms'
import { ZendeskModule, ZendeskServiceConfig } from '@island.is/clients/zendesk'

import { IdentityConfirmationService } from './identity-confirmation.service'
import { IdentityConfirmation } from './models/Identity-Confirmation.model'
import { XRoadConfig } from '@island.is/nest/config'

@Module({
  imports: [
    ZendeskModule,
    SmsModule,
    SequelizeModule.forFeature([IdentityConfirmation]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [XRoadConfig, ZendeskServiceConfig, smsModuleConfig],
      envFilePath: ['.env', '.env.secret'],
    }),
  ],
  providers: [IdentityConfirmationService],
  exports: [IdentityConfirmationService],
})
export class IdentityConfirmationModule {}
