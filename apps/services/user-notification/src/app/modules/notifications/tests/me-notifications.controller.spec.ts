import { getModelToken } from '@nestjs/sequelize'
import request from 'supertest'

import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'
import {
  getRequestMethod,
  setupApp,
  setupAppWithoutAuth,
  TestApp,
  TestEndpointOptions,
} from '@island.is/testing/nest'

import { AppModule } from '../../../app.module'
import { SequelizeConfigService } from '../../../sequelizeConfig.service'
import { DocumentsScope } from '@island.is/auth/scopes'
import { CmsService } from '@island.is/clients/cms'
import { UserNotificationSender } from '../user-notification-sender.model'
import { Notification } from '../notification.model'

beforeAll(async () => {
  process.env.INIT_SCHEMA = 'true' // Disabling Firebase init
})

describe('MeNotificationsController - No Auth', () => {
  it.each`
    method     | endpoint
    ${'GET'}   | ${'/v1/me/notifications'}
    ${'GET'}   | ${'/v1/me/notifications/some-notification-id'}
    ${'GET'}   | ${'/v1/me/notifications/unread-count'}
    ${'GET'}   | ${'/v1/me/notifications/unseen-count'}
    ${'GET'}   | ${'/v1/me/notifications/categories'}
    ${'PATCH'} | ${'/v1/me/notifications/some-notification-id'}
    ${'POST'}  | ${'/v1/me/notifications/mark-all-as-seen'}
    ${'POST'}  | ${'/v1/me/notifications/mark-all-as-read'}
  `(
    '$method $endpoint should return 401 when user is unauthenticated',
    async ({ method, endpoint }: TestEndpointOptions) => {
      //Arrange
      const app = await setupAppWithoutAuth({
        AppModule: AppModule,
        SequelizeConfigService: SequelizeConfigService,
      })
      const server = request(app.getHttpServer())

      //Act
      const res = await getRequestMethod(server, method)(endpoint)

      //Assert
      expect(res.status).toEqual(401)

      app.cleanUp()
    },
  )
})

describe('MeNotificationsController - With Auth No Scope', () => {
  it.each`
    method     | endpoint
    ${'GET'}   | ${'/v1/me/notifications'}
    ${'GET'}   | ${'/v1/me/notifications/some-notification-id'}
    ${'GET'}   | ${'/v1/me/notifications/unread-count'}
    ${'GET'}   | ${'/v1/me/notifications/unseen-count'}
    ${'GET'}   | ${'/v1/me/notifications/categories'}
    ${'PATCH'} | ${'/v1/me/notifications/some-notification-id'}
    ${'POST'}  | ${'/v1/me/notifications/mark-all-as-seen'}
    ${'POST'}  | ${'/v1/me/notifications/mark-all-as-read'}
  `(
    '$method $endpoint should return 403 when user is unauthorized',
    async ({ method, endpoint }: TestEndpointOptions) => {
      //Arrange
      const app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({}),
      })
      const server = request(app.getHttpServer())

      //Act
      const res = await getRequestMethod(server, method)(endpoint)

      //Assert
      expect(res.status).toEqual(403)

      app.cleanUp()
    },
  )
})

describe('MeNotificationsController - GET With Auth And Scope', () => {
  it.each`
    method   | endpoint
    ${'GET'} | ${'/v1/me/notifications/unread-count'}
    ${'GET'} | ${'/v1/me/notifications/unseen-count'}
    ${'GET'} | ${'/v1/me/notifications/categories'}
  `(
    '$method $endpoint should return 200 when user is authorized',
    async ({ method, endpoint }: TestEndpointOptions) => {
      //Arrange
      const app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({
          scope: [DocumentsScope.main],
        }),
      })
      const server = request(app.getHttpServer())

      //Act
      const res = await getRequestMethod(server, method)(endpoint)

      //Assert
      expect(res.status).toEqual(200)

      app.cleanUp()
    },
  )
})

describe('MeNotificationsController - PATCH With Auth And Scope', () => {
  it.each`
    method     | endpoint
    ${'PATCH'} | ${'/v1/me/notifications/some-notification-id'}
    ${'POST'}  | ${'/v1/me/notifications/mark-all-as-seen'}
    ${'POST'}  | ${'/v1/me/notifications/mark-all-as-read'}
  `(
    '$method $endpoint should return 204 when user is authorized',
    async ({ method, endpoint }: TestEndpointOptions) => {
      //Arrange
      const app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({
          scope: [DocumentsScope.main],
        }),
      })
      const server = request(app.getHttpServer())

      //Act
      const res = await getRequestMethod(server, method)(endpoint)

      //Assert
      expect(res.status).toEqual(204)

      app.cleanUp()
    },
  )
})

