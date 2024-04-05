import { Sequelize } from 'sequelize-typescript'
import { getConnectionToken, getModelToken } from '@nestjs/sequelize'
import { INestApplication, Type } from '@nestjs/common'
import { TestingModuleBuilder } from '@nestjs/testing'

import { testServer, truncate, useDatabase } from '@island.is/testing/nest'
import { V2UsersApi } from '@island.is/clients/user-profile'
import { getQueueServiceToken, QueueService } from '@island.is/message-queue'
import { FeatureFlagService } from '@island.is/nest/feature-flags'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { EmailService } from '@island.is/email-service'
import { DelegationsApi } from '@island.is/clients/auth/delegation-api'

import { IS_RUNNING_AS_WORKER } from './notificationsWorker.service'
import { NotificationDispatchService } from '../notificationDispatch.service'
import { AppModule } from '../../../app.module'
import { SequelizeConfigService } from '../../../sequelizeConfig.service'
import {
  MockDelegationsService,
  MockFeatureFlagService,
  mockFullName,
  mockHnippTemplate,
  MockNationalRegistryV3ClientService,
  MockV2UsersApi,
  userWithDelegations,
  userWithDelegations2,
  userWithDocumentNotificationsDisabled,
  userWithEmailNotificationsDisabled,
  userWithFeatureFlagDisabled,
  userWithSendToDelegationsFeatureFlagDisabled,
  userWitNoDelegations,
} from './mocks'
import { wait } from './helpers'
import { Notification } from '../notification.model'
import { FIREBASE_PROVIDER } from '../../../../constants'
import { NotificationsService } from '../notifications.service'

