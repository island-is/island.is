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
    })
    server = request(app.getHttpServer())
    userNotificationSenderModel = app.get(getModelToken(UserNotificationSender))

    jest.spyOn(app.get(CmsService), 'fetchData').mockResolvedValue({
      hnippTemplateCollection: {
        items: [{ categoryIs: 'Heilbrigðismál', categoryEn: 'Health' }],
      },
    })
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
