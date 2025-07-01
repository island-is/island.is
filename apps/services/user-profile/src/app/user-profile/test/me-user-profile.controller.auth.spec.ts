import request from 'supertest'

import {
  getRequestMethod,
  setupApp,
  setupAppWithoutAuth,
  TestApp,
  TestEndpointOptions,
} from '@island.is/testing/nest'
import { createCurrentUser } from '@island.is/testing/fixtures'

import { FixtureFactory } from '../../../../test/fixture-factory'
import { AppModule } from '../../app.module'
import { SequelizeConfigService } from '../../sequelizeConfig.service'

const user = createCurrentUser()

const createTestData = async (app: TestApp) => {
  const fixtureFactory = new FixtureFactory(app)
  await fixtureFactory.createUserProfile({
    nationalId: user.nationalId,
  })
}

describe('MeUserProfileController', () => {
  describe.each`
    method     | endpoint
    ${'GET'}   | ${`/v2/me`}
    ${'PATCH'} | ${`/v2/me`}
    ${'POST'}  | ${`/v2/me/nudge`}
    ${'POST'}  | ${`/v2/actor/create-verification`}
  `('$method $endpoint', ({ method, endpoint }: TestEndpointOptions) => {
    it('should return 401 when user is not authenticated', async () => {
      // Arrange
      const app = await setupAppWithoutAuth({
        AppModule,
        SequelizeConfigService,
      })
      const server = request(app.getHttpServer())
      await createTestData(app)

      // Act
      const res = await getRequestMethod(server, method)(endpoint)

      // Assert
      expect(res.status).toEqual(401)
      expect(res.body).toMatchObject({
        status: 401,
        type: 'https://httpstatuses.org/401',
        title: 'Unauthorized',
      })

      // CleanUp
      await app.cleanUp()
    })

    it('should return 403 Forbidden when user does not have the correct scope', async () => {
      // Arrange
      const app = await setupApp({ AppModule, SequelizeConfigService, user })
      const server = request(app.getHttpServer())
      await createTestData(app)

      // Act
      const res = await getRequestMethod(server, method)(endpoint)

      // Assert
      expect(res.status).toEqual(403)
      expect(res.body).toMatchObject({
        status: 403,
        type: 'https://httpstatuses.org/403',
        title: 'Forbidden',
        detail: 'Forbidden resource',
      })

      // CleanUp
      await app.cleanUp()
    })
  })
})
