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

import { SharedAuthModule } from '@island.is/judicial-system/auth'
import { MessageService } from '@island.is/judicial-system/message'

import { environment } from '../../../../environments'
import { awsS3ModuleConfig, AwsS3Service } from '../../aws-s3'
import { CourtService } from '../../court'
import { DefendantService } from '../../defendant'
import { eventModuleConfig, EventService } from '../../event'
import { InternalNotificationController } from '../internalNotification.controller'
import { Notification } from '../models/notification.model'
import { notificationModuleConfig } from '../notification.config'
import { NotificationController } from '../notification.controller'
import { NotificationService } from '../notification.service'

jest.mock('@island.is/judicial-system/message')

const formatMessage = createTestIntl({
  onError: jest.fn(),
  locale: 'is-IS',
}).formatMessage

export const createTestingNotificationModule = async () => {
  const notificationModule = await Test.createTestingModule({
    imports: [
      SharedAuthModule.register({
        jwtSecret: environment.auth.jwtSecret,
        secretToken: environment.auth.secretToken,
      }),
      ConfigModule.forRoot({
        load: [awsS3ModuleConfig, eventModuleConfig, notificationModuleConfig],
      }),
    ],
    controllers: [NotificationController, InternalNotificationController],
    providers: [
      MessageService,
      {
        provide: CourtService,
        useValue: {
          createDocument: jest.fn(),
        },
      },
      AwsS3Service,
      {
        provide: SmsService,
        useValue: { sendSms: jest.fn(async () => uuid()) },
      },
      {
        provide: EmailService,
        useValue: { sendEmail: jest.fn(async () => uuid()) },
      },
      EventService,
      {
        provide: IntlService,
        useValue: {
          useIntl: async () => ({ formatMessage }),
        },
      },
      {
        provide: LOGGER_PROVIDER,
        useValue: {
          debug: jest.fn(),
          info: jest.fn(),
          error: jest.fn(),
        },
      },
      {
        provide: getModelToken(Notification),
        useValue: {
          create: jest.fn(),
          findOne: jest.fn(),
          findAll: jest.fn(),
          update: jest.fn(),
        },
      },
      NotificationService,
      {
        provide: DefendantService,
        useValue: {
          isDefendantInActiveCustody: jest.fn(),
        },
      },
    ],
  })
    .useMocker((token) => {
      if (typeof token === 'function') {
        return mock()
      }
    })
    .overrideProvider(LOGGER_PROVIDER)
    .useValue({
      debug: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
    })
    .compile()

  const context = {
    messageService: notificationModule.get<MessageService>(MessageService),
    defendantService:
      notificationModule.get<DefendantService>(DefendantService),
    emailService: notificationModule.get<EmailService>(EmailService),
    smsService: notificationModule.get<SmsService>(SmsService),
    courtService: notificationModule.get<CourtService>(CourtService),
    notificationConfig: notificationModule.get<
      ConfigType<typeof notificationModuleConfig>
    >(notificationModuleConfig.KEY),
    notificationModel: notificationModule.get<typeof Notification>(
      getModelToken(Notification),
    ),
    notificationController: notificationModule.get<NotificationController>(
      NotificationController,
    ),
    internalNotificationController:
      notificationModule.get<InternalNotificationController>(
        InternalNotificationController,
      ),
  }

  notificationModule.close()

  return context
}
