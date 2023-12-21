import { getModelToken } from '@nestjs/sequelize'
import assert from 'assert'
import startOfDay from 'date-fns/startOfDay'
import addDays from 'date-fns/addDays'
import request, { SuperTest, Test } from 'supertest'

import { ApiScope } from '@island.is/auth/scopes'
import {
  CreateLoginRestrictionDto,
  LoginRestriction,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { TestApp, setupApp } from '@island.is/testing/nest'

import { AppModule } from '../app.module'

const currentUserPhoneNumber = '765-4321'
const cleanCurrentUserPhoneNumber = currentUserPhoneNumber.replace('-', '')
const currentUser = createCurrentUser({
  scope: [ApiScope.internal],
  audkenniSimNumber: currentUserPhoneNumber,
})

describe('MeLoginRestrictionsController', () => {
  let app: TestApp
  let server: SuperTest<Test>
  let loginRestrictionModel: typeof LoginRestriction

  beforeAll(async () => {
    app = await setupApp({
      AppModule,
      SequelizeConfigService,
      user: currentUser,
    })
    server = request(app.getHttpServer())

    loginRestrictionModel = app.get(getModelToken(LoginRestriction))
  })

  beforeEach(async () => {
    await loginRestrictionModel.destroy({ truncate: true })
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  describe('GET /me/login-restrictions', () => {
    it('should return 200 with data when user has restriction set', async () => {
      // Arrange
      const restrictedUntil = startOfDay(addDays(new Date(), 8))
      await loginRestrictionModel.create({
        nationalId: currentUser.nationalId,
        phoneNumber: cleanCurrentUserPhoneNumber,
        restrictedUntil,
      })

      // Act
      const response = await server.get('/v1/me/login-restrictions')

      // Assert
      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        pageInfo: {
          hasNextPage: false,
        },
        totalCount: 1,
        data: [
          {
            nationalId: currentUser.nationalId,
            phoneNumber: cleanCurrentUserPhoneNumber,
            restrictedUntil: restrictedUntil.toISOString(),
          },
        ],
      })
    })

    it('should return empty array when user has no restriction set', async () => {
      // Act
      const response = await server.get('/v1/me/login-restrictions')

      // Assert
      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        pageInfo: {
          hasNextPage: false,
        },
        totalCount: 0,
        data: [],
      })
    })
  })

  describe('PUT /me/login-restrictions', () => {
    it('should return 200 with data when user creates restriction', async () => {
      // Arrange
      const restrictedUntil = startOfDay(addDays(new Date(), 8))

      // Act
      const response = await server.put('/v1/me/login-restrictions').send({
        until: restrictedUntil,
      } as CreateLoginRestrictionDto)

      // Assert - response
      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        nationalId: currentUser.nationalId,
        phoneNumber: cleanCurrentUserPhoneNumber,
        restrictedUntil: restrictedUntil.toISOString(),
      })

      // Assert - database
      const loginRestrictions = await loginRestrictionModel.findAll()
      expect(loginRestrictions.length).toBe(1)
      expect(loginRestrictions[0]).toMatchObject({
        nationalId: currentUser.nationalId,
        phoneNumber: cleanCurrentUserPhoneNumber,
        restrictedUntil,
      })
    })

    it('should return 200 with data when user updates restriction', async () => {
      // Arrange
      const currentRestrictedUntil = startOfDay(addDays(new Date(), 8))
      const currentRestriction = await loginRestrictionModel.create({
        nationalId: currentUser.nationalId,
        phoneNumber: cleanCurrentUserPhoneNumber,
        restrictedUntil: currentRestrictedUntil,
      })
      const newRestrictedUntil = startOfDay(addDays(currentRestrictedUntil, 8))
      assert(currentRestriction)

      // Act
      const response = await server.put('/v1/me/login-restrictions').send({
        until: newRestrictedUntil,
      } as CreateLoginRestrictionDto)

      // Assert - response
      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        nationalId: currentUser.nationalId,
        phoneNumber: cleanCurrentUserPhoneNumber,
        restrictedUntil: newRestrictedUntil.toISOString(),
      })

      // Assert - database
      const loginRestrictions = await loginRestrictionModel.findAll()
      expect(loginRestrictions.length).toBe(1)
      expect(loginRestrictions[0]).toMatchObject({
        nationalId: currentUser.nationalId,
        phoneNumber: cleanCurrentUserPhoneNumber,
        restrictedUntil: newRestrictedUntil,
      })
    })

    it('should return 400 bad request when user access token does not include audkenniSimNumber claim', async () => {
      // Arrange
      const restrictedUntil = startOfDay(addDays(new Date(), 8))
      const app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({
          scope: [ApiScope.internal],
        }),
      })
      const server = request(app.getHttpServer())

      // Act
      const response = await server.put('/v1/me/login-restrictions').send({
        until: restrictedUntil,
      } as CreateLoginRestrictionDto)

      // Assert - response
      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        detail: 'Missing audkenniSimNumber claim in access token',
        status: 400,
        title: 'Bad Request',
        type: 'https://httpstatuses.org/400',
      })
    })

    it('should return 400 bad request when user sets restriction in the past', async () => {
      // Arrange
      const restrictedUntil = startOfDay(new Date())

      // Act
      const response = await server.put('/v1/me/login-restrictions').send({
        until: restrictedUntil,
      } as CreateLoginRestrictionDto)

      // Assert - response
      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        detail: 'Login restriction until date must be in the future',
        status: 400,
        title: 'Bad Request',
        type: 'https://httpstatuses.org/400',
      })
    })
  })

  describe('DELETE /me/login-restrictions', () => {
    it('should return 204 when user deletes restriction that exists and is successfully deleted', async () => {
      // Arrange
      const currentRestrictedUntil = startOfDay(addDays(new Date(), 8))
      await loginRestrictionModel.create({
        nationalId: currentUser.nationalId,
        phoneNumber: cleanCurrentUserPhoneNumber,
        restrictedUntil: currentRestrictedUntil,
      })

      // Act
      const response = await server.delete('/v1/me/login-restrictions')

      // Assert - response
      expect(response.status).toBe(204)

      // Assert - database
      const loginRestrictions = await loginRestrictionModel.findAll()
      expect(loginRestrictions.length).toBe(0)
    })

    it('should return 204 when user tries to delete restriction which does not exist', async () => {
      // Act
      const response = await server.delete('/v1/me/login-restrictions')

      // Assert - response
      expect(response.status).toBe(204)

      // Assert - database
      const loginRestrictions = await loginRestrictionModel.findAll()
      expect(loginRestrictions.length).toBe(0)
    })
  })
})