describe('MeNotificationsController - GET /v1/me/notifications/categories', () => {
  const user = createCurrentUser({
    nationalId: createNationalId('person'),
    scope: [DocumentsScope.main],
  })
  const senderId = createNationalId('company')
  const otherSenderId = createNationalId('company')

  let app: TestApp
  let server: request.SuperTest<request.Test>
  let userNotificationSenderModel: typeof UserNotificationSender

  beforeAll(async () => {
    app = await setupApp({
      AppModule,
      SequelizeConfigService,
      user,
      override: (builder) =>
        builder.overrideProvider(CmsService).useValue({
          fetchData: jest.fn().mockResolvedValue({
            hnippTemplateCollection: {
              items: [{ categoryIs: 'Heilbrigðismál', categoryEn: 'Health' }],
            },
          }),
        }),
    })
    server = request(app.getHttpServer())
    userNotificationSenderModel = app.get(getModelToken(UserNotificationSender))
  })

  beforeEach(async () => {
    await userNotificationSenderModel.destroy({ truncate: true })
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  it("should return the user's own categories with labels, presenting uncategorized as almennt", async () => {
    await userNotificationSenderModel.bulkCreate([
      {
        recipient: user.nationalId,
        senderId,
        templateId: 'HNIPP.HEALTH',
        category: 'heilbrigdismal',
        priorityType: 'Informative',
      },
      {
        recipient: user.nationalId,
        senderId,
        templateId: 'HNIPP.GENERAL',
        category: null,
        priorityType: null,
      },
      {
        recipient: user.nationalId,
        senderId: otherSenderId,
        templateId: 'HNIPP.GENERAL',
        category: null,
        priorityType: null,
      },
      {
        recipient: createNationalId('person'),
        senderId,
        templateId: 'HNIPP.HEALTH',
        category: 'heilbrigdismal',
        priorityType: 'Informative',
      },
    ])

    const res = await server.get('/v1/me/notifications/categories')

    expect(res.status).toBe(200)
    expect(res.body.categories).toHaveLength(3)
    expect(res.body.categories).toEqual(
      expect.arrayContaining([
        {
          senderId,
          category: 'almennt',
          categoryLabel: { is: 'Almennt', en: 'General' },
        },
        {
          senderId,
          category: 'heilbrigdismal',
          categoryLabel: { is: 'Heilbrigðismál', en: 'Health' },
        },
        {
          senderId: otherSenderId,
          category: 'almennt',
          categoryLabel: { is: 'Almennt', en: 'General' },
        },
      ]),
    )
  })

  it('should return a category once when several templates share it', async () => {
    await userNotificationSenderModel.bulkCreate([
      {
        recipient: user.nationalId,
        senderId,
        templateId: 'HNIPP.TAXES.ASSESSMENT',
        category: 'skattar',
        priorityType: 'Informative',
      },
      {
        recipient: user.nationalId,
        senderId,
        templateId: 'HNIPP.TAXES.REFUND',
        category: 'skattar',
        priorityType: null,
      },
    ])

    const res = await server.get('/v1/me/notifications/categories')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      categories: [
        { senderId, category: 'skattar', categoryLabel: { is: 'skattar' } },
      ],
    })
  })
})

describe('MeNotificationsController - notifications that were not sent', () => {
  const user = createCurrentUser({
    nationalId: createNationalId('person'),
    scope: [DocumentsScope.main],
  })
  const templateId = 'HNIPP.DEMO.ID'

  let app: TestApp
  let server: request.SuperTest<request.Test>
  let notificationModel: typeof Notification
  let sent: Notification
  let unsent: Notification

  beforeAll(async () => {
    app = await setupApp({
      AppModule,
      SequelizeConfigService,
      user,
      override: (builder) =>
        builder.overrideProvider(CmsService).useValue({
          fetchData: jest.fn().mockResolvedValue({
            hnippTemplateCollection: {
              items: [
                {
                  templateId,
                  title: 'Demo title',
                  externalBody: 'Demo body',
                  internalBody: 'Demo internal body',
                  args: [],
                  scope: DocumentsScope.main,
                },
              ],
            },
          }),
        }),
    })
    server = request(app.getHttpServer())
    notificationModel = app.get(getModelToken(Notification))
  })

  beforeEach(async () => {
    await notificationModel.destroy({ truncate: true, cascade: true })
    const base = {
      recipient: user.nationalId,
      templateId,
      args: [],
      scope: DocumentsScope.main,
      read: false,
      seen: false,
    }
    sent = await notificationModel.create({
      ...base,
      messageId: '11111111-1111-4111-8111-111111111111',
      wasSent: true,
    })
    unsent = await notificationModel.create({
      ...base,
      messageId: '22222222-2222-4222-8222-222222222222',
      wasSent: false,
    })
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  it('should leave out notifications that were not sent by default', async () => {
    const res = await server.get('/v1/me/notifications')

    expect(res.status).toBe(200)
    expect(res.body.totalCount).toBe(1)
    expect(res.body.data.map((n: { id: number }) => n.id)).toEqual([sent.id])
  })

  it('should include notifications that were not sent when includeUnsent=true', async () => {
    const res = await server.get('/v1/me/notifications?includeUnsent=true')

    expect(res.status).toBe(200)
    expect(res.body.totalCount).toBe(2)
    expect(res.body.data.map((n: { id: number }) => n.id)).toEqual([
      unsent.id,
      sent.id,
    ])
  })

  it('should not count notifications that were not sent as unread or unseen', async () => {
    const unread = await server.get('/v1/me/notifications/unread-count')
    const unseen = await server.get('/v1/me/notifications/unseen-count')

    expect(unread.body).toEqual({ unreadCount: 1 })
    expect(unseen.body).toEqual({ unseenCount: 1 })
  })

  it('should not mark notifications that were not sent as read or seen', async () => {
    await server.post('/v1/me/notifications/mark-all-as-read')
    await server.post('/v1/me/notifications/mark-all-as-seen')

    await sent.reload()
    await unsent.reload()
    expect(sent).toMatchObject({ read: true, seen: true })
    expect(unsent).toMatchObject({ read: false, seen: false })
  })
})
