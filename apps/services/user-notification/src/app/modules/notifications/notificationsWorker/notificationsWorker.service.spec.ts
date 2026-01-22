import { INestApplication, Type } from '@nestjs/common'
import { getConnectionToken, getModelToken } from '@nestjs/sequelize'
import { TestingModuleBuilder } from '@nestjs/testing'
import { Sequelize } from 'sequelize-typescript'
import { randomUUID } from 'crypto'

import {
  DelegationsApi,
  DelegationRecordDTO,
} from '@island.is/clients/auth/delegation-api'
import { CmsService } from '@island.is/clients/cms'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import {
  CompanyExtendedInfo,
  CompanyRegistryClientService,
} from '@island.is/clients/rsk/company-registry'
import { UserProfileDto, V2UsersApi } from '@island.is/clients/user-profile'
import { AuthDelegationType } from '@island.is/shared/types'
import { createNationalId } from '@island.is/testing/fixtures'
import { EmailService } from '@island.is/email-service'
import { QueueService, getQueueServiceToken } from '@island.is/message-queue'
import { FeatureFlagService } from '@island.is/nest/feature-flags'
import { testServer, truncate, useDatabase } from '@island.is/testing/nest'

import { UserNotificationsConfig } from '../../../../config'
import { FIREBASE_PROVIDER } from '../../../../constants'
import { AppModule } from '../../../app.module'
import { SequelizeConfigService } from '../../../sequelizeConfig.service'
import { Notification } from '../notification.model'
import { ActorNotification } from '../actor-notification.model'
import { NotificationDispatchService } from '../notificationDispatch.service'
import { NotificationsService } from '../notifications.service'
import { InternalCreateHnippNotificationDto } from '../dto/createHnippNotification.dto'
import { wait } from './helpers'
import {
  MockDelegationsService,
  MockFeatureFlagService,
  MockNationalRegistryV3ClientService,
  MockUserNotificationsConfig,
  companyUser,
  delegationSubjectId,
  getMockHnippTemplate,
  mockTemplateId,
  userProfiles,
  userWithDelegations,
  userWithDelegations2,
  userWithDocumentNotificationsDisabled,
  userWithEmailNotificationsDisabled,
  userWithFeatureFlagDisabled,
  userWithNoDelegations,
  userWithNoEmail,
  userWithSendToDelegationsFeatureFlagDisabled,
} from './mocks'
import { NotificationsWorkerService } from './notificationsWorker.service'

const workingHoursDelta = 1000 * 60 * 60 // 1 hour
const insideWorkingHours = new Date(2021, 1, 1, 9, 0, 0)
const outsideWorkingHours = new Date(2021, 1, 1, 7, 0, 0)

