import { INestApplication, Type } from '@nestjs/common'
import { getConnectionToken, getModelToken } from '@nestjs/sequelize'
import { TestingModuleBuilder } from '@nestjs/testing'
import { Sequelize } from 'sequelize-typescript'

import { DelegationsApi } from '@island.is/clients/auth/delegation-api'
import { CmsService } from '@island.is/clients/cms'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import {
  CompanyExtendedInfo,
  CompanyRegistryClientService,
} from '@island.is/clients/rsk/company-registry'
import { UserProfileDto, V2UsersApi } from '@island.is/clients/user-profile'
import { EmailService } from '@island.is/email-service'
import { QueueService, getQueueServiceToken } from '@island.is/message-queue'
import { FeatureFlagService } from '@island.is/nest/feature-flags'
import { testServer, truncate, useDatabase } from '@island.is/testing/nest'

import { UserNotificationsConfig } from '../../../../config'
import { FIREBASE_PROVIDER } from '../../../../constants'
import { AppModule } from '../../../app.module'
import { SequelizeConfigService } from '../../../sequelizeConfig.service'
import { Notification } from '../notification.model'
import { NotificationDispatchService } from '../notificationDispatch.service'
import { NotificationsService } from '../notifications.service'
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
})