describe('NotificationsWorkerService', () => {
  let app: INestApplication
  let sequelize: Sequelize
  let notificationDispatch: NotificationDispatchService
  let emailService: EmailService
  let queue: QueueService
  let notificationModel: typeof Notification
  let notificationsService: NotificationsService

  const insideWorkingHours = new Date(2021, 1, 1, 10, 0, 0)

  beforeAll(async () => {
    app = await testServer({
      appModule: AppModule,
      override: (builder: TestingModuleBuilder) =>
        builder
          .overrideProvider(NationalRegistryV3ClientService)
          .useClass(MockNationalRegistryV3ClientService)
          .overrideProvider(DelegationsApi)
          .useClass(MockDelegationsService)
          .overrideProvider(FeatureFlagService)
          .useClass(MockFeatureFlagService)
          .overrideProvider(V2UsersApi)
          .useClass(MockV2UsersApi)
          .overrideProvider(IS_RUNNING_AS_WORKER)
          .useValue(true)
          .overrideProvider(FIREBASE_PROVIDER)
          .useValue({}),
      hooks: [
        useDatabase({ type: 'postgres', provider: SequelizeConfigService }),
      ],
    })

    // ensure tests always work by setting time to 10 AM (working hour)
    jest.useFakeTimers({
      advanceTimers: 10,
      now: insideWorkingHours,
    })

    sequelize = await app.resolve(getConnectionToken() as Type<Sequelize>)
    notificationDispatch = app.get<NotificationDispatchService>(
      NotificationDispatchService,
    )
    emailService = app.get<EmailService>(EmailService)
    queue = app.get<QueueService>(getQueueServiceToken('notifications'))
    notificationModel = app.get(getModelToken(Notification))
    notificationsService = app.get<NotificationsService>(NotificationsService)
  })

  beforeEach(async () => {
    jest.clearAllMocks()

    jest
      .spyOn(emailService, 'sendEmail')
      .mockReturnValue(Promise.resolve('message-id'))

    jest
      .spyOn(notificationDispatch, 'sendPushNotification')
      .mockReturnValue(Promise.resolve())

    jest
      .spyOn(notificationsService, 'getTemplate')
      .mockReturnValue(Promise.resolve(mockHnippTemplate))
  })

  afterAll(async () => {
    await app.close()
  })

  afterEach(async () => {
    await truncate(sequelize)
  })

  const addToQueue = async (recipient: string) => {
    await queue.add({
      recipient,
      templateId: mockHnippTemplate.templateId,
      args: [{ key: 'organization', value: 'Test Crew' }],
    })

    // give the worker some time to process the message
    await wait(2)
  }

  it('should send email and push notification to recipient and to delegation holders', async () => {
    await addToQueue(userWithDelegations.nationalId)

    // should send email to primary recipient
    expect(emailService.sendEmail).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        to: expect.objectContaining({
          name: userWithDelegations.name,
          address: userWithDelegations.email,
        }),
      }),
    )

    // should send email to delegation recipient
    expect(emailService.sendEmail).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        to: expect.objectContaining({
          name: userWithDelegations.name, // should use the original recipient name
          address: userWitNoDelegations.email,
        }),
      }),
    )

    expect(emailService.sendEmail).toHaveBeenCalledTimes(2)

    // should only send push notification for primary recipient
    expect(notificationDispatch.sendPushNotification).toHaveBeenCalledTimes(1)
    expect(notificationDispatch.sendPushNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        nationalId: userWithDelegations.nationalId,
      }),
    )

    // should write the messages to db
    const messages = await notificationModel.findAll()
    expect(messages).toHaveLength(2)
  })

  it('should not send email or push notifications to delegation holders if recipient is a delegation holder (test correct propagation of emails to delegation holders)', async () => {
    // userWithDelegations2 -> userWithDelegations -X userWitNoDelegations
    await addToQueue(userWithDelegations2.nationalId)

    // Should not have been called 3 times if propagation is correct
    expect(emailService.sendEmail).toHaveBeenCalledTimes(2)

    // should send email to primary recipient
    expect(emailService.sendEmail).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        to: expect.objectContaining({
          name: userWithDelegations2.name,
          address: userWithDelegations2.email,
        }),
      }),
    )

    // should send email to delegation recipient
    expect(emailService.sendEmail).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        to: expect.objectContaining({
          name: userWithDelegations2.name, // should use the original recipient name
          address: userWithDelegations.email,
        }),
      }),
    )
  })

  it('should not send email or push notification if we are outside working hours (8 AM - 11 PM) ', async () => {
    const outsideWorkingHours = new Date(2021, 1, 1, 7, 59, 58) // 2 seconds before 8 AM
    jest.setSystemTime(outsideWorkingHours)

    await addToQueue(userWitNoDelegations.nationalId)

    expect(emailService.sendEmail).not.toHaveBeenCalled()
    expect(notificationDispatch.sendPushNotification).not.toHaveBeenCalled()

    await wait(2) // ensure we are at 8 AM by waiting 2 seconds

    expect(emailService.sendEmail).toHaveBeenCalledTimes(1)
    expect(notificationDispatch.sendPushNotification).toHaveBeenCalledTimes(1)

    jest.setSystemTime(insideWorkingHours) // reset time
  }, 10_000)

  it('should not send email or push notification if no profile is found for recipient', async () => {
    await addToQueue('1234567890')

    expect(emailService.sendEmail).not.toHaveBeenCalled()
    expect(notificationDispatch.sendPushNotification).not.toHaveBeenCalled()
  })

  it('should not send email if feature flag is turned off', async () => {
    await addToQueue(userWithFeatureFlagDisabled.nationalId)

    expect(emailService.sendEmail).not.toHaveBeenCalled()
    expect(notificationDispatch.sendPushNotification).toHaveBeenCalledTimes(1)
  })

  it('should not send email to delegations if feature flag is turned off', async () => {
    await addToQueue(userWithSendToDelegationsFeatureFlagDisabled.nationalId)

    expect(emailService.sendEmail).toHaveBeenCalledTimes(1)
    expect(notificationDispatch.sendPushNotification).toHaveBeenCalledTimes(1)
  })

  it('should not send email if user has email notifications disabled', async () => {
    await addToQueue(userWithEmailNotificationsDisabled.nationalId)

    expect(emailService.sendEmail).not.toHaveBeenCalled()
    expect(notificationDispatch.sendPushNotification).toHaveBeenCalledTimes(1)
  })

  it('should not send push notifications if user has document notifications disabled', async () => {
    await addToQueue(userWithDocumentNotificationsDisabled.nationalId)

    expect(emailService.sendEmail).toHaveBeenCalledTimes(1)
    expect(notificationDispatch.sendPushNotification).not.toHaveBeenCalled()
  })
})
