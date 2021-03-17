import { DataSourceConfig } from 'apollo-datasource'

import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { SmsModule } from '@island.is/nova-sms'
import { EmailModule } from '@island.is/email-service'

import { environment } from '../../../environments'
import { UserModule } from '../user'
import { CaseModule } from '../case'
import { Notification } from './models'
import { NotificationService } from './notification.service'
import { NotificationController } from './notification.controller'

@Module({
  imports: [
    EmailModule.register(environment.emailOptions),
    SmsModule.register(environment.smsOptions),
    UserModule,
    CaseModule,
    SequelizeModule.forFeature([Notification]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
