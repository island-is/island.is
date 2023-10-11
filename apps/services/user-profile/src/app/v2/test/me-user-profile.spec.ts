import request from 'supertest'

import {
  getRequestMethod,
  TestEndpointOptions,
  setupApp,
  setupAppWithoutAuth,
} from '@island.is/testing/nest'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { UserProfileScope } from '@island.is/auth/scopes'

import { FixtureFactory } from './fixtureFactory'
import { DataStatus } from '../../user-profile/types/dataStatusTypes'
import { AppModule } from '../../app.module'
import { SequelizeConfigService } from '../../sequelizeConfig.service'

const testUserProfile = {
  nationalId: '1234567890',
  email: 'test@test.is',
  mobilePhoneNumber: '1234567',
}
describe('MeUserProfile', () => {
  describe('Auth and scopes', () => {
    it.each`
      method   | endpoint
      ${'GET'} | ${'/v2/me'}
    `(
      '$method $endpoint should return 401 when user is not authenticated',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange

        const app = await setupAppWithoutAuth({
          AppModule: AppModule,
          SequelizeConfigService: SequelizeConfigService,
        })

        const server = request(app.getHttpServer())

        // Act
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(401)
        expect(res.body).toMatchObject({
          statusCode: 401,
          message: 'Unauthorized',
        })

        await app.cleanUp()
      },
    )

    it.each`
      method   | endpoint
      ${'GET'} | ${'/v2/me'}
    `(
      '$method $endpoint should return 403 Forbidden when user does not have the correct scope',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupApp({
          AppModule,
          SequelizeConfigService,
          user: createCurrentUser(),
        })

        const server = request(app.getHttpServer())

        // Act
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(403)
        expect(res.body).toMatchObject({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Forbidden resource',
        })

        await app.cleanUp()
      },
    )

    it.each`
      method   | endpoint
      ${'GET'} | ${'/v2/me'}
    `(
      '$method $endpoint should return 200 with default UserProfileDto when the User Profile does not exist in db',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupApp({
          AppModule,
          SequelizeConfigService,
          user: createCurrentUser({
            nationalId: testUserProfile.nationalId,
            scope: [UserProfileScope.read],
          }),
        })

        const server = request(app.getHttpServer())

        // Act
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toMatchObject({
          nationalId: testUserProfile.nationalId,
          email: null,
          emailStatus: DataStatus.NOT_DEFINED,
          emailVerified: false,
          mobilePhoneNumber: null,
          mobilePhoneNumberVerified: false,
          mobileStatus: DataStatus.NOT_DEFINED,
          locale: null,
          profileImageUrl: null,
          documentNotifications: true,
        })

        await app.cleanUp()
      },
    )

    it.each`
      method   | endpoint
      ${'GET'} | ${'/v2/me'}
    `(
      '$method $endpoint should return 200 with UserProfileDto for logged in user',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupApp({
          AppModule,
          SequelizeConfigService,
          user: createCurrentUser({
            nationalId: testUserProfile.nationalId,
            scope: [UserProfileScope.read],
          }),
        })

        const fixtureFactory = new FixtureFactory(app)

        await fixtureFactory.createUserProfile(testUserProfile)

        const server = request(app.getHttpServer())

        // Act
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toMatchObject({
          nationalId: testUserProfile.nationalId,
          email: testUserProfile.email,
          emailStatus: DataStatus.NOT_DEFINED,
          emailVerified: false,
          mobilePhoneNumber: testUserProfile.mobilePhoneNumber,
          mobilePhoneNumberVerified: false,
          mobileStatus: DataStatus.NOT_DEFINED,
        })

        await app.cleanUp()
      },
    )
  })
})