export const MockV2UsersApi = {
  userProfileControllerFindUserProfile: jest.fn(
    ({ xParamNationalId }: { xParamNationalId: string }) => {
      return Promise.resolve(
        userProfiles.find(
          (u) => u.nationalId === xParamNationalId,
        ) as UserProfileDto,
      )
    },
  ),

  userProfileControllerGetActorProfile: jest.fn(
    ({ xParamToNationalId }: { xParamToNationalId: string }) => {
      return Promise.resolve(
        userProfiles.find(
          (u) => u.nationalId === xParamToNationalId,
        ) as UserProfileDto,
      )
    },
  ),
}
const mockContentfulGraphQLClientService = {
  fetchData: jest.fn(),
}
describe('NotificationsWorkerService', () => {
  let app: INestApplication
  let sequelize: Sequelize
  let notificationDispatch: NotificationDispatchService
  let emailService: EmailService
  let queue: QueueService
  let notificationModel: typeof Notification
  let actorNotificationModel: typeof ActorNotification
  let notificationsService: NotificationsService
  let notificationsWorkerService: NotificationsWorkerService
  let userProfileApi: V2UsersApi
  let nationalRegistryService: NationalRegistryV3ClientService
  let companyRegistryService: CompanyRegistryClientService

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
          .useValue(MockV2UsersApi)
          .overrideProvider(UserNotificationsConfig.KEY)
          .useValue(MockUserNotificationsConfig)
          .overrideProvider(FIREBASE_PROVIDER)
          .useValue({})
          .overrideProvider(CmsService)
          .useValue(mockContentfulGraphQLClientService),
      hooks: [
        useDatabase({ type: 'postgres', provider: SequelizeConfigService }),
      ],
    })

    sequelize = await app.resolve(getConnectionToken() as Type<Sequelize>)
    notificationDispatch = app.get(NotificationDispatchService)
    emailService = app.get(EmailService)
    queue = app.get(getQueueServiceToken('notifications'))
    notificationModel = app.get(getModelToken(Notification))
    actorNotificationModel = app.get(getModelToken(ActorNotification))
    notificationsService = app.get(NotificationsService)
    userProfileApi = app.get(V2UsersApi)
    nationalRegistryService = app.get(NationalRegistryV3ClientService)
    companyRegistryService = app.get(CompanyRegistryClientService)

    notificationsWorkerService = await app.resolve(NotificationsWorkerService)
    notificationsWorkerService.run()
  })

  beforeEach(async () => {
    // ensure tests always work by setting time to 10 AM (working hour)
    jest.useFakeTimers({
      advanceTimers: true,
      now: insideWorkingHours,
    })

    jest.clearAllMocks()

    jest
      .spyOn(emailService, 'sendEmail')
      .mockReturnValue(Promise.resolve('message-id'))

    jest
      .spyOn(notificationDispatch, 'sendPushNotification')
      .mockReturnValue(Promise.resolve())

    jest
      .spyOn(notificationsService, 'getTemplate')
      .mockReturnValue(Promise.resolve(getMockHnippTemplate({})))
    jest.spyOn(notificationsWorkerService, 'createEmail')

    jest.spyOn(nationalRegistryService, 'getName')

    jest.spyOn(companyRegistryService, 'getCompany').mockReturnValue(
      Promise.resolve<CompanyExtendedInfo>({
        nationalId: '1234567890',
        name: 'Test Company',
        formOfOperation: [],
        addresses: [],
        relatedParty: [],
        vat: [],
        status: 'somestatus',
      }),
    )
  })

  afterEach(async () => {
    await truncate(sequelize)
  })

  const addToQueue = async (recipient: string) => {
    await queue.add({
      recipient,
      templateId: mockTemplateId,
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
        // email body should have a call-to-action button
        template: expect.objectContaining({
          body: expect.arrayContaining([
            expect.objectContaining({
              component: 'ImageWithLink',
              context: expect.objectContaining({
                href: 'https://island.is/minarsidur/postholf',
              }),
            }),
          ]),
        }),
      }),
    )

    // should send email to delegation recipient
    expect(emailService.sendEmail).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        to: expect.objectContaining({
          name: userWithDelegations.name, // should use the original recipient name
          address: userWithNoDelegations.email,
        }),
        // should not have 3rd party login - because subjectId is null for the delegation between userWithDelegations and userWitNoDelegations
        template: expect.objectContaining({
          body: expect.arrayContaining([
            expect.objectContaining({
              component: 'ImageWithLink',
              context: expect.objectContaining({
                href: 'https://island.is/minarsidur/postholf',
              }),
            }),
          ]),
        }),
      }),
    )

    expect(emailService.sendEmail).toHaveBeenCalledTimes(2)

    // should write only the primary recipient message to db (delegation notifications are not saved)
    const messages = await notificationModel.findAll()
    const recipientMessage = messages.find(
      (message) => message.recipient === userWithDelegations.nationalId,
    )
    expect(messages).toHaveLength(1)
    expect(recipientMessage).toBeDefined()

    // should only send push notification for primary recipient
    expect(notificationDispatch.sendPushNotification).toHaveBeenCalledTimes(1)
    expect(notificationDispatch.sendPushNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        nationalId: userWithDelegations.nationalId,
        notificationId: recipientMessage?.id,
      }),
    )

    // should have gotten user profile for primary recipient
    expect(
      userProfileApi.userProfileControllerFindUserProfile,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        xParamNationalId: userWithDelegations.nationalId,
      }),
    )

    // should have gotten actor profile for delegation holder
    expect(
      userProfileApi.userProfileControllerGetActorProfile,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        xParamToNationalId: userWithNoDelegations.nationalId,
      }),
    )
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
        template: expect.objectContaining({
          body: expect.arrayContaining([
            expect.objectContaining({
              component: 'ImageWithLink',
              context: expect.objectContaining({
                href: 'https://island.is/minarsidur/postholf',
              }),
            }),
          ]),
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
        // should use 3rd party login - because subjectId is not null for the delegation between userWithDelegations2 and userWithDelegations
        template: expect.objectContaining({
          body: expect.arrayContaining([
            expect.objectContaining({
              component: 'ImageWithLink',
              context: expect.objectContaining({
                href: `https://island.is/bff/login?login_hint=${delegationSubjectId}&target_link_uri=https://island.is/minarsidur/postholf`,
              }),
            }),
          ]),
        }),
      }),
    )
  })

  it('should use clickActionUrl that is provided if the url is not a service portal url', async () => {
    const notServicePortalUrl = 'https://island.is/something-else/'
    jest
      .spyOn(notificationsService, 'getTemplate')
      .mockReturnValue(
        Promise.resolve(
          getMockHnippTemplate({ clickActionUrl: notServicePortalUrl }),
        ),
      )

    await addToQueue(userWithDelegations2.nationalId)

    // should send email to primary recipient
    expect(emailService.sendEmail).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        to: expect.objectContaining({
          name: userWithDelegations2.name,
          address: userWithDelegations2.email,
        }),
        // should not use 3rd party login because the clickActionUrl is not a service portal url
        template: expect.objectContaining({
          body: expect.arrayContaining([
            expect.objectContaining({
              component: 'ImageWithLink',
              context: expect.objectContaining({
                href: notServicePortalUrl,
              }),
            }),
          ]),
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
        // should not use 3rd party login because the clickActionUrl is not a service portal url
        template: expect.objectContaining({
          body: expect.arrayContaining([
            expect.objectContaining({
              component: 'ImageWithLink',
              context: expect.objectContaining({
                href: notServicePortalUrl,
              }),
            }),
          ]),
        }),
      }),
    )
  })

  it('should not send email or push notification if we are outside working hours (8 AM - 11 PM) ', async () => {
    jest.setSystemTime(outsideWorkingHours)

    // First message will be handled since the receiveMessages call is waiting (wait time is max 20s and returns when a message is ready)
    // This ensures that the next message is added after time is set outside working hours
    await addToQueue(userWithNoDelegations.nationalId)
    await addToQueue(userWithNoDelegations.nationalId)

    expect(emailService.sendEmail).toHaveBeenCalledTimes(1)
    expect(notificationDispatch.sendPushNotification).toHaveBeenCalledTimes(1)

    // reset time to inside working hour
    jest.advanceTimersByTime(workingHoursDelta)
    // give worker some time to process message
    await wait(2)

    expect(emailService.sendEmail).toHaveBeenCalledTimes(2)
    expect(notificationDispatch.sendPushNotification).toHaveBeenCalledTimes(2)
  }, 10_000)

  it('should not send email or push notification if no profile is found for recipient', async () => {
    await addToQueue('1234567890')

    expect(notificationsWorkerService.createEmail).not.toHaveBeenCalled()
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

  it('should not send email if user has no email registered', async () => {
    await addToQueue(userWithNoEmail.nationalId)

    expect(notificationsWorkerService.createEmail).not.toHaveBeenCalled()
    expect(emailService.sendEmail).not.toHaveBeenCalled()
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

  it('should call national registry for persons', async () => {
    await addToQueue(userWithNoDelegations.nationalId)

    expect(nationalRegistryService.getName).toHaveBeenCalledTimes(1)
    expect(companyRegistryService.getCompany).not.toHaveBeenCalled()
    expect(emailService.sendEmail).toHaveBeenCalledTimes(1)
    expect(notificationDispatch.sendPushNotification).toHaveBeenCalledTimes(1)
  })

  it('should call company registry for companies', async () => {
    await addToQueue(companyUser.nationalId)

    expect(nationalRegistryService.getName).not.toHaveBeenCalled()
    expect(companyRegistryService.getCompany).toHaveBeenCalledTimes(1)
    expect(emailService.sendEmail).toHaveBeenCalledTimes(1)
    expect(notificationDispatch.sendPushNotification).not.toHaveBeenCalled()
  })

  describe('Actor Notifications', () => {
    it('should target a specific actor when onBehalfOf is provided without rootMessageId', async () => {
      // Clear mocks to isolate this test
      jest.clearAllMocks()

      // Spy on queue.add to verify actor notifications are added to queue
      const queueAddSpy = jest.spyOn(queue, 'add')

      // Add a message with onBehalfOf but no rootMessageId
      // This targets a specific actor (message.recipient becomes actorNationalId)
      await queue.add({
        recipient: userWithNoDelegations.nationalId, // This becomes the actorNationalId
        templateId: mockTemplateId,
        args: [{ key: 'organization', value: 'Test Crew' }],
        onBehalfOf: {
          nationalId: userWithDelegations.nationalId, // Original recipient
          name: userWithDelegations.name,
        },
        // No rootMessageId - this triggers the specific actor targeting flow
      })

      // Wait for processing
      await wait(3)

      // Verify user notification was created for the original recipient (onBehalfOf.nationalId)
      const userNotifications = await notificationModel.findAll({
        where: { recipient: userWithDelegations.nationalId },
      })
      expect(userNotifications).toHaveLength(1)
      const userNotification = userNotifications[0]

      // Verify user notification has correct structure
      expect(userNotification.messageId).toBeDefined()
      expect(userNotification.recipient).toBe(userWithDelegations.nationalId)
      expect(userNotification.templateId).toBe(mockTemplateId)

      // Verify actor notifications were added to queue, but ONLY for the specific actor
      expect(queueAddSpy).toHaveBeenCalled()

      // Get all calls to queue.add
      const queueAddCalls = queueAddSpy.mock.calls

      // Filter calls that are actor notifications (have onBehalfOf and rootMessageId)
      const actorNotificationQueueCalls = queueAddCalls.filter((call) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const message = call[0] as any
        return (
          message.onBehalfOf &&
          message.rootMessageId &&
          message.rootMessageId === userNotification.messageId
        )
      })

      // Should have added actor notification to queue ONLY for the targeted actor
      expect(actorNotificationQueueCalls.length).toBe(1)

      // Verify the actor notification in queue is for the specific actor we targeted
      const actorNotificationMessage =
        actorNotificationQueueCalls[0][0] as InternalCreateHnippNotificationDto
      expect(actorNotificationMessage.recipient).toBe(
        userWithNoDelegations.nationalId,
      ) // Should be the targeted actor
      expect(actorNotificationMessage.rootMessageId).toBe(
        userNotification.messageId,
      )
      expect(actorNotificationMessage.onBehalfOf?.nationalId).toBe(
        userWithDelegations.nationalId,
      )

      // Verify that if there were multiple delegations, only the targeted one was queued
      // (userWithDelegations might have multiple delegations, but we only target one)
      const allActorNotifications = actorNotificationQueueCalls.filter(
        (call) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const message = call[0] as any
          return (
            message.onBehalfOf?.nationalId === userWithDelegations.nationalId
          )
        },
      )
      expect(allActorNotifications.length).toBe(1) // Only one actor notification

      queueAddSpy.mockRestore()
    })

    it('should create user notification DB record and add actor notifications to queue when messaging a user with delegations', async () => {
      // Clear mocks to isolate this test
      jest.clearAllMocks()

      // Spy on queue.add to verify actor notifications are added to queue
      const queueAddSpy = jest.spyOn(queue, 'add')

      // Add a message for a user with delegations
      await addToQueue(userWithDelegations.nationalId)

      // Wait for processing
      await wait(3)

      // Verify user notification was created in DB
      const userNotifications = await notificationModel.findAll({
        where: { recipient: userWithDelegations.nationalId },
      })
      expect(userNotifications).toHaveLength(1)
      const userNotification = userNotifications[0]

      // Verify user notification has correct structure
      expect(userNotification.messageId).toBeDefined()
      expect(userNotification.recipient).toBe(userWithDelegations.nationalId)
      expect(userNotification.templateId).toBe(mockTemplateId)

      // Verify actor notifications were added to the queue
      // The queue.add should have been called for each delegation
      expect(queueAddSpy).toHaveBeenCalled()

      // Get all calls to queue.add
      const queueAddCalls = queueAddSpy.mock.calls

      // Filter calls that are actor notifications (have onBehalfOf and rootMessageId)
      const actorNotificationQueueCalls = queueAddCalls.filter((call) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const message = call[0] as any
        return (
          message.onBehalfOf &&
          message.rootMessageId &&
          message.rootMessageId === userNotification.messageId
        )
      })

      // Should have added actor notifications to queue for each delegation
      expect(actorNotificationQueueCalls.length).toBeGreaterThan(0)

      // Verify each actor notification in queue has correct structure
      actorNotificationQueueCalls.forEach((call) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const message = call[0] as any
        expect(message.rootMessageId).toBe(userNotification.messageId)
        expect(message.onBehalfOf).toBeDefined()
        expect(message.onBehalfOf?.nationalId).toBe(
          userWithDelegations.nationalId,
        )
        expect(message.recipient).toBeDefined() // Should be the delegation holder
        expect(message.templateId).toBe(mockTemplateId)
        expect(message.args).toBeDefined()
      })

      // Note: Since the worker is running continuously, the queued actor notifications
      // may be processed immediately. The important thing is that they were added
      // to the queue with the correct structure (onBehalfOf and rootMessageId).
      // The actual processing and DB creation is tested in the other test.
    })

    it('should not send delegation notifications when template scope is not in allowed notification scopes', async () => {
      // Clear mocks to isolate this test
      jest.clearAllMocks()

      // Spy on queue.add to verify actor notifications are NOT added to queue
      const queueAddSpy = jest.spyOn(queue, 'add')

      // Mock template with a scope that is NOT in notificationScopes
      // Using a scope that doesn't support delegation notifications
      const invalidScope = '@island.is/invalid-scope'
      jest
        .spyOn(notificationsService, 'getTemplate')
        .mockReturnValue(
          Promise.resolve(getMockHnippTemplate({ scope: invalidScope })),
        )

      // Add a message for a user with delegations
      await addToQueue(userWithDelegations.nationalId)

      // Wait for processing
      await wait(3)

      // Verify user notification was still created
      const userNotifications = await notificationModel.findAll({
        where: { recipient: userWithDelegations.nationalId },
      })
      expect(userNotifications).toHaveLength(1)

      // Verify user notification has the invalid scope stored
      const userNotification = userNotifications[0]
      expect(userNotification.scope).toBe(invalidScope)

      // Verify NO actor notifications were added to queue
      // (because the scope is not in notificationScopes)
      const queueAddCalls = queueAddSpy.mock.calls
      const actorNotificationQueueCalls = queueAddCalls.filter((call) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const message = call[0] as any
        return message.onBehalfOf && message.rootMessageId
      })
      expect(actorNotificationQueueCalls).toHaveLength(0)

      // Verify email was still sent to primary recipient
      expect(emailService.sendEmail).toHaveBeenCalledTimes(1)
      expect(emailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: expect.objectContaining({
            address: userWithDelegations.email,
          }),
        }),
      )

      queueAddSpy.mockRestore()
    })

    it('should send delegation notifications when template scope is in allowed notification scopes', async () => {
      // Clear mocks to isolate this test
      jest.clearAllMocks()

      // Spy on queue.add to verify actor notifications are added to queue
      const queueAddSpy = jest.spyOn(queue, 'add')

      // Mock template with a valid scope (DocumentsScope.main which is in notificationScopes)
      const validScope = '@island.is/documents'
      jest
        .spyOn(notificationsService, 'getTemplate')
        .mockReturnValue(
          Promise.resolve(getMockHnippTemplate({ scope: validScope })),
        )

      // Add a message for a user with delegations
      await addToQueue(userWithDelegations.nationalId)

      // Wait for processing
      await wait(3)

      // Verify user notification was created with the valid scope
      const userNotifications = await notificationModel.findAll({
        where: { recipient: userWithDelegations.nationalId },
      })
      expect(userNotifications).toHaveLength(1)
      const userNotification = userNotifications[0]
      expect(userNotification.scope).toBe(validScope)

      // Verify actor notifications WERE added to queue
      // (because the scope is in notificationScopes)
      const queueAddCalls = queueAddSpy.mock.calls
      const actorNotificationQueueCalls = queueAddCalls.filter((call) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const message = call[0] as any
        return (
          message.onBehalfOf &&
          message.rootMessageId &&
          message.rootMessageId === userNotification.messageId
        )
      })
      expect(actorNotificationQueueCalls.length).toBeGreaterThan(0)

      queueAddSpy.mockRestore()
    })

    it('should use default scope (DocumentsScope.main) when template scope is not provided', async () => {
      // Clear mocks to isolate this test
      jest.clearAllMocks()

      // Spy on queue.add to verify actor notifications are added to queue
      const queueAddSpy = jest.spyOn(queue, 'add')

      // Mock template with no scope (should default to DocumentsScope.main)
      jest
        .spyOn(notificationsService, 'getTemplate')
        .mockReturnValue(
          Promise.resolve(getMockHnippTemplate({ scope: undefined })),
        )

      // Add a message for a user with delegations
      await addToQueue(userWithDelegations.nationalId)

      // Wait for processing
      await wait(3)

      // Verify user notification was created with the default scope
      const userNotifications = await notificationModel.findAll({
        where: { recipient: userWithDelegations.nationalId },
      })
      expect(userNotifications).toHaveLength(1)
      const userNotification = userNotifications[0]
      // Should default to DocumentsScope.main which is '@island.is/documents'
      expect(userNotification.scope).toBe('@island.is/documents')

      // Verify actor notifications WERE added to queue
      // (because the default scope is in notificationScopes)
      const queueAddCalls = queueAddSpy.mock.calls
      const actorNotificationQueueCalls = queueAddCalls.filter((call) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const message = call[0] as any
        return (
          message.onBehalfOf &&
          message.rootMessageId &&
          message.rootMessageId === userNotification.messageId
        )
      })
      expect(actorNotificationQueueCalls.length).toBeGreaterThan(0)

      queueAddSpy.mockRestore()
    })

    it('should only send actor notifications to delegations that have the specified scope', async () => {
      // Clear mocks to isolate this test
      jest.clearAllMocks()

      // Create a test user with multiple delegations for different scopes
      const testUserNationalId = createNationalId('person')
      const actorWithDocumentsScope = createNationalId('person')
      const actorWithOtherScope = createNationalId('person')

      // Helper function to create paginated delegation response
      const createDelegationResponse = (
        delegations: DelegationRecordDTO[],
      ) => ({
        data: delegations,
        totalCount: delegations.length,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: '',
          endCursor: '',
        },
      })

      // Mock the delegations API to return scope-filtered delegations
      const delegationsApi = app.get(DelegationsApi)
      const getDelegationRecordsSpy = jest
        .spyOn(delegationsApi, 'delegationsControllerGetDelegationRecords')
        .mockImplementation(async ({ xQueryNationalId, scopes }) => {
          // For test user, return scope-filtered delegations
          if (xQueryNationalId === testUserNationalId) {
            const scope = Array.isArray(scopes) ? scopes[0] : scopes
            if (scope === '@island.is/documents') {
              return createDelegationResponse([
                {
                  fromNationalId: testUserNationalId,
                  toNationalId: actorWithDocumentsScope,
                  subjectId: null,
                  type: AuthDelegationType.ProcurationHolder,
                },
              ])
            } else if (scope === '@island.is/other-scope') {
              return createDelegationResponse([
                {
                  fromNationalId: testUserNationalId,
                  toNationalId: actorWithOtherScope,
                  subjectId: null,
                  type: AuthDelegationType.ProcurationHolder,
                },
              ])
            }
            // No delegations for other scopes
            return createDelegationResponse([])
          }

          // For other users, delegate to original mock implementation
          // This calls the MockDelegationsService
          const mockService = new MockDelegationsService()
          return mockService.delegationsControllerGetDelegationRecords({
            xQueryNationalId,
            scopes,
          })
        })

      // Mock user profile for test user
      jest
        .spyOn(userProfileApi, 'userProfileControllerFindUserProfile')
        .mockReturnValueOnce(
          Promise.resolve({
            nationalId: testUserNationalId,
            email: 'test@test.com',
            emailVerified: true,
            documentNotifications: true,
            emailNotifications: true,
          } as UserProfileDto),
        )

      // Mock actor profiles
      jest
        .spyOn(userProfileApi, 'userProfileControllerGetActorProfile')
        .mockImplementation(async ({ xParamToNationalId }) => {
          if (
            xParamToNationalId === actorWithDocumentsScope ||
            xParamToNationalId === actorWithOtherScope
          ) {
            return {
              nationalId: xParamToNationalId,
              email: `${xParamToNationalId}@test.com`,
              emailVerified: true,
              documentNotifications: true,
              emailNotifications: true,
              locale: 'is',
            } as UserProfileDto
          }
          return undefined
        })

      // Spy on queue.add to verify actor notifications
      const queueAddSpy = jest.spyOn(queue, 'add')

      // Mock template with documents scope
      const documentsScope = '@island.is/documents'
      jest
        .spyOn(notificationsService, 'getTemplate')
        .mockReturnValue(
          Promise.resolve(getMockHnippTemplate({ scope: documentsScope })),
        )

      // Add a message for the test user
      await queue.add({
        recipient: testUserNationalId,
        templateId: mockTemplateId,
        args: [{ key: 'organization', value: 'Test Crew' }],
      })

      // Wait for processing
      await wait(3)

      // Verify user notification was created
      const userNotifications = await notificationModel.findAll({
        where: { recipient: testUserNationalId },
      })
      expect(userNotifications).toHaveLength(1)
      const userNotification = userNotifications[0]
      expect(userNotification.scope).toBe(documentsScope)

      // Verify actor notifications were queued ONLY for the actor with documents scope
      const queueAddCalls = queueAddSpy.mock.calls
      const actorNotificationQueueCalls = queueAddCalls.filter((call) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const message = call[0] as any
        return (
          message.onBehalfOf &&
          message.rootMessageId &&
          message.rootMessageId === userNotification.messageId
        )
      })

      // Should have exactly one actor notification (for documents scope delegation)
      expect(actorNotificationQueueCalls).toHaveLength(1)

      // Verify it's for the correct actor (documents scope)
      const actorNotificationMessage =
        actorNotificationQueueCalls[0][0] as InternalCreateHnippNotificationDto
      expect(actorNotificationMessage.recipient).toBe(actorWithDocumentsScope)
      expect(actorNotificationMessage.onBehalfOf?.nationalId).toBe(
        testUserNationalId,
      )

      // Verify it's NOT for the actor with other scope
      const otherScopeActorNotifications = actorNotificationQueueCalls.filter(
        (call) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const message = call[0] as any
          return message.recipient === actorWithOtherScope
        },
      )
      expect(otherScopeActorNotifications).toHaveLength(0)

      // Verify the delegation API was called with the correct scope
      expect(getDelegationRecordsSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          xQueryNationalId: testUserNationalId,
          scopes: documentsScope,
        }),
      )

      // Clean up
      getDelegationRecordsSpy.mockRestore()
      queueAddSpy.mockRestore()
    })

    it('should create both user notification and actor notification and send email only to actor when onBehalfOf and rootMessageId are provided', async () => {
      // Clear email calls to isolate this test
      jest.clearAllMocks()

      // First, create the root user notification (this would have been created by the original message)
      const rootUserNotification = await notificationModel.create({
        messageId: randomUUID(),
        recipient: userWithDelegations.nationalId,
        templateId: mockTemplateId,
        args: [{ key: 'organization', value: 'Test Crew' }],
        scope: '@island.is/documents',
      })

      // Now add an actor notification to the queue (with onBehalfOf and rootMessageId)
      // This simulates what happens when a delegation holder needs to be notified
      await queue.add({
        recipient: userWithNoDelegations.nationalId, // Actor (delegation holder)
        templateId: mockTemplateId,
        args: [{ key: 'organization', value: 'Test Crew' }],
        rootMessageId: rootUserNotification.messageId,
        onBehalfOf: {
          nationalId: userWithDelegations.nationalId, // Original recipient
          name: userWithDelegations.name,
        },
      })

      // Wait for actor notification to be processed
      await wait(4)

      // Verify user notification exists (the root one, created separately)
      const userNotifications = await notificationModel.findAll({
        where: { messageId: rootUserNotification.messageId },
      })
      expect(userNotifications).toHaveLength(1)

      // Verify actor notification was created
      // Find the actor notification by userNotificationId and recipient
      const actorNotification = await actorNotificationModel.findOne({
        where: {
          userNotificationId: rootUserNotification.id,
          recipient: userWithNoDelegations.nationalId,
        },
      })
      expect(actorNotification).toBeDefined()

      // Verify actor notification has correct structure
      expect(actorNotification?.messageId).toBeDefined()
      expect(actorNotification?.userNotificationId).toBe(
        rootUserNotification.id,
      )
      expect(actorNotification?.recipient).toBe(
        userWithNoDelegations.nationalId,
      )

      // Verify actor notification only has required fields (no redundant fields)
      const actorNotificationData = actorNotification?.toJSON()
      expect(actorNotificationData).not.toHaveProperty('rootMessageId')
      expect(actorNotificationData).not.toHaveProperty('onBehalfOfNationalId')
      expect(actorNotificationData).not.toHaveProperty('scope')
      expect(actorNotificationData).not.toHaveProperty('updated')

      // Verify email was sent ONLY to the actor (not to the original recipient)
      const emailCalls = (emailService.sendEmail as jest.Mock).mock.calls

      // Should have sent at least one email (to the actor)
      expect(emailCalls.length).toBeGreaterThan(0)

      // Find email sent to actor
      const actorEmailCall = emailCalls.find(
        (call) => call[0].to.address === userWithNoDelegations.email,
      )
      expect(actorEmailCall).toBeDefined()

      // Verify NO email was sent to the original recipient (userWithDelegations)
      // when processing the actor notification
      const originalRecipientEmailCalls = emailCalls.filter(
        (call) => call[0].to.address === userWithDelegations.email,
      )
      expect(originalRecipientEmailCalls).toHaveLength(0)

      // Verify actor profile was fetched
      expect(
        userProfileApi.userProfileControllerGetActorProfile,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          xParamToNationalId: userWithNoDelegations.nationalId,
          xParamFromNationalId: userWithDelegations.nationalId,
        }),
      )

      // Verify push notification was NOT sent (actor notifications only send emails)
      const pushNotificationCalls = (
        notificationDispatch.sendPushNotification as jest.Mock
      ).mock.calls
      const actorPushNotificationCall = pushNotificationCalls.find(
        (call) => call[0].nationalId === userWithNoDelegations.nationalId,
      )
      expect(actorPushNotificationCall).toBeUndefined()
    })
  })
})
