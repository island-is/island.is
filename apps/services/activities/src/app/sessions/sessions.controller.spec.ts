import faker from 'faker'
import request from 'supertest'
import {
  getRequestMethod,
  TestApp,
  TestEndpointOptions,
} from '@island.is/testing/nest'
import {
  setupWithAuth,
  setupWithoutAuth,
  setupWithoutPermission,
} from '../../test/setup'
import { ActivitiesScope } from '@island.is/auth/scopes'
import { createRandomSession } from '../../test/session.fixture'
import { createCurrentUser } from '@island.is/testing/fixtures'

describe('ActivitiesController', () => {
  describe('withAuth', () => {
    let app: TestApp
    let server: request.SuperTest<request.Test>
    const user = createCurrentUser({ scope: [ActivitiesScope.sessionsWrite] })

    beforeAll(async () => {
      // Arrange
      app = await setupWithAuth({ user })
      server = request(app.getHttpServer())
    })

    afterAll(() => {
      app.cleanUp()
    })

    it('POST /v1/activities/sessions should return success', async () => {
      // Act
      const res = await server
        .post(`/v1/activities/sessions`)
        .send(createRandomSession(user.nationalId))

      // Assert
      expect(res.status).toEqual(202)
      expect(res.body.data).toBeUndefined()
    })

    it('POST /v1/activities/sessions should return forbidden when not actor', async () => {
      // Act
      const res = await server
        .post(`/v1/activities/sessions`)
        .send(createRandomSession(faker.datatype.string(10)))

      // Assert
      expect(res.status).toEqual(403)
    })
  })

  describe('withoutAuth and permission', () => {
    it.each`
      method    | endpoint
      ${'POST'} | ${'/v1/activities/sessions'}
    `(
      '$method $endpoint should return 401 when user is not authenticated',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupWithoutAuth()
        const server = request(app.getHttpServer())
        const url = endpoint

        // Act
        const res = await getRequestMethod(server, method)(url)

        // Assert
        expect(res.status).toEqual(401)
        expect(res.body).toMatchObject({
          status: 401,
          type: 'https://httpstatuses.org/401',
          title: 'Unauthorized',
        })

        // CleanUp
        app.cleanUp()
      },
    )

    it.each`
      method    | endpoint
      ${'POST'} | ${'/v1/activities/sessions'}
    `(
      '$method $endpoint should return 403 Forbidden when user does not have the correct scope',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupWithoutPermission()
        const server = request(app.getHttpServer())
        const url = endpoint

        // Act
        const res = await getRequestMethod(server, method)(url)

        // Assert
        expect(res.status).toEqual(403)
        expect(res.body).toMatchObject({
          status: 403,
          type: 'https://httpstatuses.org/403',
          title: 'Forbidden',
          detail: 'Forbidden resource',
        })

        // CleanUp
        app.cleanUp()
      },
    )
  })
})
