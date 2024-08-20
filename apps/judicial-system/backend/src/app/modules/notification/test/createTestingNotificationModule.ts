import { mock } from 'jest-mock-extended'
import { uuid } from 'uuidv4'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { IntlService } from '@island.is/cms-translations'
import { createTestIntl } from '@island.is/cms-translations/test'
import { EmailService } from '@island.is/email-service'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule, ConfigType } from '@island.is/nest/config'
import { SmsService } from '@island.is/nova-sms'

import {
  SharedAuthModule,
  sharedAuthModuleConfig,
} from '@island.is/judicial-system/auth'
import { MessageService } from '@island.is/judicial-system/message'

import { awsS3ModuleConfig, AwsS3Service } from '../../aws-s3'
import { InternalCaseService } from '../../case'
import { CourtService } from '../../court'
import { DefendantService } from '../../defendant'
import { eventModuleConfig, EventService } from '../../event'
import { InstitutionService } from '../../institution'
import { UserService } from '../../user'
import { InstitutionNotificationService } from '../institutionNotification.service'
import { InternalNotificationController } from '../internalNotification.controller'
import { InternalNotificationService } from '../internalNotification.service'
import { Notification } from '../models/notification.model'
import { notificationModuleConfig } from '../notification.config'
import { NotificationController } from '../notification.controller'
import { NotificationService } from '../notification.service'
import { NotificationDispatchService } from '../notificationDispatch.service'

jest.mock('@island.is/judicial-system/message')

const formatMessage = createTestIntl({
  onError: jest.fn(),
  locale: 'is-IS',
}).formatMessage

export const createTestingNotificationModule = async () => {
  const notificationModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        load: [
          sharedAuthModuleConfig,
          awsS3ModuleConfig,
          eventModuleConfig,
          notificationModuleConfig,
        ],
      }),
    ],
    controllers: [NotificationController, InternalNotificationController],
    providers: [
      SharedAuthModule,
      MessageService,
      { provide: CourtService, useValue: { createDocument: jest.fn() } },
      AwsS3Service,
      {
        provide: SmsService,
        useValue: { sendSms: jest.fn(async () => uuid()) },
      },
      {
        provide: EmailService,
        useValue: { sendEmail: jest.fn(async () => uuid()) },
      },
      {
        provide: IntlService,
        useValue: { useIntl: async () => ({ formatMessage }) },
      },
      {
        provide: InternalCaseService,
        useValue: {
          countIndictmentsWaitingForConfirmation: jest.fn(),
        },
      },
      {
        provide: UserService,
        useValue: {
          getUsersWhoCanConfirmIndictments: jest.fn(),
        },
      },
      {
        provide: LOGGER_PROVIDER,
        useValue: {
          debug: jest.fn(),
          info: jest.fn(),
          warn: jest.fn(),
          error: jest.fn(),
        },
      },
      { provide: getModelToken(Notification), useValue: { create: jest.fn() } },
      {
        provide: DefendantService,
        useValue: { isDefendantInActiveCustody: jest.fn() },
      },
      { provide: InstitutionService, useValue: { getAll: jest.fn() } },
      EventService,
      NotificationService,
      InternalNotificationService,
      NotificationDispatchService,
      InstitutionNotificationService,
    ],
  })
    .useMocker((token) => {
      if (typeof token === 'function') {
        return mock()
      }
    })
    .compile()

  const context = {
    userService: notificationModule.get(UserService),
    internalCaseService: notificationModule.get(InternalCaseService),
    messageService: notificationModule.get(MessageService),
    defendantService: notificationModule.get(DefendantService),
    emailService: notificationModule.get(EmailService),
    smsService: notificationModule.get(SmsService),
    courtService: notificationModule.get(CourtService),
    institutionService: notificationModule.get(InstitutionService),
    notificationConfig: notificationModule.get<
      ConfigType<typeof notificationModuleConfig>
    >(notificationModuleConfig.KEY),
    notificationModel: notificationModule.get<typeof Notification>(
      getModelToken(Notification),
    ),
    notificationController: notificationModule.get(NotificationController),
    internalNotificationController: notificationModule.get(
      InternalNotificationController,
    ),
  }

  notificationModule.close()

  return context
}
