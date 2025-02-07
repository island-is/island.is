import { TestApp } from '@island.is/testing/nest'
import {
  defaultScopes,
  setupWithAuth,
  setupWithoutAuth,
} from '../../../test/setup'
import { createClient, FixtureFactory } from '@island.is/services/auth/testing'
import request from 'supertest'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { getFakeNationalId } from '../../../test/stubs/genericStubs'
import { IdentityConfirmation } from '@island.is/auth-api-lib'
import { getModelToken } from '@nestjs/sequelize'

describe('Confirm Identity', () => {
  const client = createClient({
    clientId: '@island.is/webapp',
  })

  describe('Without auth', () => {
    let app: TestApp
    let factory: FixtureFactory
    let server: request.SuperTest<request.Test>

    let identityConfirmationModel: typeof IdentityConfirmation

    beforeAll(async () => {
      app = await setupWithoutAuth()
      server = request(app.getHttpServer())

      // Setup models here
      identityConfirmationModel = app.get<typeof IdentityConfirmation>(
        getModelToken(IdentityConfirmation),
      )

      factory = new FixtureFactory(app)
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    // Test cases here
    it('should return 401 since user is not authenticated', async () => {
      await server.get('/confirm-identity').expect(401)
    })
  })

  describe('Without auth', () => {
    let app: TestApp
    let factory: FixtureFactory
    let server: request.SuperTest<request.Test>

    let identityConfirmationModel: typeof IdentityConfirmation

    const userNationalId = getFakeNationalId()

    const user = createCurrentUser({
      nationalId: userNationalId,
      scope: [],
      client: client.clientId,
    })

    beforeAll(async () => {
      app = await setupWithAuth({
        user,
      })
      server = request(app.getHttpServer())

      // Setup models here
      identityConfirmationModel = app.get<typeof IdentityConfirmation>(
        getModelToken(IdentityConfirmation),
      )
      // Setup models here

      factory = new FixtureFactory(app)
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    // Test cases here
  })
})
