import { forwardRef, Module } from '@nestjs/common'

import { CmsTranslationsModule } from '@island.is/cms-translations'
import { EmailModule } from '@island.is/email-service'
import { SmsModule } from '@island.is/nova-sms'

import {
  CaseModule,
  CourtModule,
  DefendantModule,
  EventModule,
  InstitutionModule,
  RepositoryModule,
  SubpoenaModule,
  UserModule,
} from '..'
import { AppealCaseNotificationService } from './services/appealCaseNotification/appealCaseNotification.service'
import { CaseNotificationService } from './services/caseNotification/caseNotification.service'
import { CivilClaimantNotificationService } from './services/civilClaimantNotification/civilClaimantNotification.service'
import { DefendantNotificationService } from './services/defendantNotification/defendantNotification.service'
import { IndictmentCaseNotificationService } from './services/indictmentCaseNotification/indictmentCaseNotification.service'
import { InstitutionNotificationService } from './services/institutionNotification/institutionNotification.service'
import { NotificationService } from './services/notification.service'
import { NotificationDispatchService } from './services/notificationDispatch.service'
import { SubpoenaNotificationService } from './services/subpoenaNotification/subpoenaNotification.service'
import { InternalNotificationController } from './internalNotification.controller'
import { NotificationController } from './notification.controller'

@Module({
  imports: [
    EmailModule,
    SmsModule,
    CmsTranslationsModule,
    InstitutionModule,
    UserModule,
    forwardRef(() => SubpoenaModule),
    forwardRef(() => CaseModule),
    forwardRef(() => CourtModule),
    forwardRef(() => EventModule),
    forwardRef(() => DefendantModule),
    forwardRef(() => RepositoryModule),
  ],
  controllers: [NotificationController, InternalNotificationController],
  providers: [
    AppealCaseNotificationService,
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
