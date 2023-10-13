import request from 'supertest'

import {
  getRequestMethod,
  setupApp,
  setupAppWithoutAuth,
  TestEndpointOptions,
} from '@island.is/testing/nest'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { UserProfileScope } from '@island.is/auth/scopes'

import { FixtureFactory } from './fixtureFactory'
import { DataStatus } from '../../user-profile/types/dataStatusTypes'
import { UserProfile } from '../userProfileV2.model'
import { getModelToken } from '@nestjs/sequelize'
import { AppModule } from '../../app.module'
import { SequelizeConfigService } from '../../sequelizeConfig.service'

const testUserProfile = {
  nationalId: '1234567890',
  email: 'test@test.is',
  mobilePhoneNumber: '1234567',
}

const newEmail = 'test1234@test.is'
const newPhoneNumber = '9876543'

const testEmailVerification = {
  nationalId: testUserProfile.nationalId,
  email: testUserProfile.email,
  hash: '123',
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

  describe('PATCH user-profile', () => {
    it.each`
      method     | endpoint
      ${'PATCH'} | ${'/v2/me'}
    `(
      '$method $endpoint should return 201 with changed data in response',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupApp({
          AppModule,
          SequelizeConfigService,
          user: createCurrentUser({
            nationalId: testUserProfile.nationalId,
            scope: [UserProfileScope.read, UserProfileScope.write],
          }),
        })

        const fixtureFactory = new FixtureFactory(app)

        await fixtureFactory.createUserProfile(testUserProfile)

        const server = request(app.getHttpServer())

        // Act
        // const res = await getRequestMethod(server, method)(endpoint)
        const res = await server.patch(endpoint).send({
          email: newEmail,
          mobilePhoneNumber: newPhoneNumber,
        })

        // Assert
        expect(res.status).toEqual(201)
        expect(res.body).toMatchObject({
          email: newEmail,
          emailStatus: DataStatus.NOT_VERIFIED,
          emailVerified: false,
          mobilePhoneNumber: newPhoneNumber,
          mobilePhoneNumberVerified: false,
          mobileStatus: DataStatus.NOT_VERIFIED,
        })

        // Assert Db records
        const userProfileModel = app.get(getModelToken(UserProfile))
        const userProfile = await userProfileModel.findOne({
          where: { nationalId: testUserProfile.nationalId },
        })

        expect(userProfile.email).toBe(newEmail)
        expect(userProfile.mobilePhoneNumber).toBe(newPhoneNumber)

        await app.cleanUp()
      },
    )
    it.each`
      method     | endpoint
      ${'PATCH'} | ${'/v2/me'}
    `(
      '$method $endpoint should return 201 with only email changed data in response',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupApp({
          AppModule,
          SequelizeConfigService,
          user: createCurrentUser({
            nationalId: testUserProfile.nationalId,
            scope: [UserProfileScope.read, UserProfileScope.write],
          }),
        })

        const fixtureFactory = new FixtureFactory(app)

        await fixtureFactory.createUserProfile(testUserProfile)

        const server = request(app.getHttpServer())

        // Act
        // const res = await getRequestMethod(server, method)(endpoint)
        const res = await server.patch(endpoint).send({
          email: newEmail,
        })

        // Assert
        expect(res.status).toEqual(201)
        expect(res.body).toMatchObject({
          email: newEmail,
          emailStatus: DataStatus.NOT_VERIFIED,
          emailVerified: false,
        })

        // Assert Db records
        const userProfileModel = app.get(getModelToken(UserProfile))
        const userProfile = await userProfileModel.findOne({
          where: { nationalId: testUserProfile.nationalId },
        })

        expect(userProfile.email).toBe(newEmail)
        expect(userProfile.mobilePhoneNumber).toBe(
          testUserProfile.mobilePhoneNumber,
        )

        await app.cleanUp()
      },
    )

    it.each`
      method     | endpoint
      ${'PATCH'} | ${'/v2/me'}
    `(
      '$method $endpoint should return 201 with only phoneNumber changed data in response',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupApp({
          AppModule,
          SequelizeConfigService,
          user: createCurrentUser({
            nationalId: testUserProfile.nationalId,
            scope: [UserProfileScope.read, UserProfileScope.write],
          }),
        })

        const fixtureFactory = new FixtureFactory(app)

        await fixtureFactory.createUserProfile(testUserProfile)

        const server = request(app.getHttpServer())

        // Act
        // const res = await getRequestMethod(server, method)(endpoint)
        const res = await server.patch(endpoint).send({
          mobilePhoneNumber: newPhoneNumber,
        })

        // Assert
        expect(res.status).toEqual(201)
        expect(res.body).toMatchObject({
          mobilePhoneNumber: newPhoneNumber,
          mobilePhoneNumberVerified: false,
          mobileStatus: DataStatus.NOT_VERIFIED,
        })

        // Assert Db records
        const userProfileModel = app.get(getModelToken(UserProfile))
        const userProfile = await userProfileModel.findOne({
          where: { nationalId: testUserProfile.nationalId },
        })

        expect(userProfile.email).toBe(testUserProfile.email)
        expect(userProfile.mobilePhoneNumber).toBe(newPhoneNumber)

        await app.cleanUp()
      },
    )

    it.each`
      method     | endpoint
      ${'PATCH'} | ${'/v2/me'}
    `(
      '$method $endpoint should return 201 and clear email and phoneNumber when empty string is sent',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupApp({
          AppModule,
          SequelizeConfigService,
          user: createCurrentUser({
            nationalId: testUserProfile.nationalId,
            scope: [UserProfileScope.read, UserProfileScope.write],
          }),
        })

        const fixtureFactory = new FixtureFactory(app)

        await fixtureFactory.createUserProfile(testUserProfile)

        const server = request(app.getHttpServer())

        // Act
        // const res = await getRequestMethod(server, method)(endpoint)
        const res = await server.patch(endpoint).send({
          mobilePhoneNumber: '',
          email: '',
        })

        // Assert
        expect(res.status).toEqual(201)
        expect(res.body).toMatchObject({
          mobilePhoneNumber: '',
          mobilePhoneNumberVerified: false,
          mobileStatus: DataStatus.EMPTY,
          email: '',
          emailStatus: DataStatus.EMPTY,
          emailVerified: false,
        })

        // Assert Db records
        const userProfileModel = app.get(getModelToken(UserProfile))
        const userProfile = await userProfileModel.findOne({
          where: { nationalId: testUserProfile.nationalId },
        })

        expect(userProfile.email).toBe('')
        expect(userProfile.mobilePhoneNumber).toBe('')

        await app.cleanUp()
      },
    )
  })

  describe('Nudge confirmation', () => {
    it.each`
      method    | endpoint
      ${'POST'} | ${'/v2/me/confirm'}
    `(
      '$method $endpoint should return 201 and update the lastNudge field when user confirms nudge',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupApp({
          AppModule,
          SequelizeConfigService,
          user: createCurrentUser({
            nationalId: testUserProfile.nationalId,
            scope: [UserProfileScope.read, UserProfileScope.write],
          }),
        })

        const fixtureFactory = new FixtureFactory(app)

        await fixtureFactory.createUserProfile(testUserProfile)

        const server = request(app.getHttpServer())

        // Act
        // const res = await getRequestMethod(server, method)(endpoint)
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(201)

        // Assert that lastNudge is updated
        const userProfileModel = app.get(getModelToken(UserProfile))
        const userProfile = await userProfileModel.findOne({
          where: { nationalId: testUserProfile.nationalId },
        })

        expect(userProfile.lastNudge).not.toBeNull()

        await app.cleanUp()
      },
    )
  })
})
