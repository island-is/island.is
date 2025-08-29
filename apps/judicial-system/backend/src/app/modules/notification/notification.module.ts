import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { CmsTranslationsModule } from '@island.is/cms-translations'
import { EmailModule } from '@island.is/email-service'
import { SmsModule } from '@island.is/nova-sms'

import { MessageModule } from '@island.is/judicial-system/message'

import {
  CaseModule,
  CourtModule,
  DefendantModule,
  EventModule,
  InstitutionModule,
  SubpoenaModule,
  UserModule,
} from '../index'
import { Notification } from '../repository'
import { CaseNotificationService } from './services/caseNotification/caseNotification.service'
import { CivilClaimantNotificationService } from './services/civilClaimantNotification/civilClaimantNotification.service'
import { DefendantNotificationService } from './services/defendantNotification/defendantNotification.service'
import { IndictmentCaseNotificationService } from './services/indictmentCaseNotification/indictmentCaseNotification.service'
import { InstitutionNotificationService } from './services/institutionNotification/institutionNotification.service'
import { SubpoenaNotificationService } from './services/subpoenaNotification/subpoenaNotification.service'
import { InternalNotificationController } from './internalNotification.controller'
import { NotificationController } from './notification.controller'
import { NotificationService } from './notification.service'
import { NotificationDispatchService } from './notificationDispatch.service'

@Module({
  imports: [
    EmailModule,
    SmsModule,
    CmsTranslationsModule,
    MessageModule,
    InstitutionModule,
    UserModule,
    forwardRef(() => SubpoenaModule),
    forwardRef(() => CaseModule),
    forwardRef(() => CourtModule),
    forwardRef(() => EventModule),
    forwardRef(() => DefendantModule),
    SequelizeModule.forFeature([Notification]),
  ],
  controllers: [NotificationController, InternalNotificationController],
  providers: [
    CaseNotificationService,
    CivilClaimantNotificationService,
    DefendantNotificationService,
    IndictmentCaseNotificationService,
    InstitutionNotificationService,
    NotificationService,
    NotificationDispatchService,
    SubpoenaNotificationService,
  ],
})
export class NotificationModule {}
