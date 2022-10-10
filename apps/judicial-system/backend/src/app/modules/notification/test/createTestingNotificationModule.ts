import { Test } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'
import { mock } from 'jest-mock-extended'
import { uuid } from 'uuidv4'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { EmailService } from '@island.is/email-service'
import { IntlService } from '@island.is/cms-translations'
import { createTestIntl } from '@island.is/cms-translations/test'
import { SmsService } from '@island.is/nova-sms'
import { ConfigModule, ConfigType } from '@island.is/nest/config'
import { SharedAuthModule } from '@island.is/judicial-system/auth'

import { environment } from '../../../../environments'
import { CourtService } from '../../court'
import { AwsS3Service } from '../../aws-s3'
import { EventService } from '../../event'
import { InternalNotificationController } from '../internalNotification.controller'
import { notificationModuleConfig } from '../notification.config'
import { Notification } from '../models/notification.model'
import { NotificationService } from '../notification.service'
import { NotificationController } from '../notification.controller'
import { DefendantService } from '../../defendant'

const formatMessage = createTestIntl({ onError: jest.fn(), locale: 'is-IS' })
  .formatMessage

export const createTestingNotificationModule = async () => {
  const notificationModule = await Test.createTestingModule({
    imports: [
      SharedAuthModule.register({
        jwtSecret: environment.auth.jwtSecret,
        secretToken: environment.auth.secretToken,
      }),
      ConfigModule.forRoot({ load: [notificationModuleConfig] }),
    ],
    controllers: [NotificationController, InternalNotificationController],
    providers: [
      {
        provide: CourtService,
        useValue: {
          createDocument: jest.fn(async () => {
            return
          }),
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

  return {
    defendantService: notificationModule.get<DefendantService>(
      DefendantService,
    ),
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
    internalNotificationController: notificationModule.get<InternalNotificationController>(
      InternalNotificationController,
    ),
  }
}
