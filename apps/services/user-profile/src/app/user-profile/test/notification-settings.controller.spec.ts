import request from 'supertest'
import { getModelToken } from '@nestjs/sequelize'

import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'
import { UserProfileScope } from '@island.is/auth/scopes'
import { setupApp, setupAppWithoutAuth, TestApp } from '@island.is/testing/nest'

import { AppModule } from '../../app.module'
import { SequelizeConfigService } from '../../sequelizeConfig.service'
import { FixtureFactory } from '../../../../test/fixture-factory'
import { UserProfile } from '../models/userProfile.model'
import { BlockedNotification } from '../models/blockedNotification.model'

const basePath = '/v2/users/.national-id'
const path = `${basePath}?include=notificationSettings`

describe('UserProfileController - GET /v2/users/.national-id?include=notificationSettings', () => {
  describe('No auth', () => {
    it('should return 401 when user is not authenticated', async () => {
      const app = await setupAppWithoutAuth({
        AppModule,
        SequelizeConfigService,
      })

      const res = await request(app.getHttpServer())
        .get(path)
        .set('X-Param-National-Id', createNationalId('person'))

      expect(res.status).toBe(401)

      await app.cleanUp()
    })

    it('should return 403 when user does not have the system or admin scope', async () => {
      const app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({}),
      })

      const res = await request(app.getHttpServer())
        .get(path)
        .set('X-Param-National-Id', createNationalId('person'))

      expect(res.status).toBe(403)

      await app.cleanUp()
    })
  })

  describe.each([UserProfileScope.system, UserProfileScope.admin])(
    'With %s scope',
    (scope) => {
      let app: TestApp
      let server: request.SuperTest<request.Test>
      let fixtureFactory: FixtureFactory
      let userProfileModel: typeof UserProfile
      let blockedNotificationModel: typeof BlockedNotification

      beforeAll(async () => {
        app = await setupApp({
          AppModule,
          SequelizeConfigService,
          user: createCurrentUser({ scope: [scope] }),
        })

        server = request(app.getHttpServer())
        fixtureFactory = new FixtureFactory(app)
        userProfileModel = app.get(getModelToken(UserProfile))
        blockedNotificationModel = app.get(getModelToken(BlockedNotification))
      })

      beforeEach(async () => {
        await blockedNotificationModel.destroy({ truncate: true })
        await userProfileModel.destroy({ truncate: true, cascade: true })
      })

      afterAll(async () => {
        await app.cleanUp()
      })

      it('should return 400 when the national id is not valid', async () => {
        const res = await server
          .get(path)
          .set('X-Param-National-Id', '1234567890')

        expect(res.status).toBe(400)
      })

      it('should return no blocked categories for an unknown user', async () => {
        const nationalId = createNationalId('person')

        const res = await server
          .get(path)
          .set('X-Param-National-Id', nationalId)

        expect(res.status).toBe(200)
        expect(res.body).toMatchObject({ nationalId, blockedCategories: [] })
      })

      it('should return 400 for an unknown include value', async () => {
        const res = await server
          .get(`${basePath}?include=unknown`)
          .set('X-Param-National-Id', createNationalId('person'))

        expect(res.status).toBe(400)
      })

      it('should accept multiple comma separated include values', async () => {
        const nationalId = createNationalId('person')

        const res = await server
          .get(`${basePath}?include=notificationSettings,notificationSettings`)
          .set('X-Param-National-Id', nationalId)

        expect(res.status).toBe(200)
        expect(res.body.blockedCategories).toEqual([])
      })

      it('should return 400 when any include value is unknown', async () => {
        const res = await server
          .get(`${basePath}?include=notificationSettings,unknown`)
          .set('X-Param-National-Id', createNationalId('person'))

        expect(res.status).toBe(400)
      })

      it('should not return blocked categories unless requested', async () => {
        const nationalId = createNationalId('person')
        await fixtureFactory.createUserProfile({ nationalId })
        await fixtureFactory.createBlockedNotification({
          nationalId,
          senderId: createNationalId('company'),
        })

        const res = await server
          .get(basePath)
          .set('X-Param-National-Id', nationalId)

        expect(res.status).toBe(200)
        expect(res.body).not.toHaveProperty('blockedCategories')
      })

      it('should return the blocked categories of the requested user only', async () => {
        const nationalId = createNationalId('person')
        const otherNationalId = createNationalId('person')
        const senderId = createNationalId('company')
        await fixtureFactory.createUserProfile({ nationalId })
        await fixtureFactory.createUserProfile({ nationalId: otherNationalId })
        await fixtureFactory.createBlockedNotification({
          nationalId,
          senderId,
          category: 'heilbrigdismal',
          categoryLabel: { is: 'Heilbrigðismál', en: 'Health' },
        })
        await fixtureFactory.createBlockedNotification({
          nationalId: otherNationalId,
          senderId,
        })

        const res = await server
          .get(path)
          .set('X-Param-National-Id', nationalId)

        expect(res.status).toBe(200)
        expect(res.body).toMatchObject({
          nationalId,
          blockedCategories: [
            {
              key: `${senderId}-heilbrigdismal`,
              senderId,
              category: 'heilbrigdismal',
              categoryLabel: { is: 'Heilbrigðismál', en: 'Health' },
            },
          ],
        })
      })
    },
  )
})
