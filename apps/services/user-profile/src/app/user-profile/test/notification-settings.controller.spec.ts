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

const path = '/v2/users/.national-id/notification-settings'

describe('UserProfileController - GET /v2/users/.national-id/notification-settings', () => {
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
        expect(res.body).toEqual({ nationalId, blockedCategories: [] })
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
        expect(res.body).toEqual({
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
