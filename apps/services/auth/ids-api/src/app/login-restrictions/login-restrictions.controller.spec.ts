import { getModelToken } from '@nestjs/sequelize'
import startOfDay from 'date-fns/startOfDay'
import addDays from 'date-fns/addDays'
import request from 'supertest'

import {
  LoginRestriction,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'
import { createCurrentUser } from '@island.is/testing/fixtures'
import {
  getRequestMethod,
  setupApp,
  setupAppWithoutAuth,
  TestApp,
  TestEndpointOptions,
} from '@island.is/testing/nest'

import { defaultScopes, setupWithAuth } from '../../../test/setup'
import { AppModule } from '../app.module'

describe('LoginRestrictionsController', () => {
  describe('with auth', () => {
    let app: TestApp
    let server: request.SuperTest<request.Test>
    let loginRestrictionModel: typeof LoginRestriction

    const userPhoneNumber = '765-4321'
    const user = createCurrentUser({
      scope: [defaultScopes.testUserHasAccess.name],
    })
    // As the IDS doesn't know the user nationalId when calling the login-restrictions endpoint we set empty nationalId
    user.nationalId = ''

    beforeAll(async () => {
      app = await setupWithAuth({
        user: user,
      })
      server = request(app.getHttpServer())

      loginRestrictionModel = app.get(getModelToken(LoginRestriction))
    })

    beforeEach(async () => {
      await loginRestrictionModel.destroy({
        where: {},
        truncate: true,
        force: true,
        logging: false,
      })
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    describe('GET /login-restrictions/.phone-number', () => {
      const path = '/v1/login-restrictions/.phone-number'

      it('should return 200 and empty object if user has no restrictions', async () => {
        // Act
        const response = await server
          .get(path)
          .set('X-Param-Phone-Number', userPhoneNumber)

        // Assert
        expect(response.status).toBe(200)
        expect(response.body).toEqual({})
      })

      it('should return 200 and a restriction object if user has a restriction by phone number', async () => {
        // Arrange
        const loginRestriction = await loginRestrictionModel.create({
          nationalId: '1234567890',
          phoneNumber: userPhoneNumber.replace('-', ''),
          until: startOfDay(addDays(new Date(), 8)),
        })

        // Act
        const response = await server
          .get(path)
          .set('X-Param-Phone-Number', userPhoneNumber)

        // Assert
        expect(response.status).toBe(200)
        expect(response.body).toEqual({
          nationalId: loginRestriction.nationalId,
          phoneNumber: loginRestriction.phoneNumber,
          until: loginRestriction.until.toISOString(),
        })
      })

      it.each`
        phoneNumber
        ${''}
        ${'1234567'}
        ${'12345678901234567890'}
        ${'123abcd'}
        ${'+4543218765'}
      `(
        'should return 400 Bad Request for invalid phone number $phoneNumber',
        async (phoneNumber) => {
          // Arrange
          await loginRestrictionModel.create({
            nationalId: '1234567890',
            phoneNumber: userPhoneNumber.replace('-', ''),
            until: startOfDay(addDays(new Date(), 8)),
          })

          // Act
          const response = await server
            .get(path)
            .set('X-Param-Phone-Number', phoneNumber)

          // Assert
          expect(response.status).toBe(400)
          expect(response.body).toEqual({
            status: 400,
            type: 'https://httpstatuses.org/400',
            title: 'Bad Request',
            detail: 'Phone number must be provided and valid Icelandic',
          })
        },
      )
    })

    describe('GET /login-restrictions', () => {
      const path = '/v1/login-restrictions'

      it('should return 200 and empty array if user has no restrictions', async () => {
        // Act
        const response = await server
          .get(path)
          .set('X-Query-Phone-Number', userPhoneNumber)

        // Assert
        expect(response.status).toBe(200)
        expect(response.body).toEqual([])
      })

      it('should return 200 and array of restrictions if user has restrictions', async () => {
        // Arrange
        const loginRestriction = await loginRestrictionModel.create({
          nationalId: '1234567890',
          phoneNumber: userPhoneNumber.replace('-', ''),
          until: startOfDay(addDays(new Date(), 8)),
        })

        // Act
        const response = await server
          .get(path)
          .set('X-Query-Phone-Number', userPhoneNumber)

        // Assert
        expect(response.status).toBe(200)
        expect(response.body).toEqual([
          {
            nationalId: loginRestriction.nationalId,
            phoneNumber: loginRestriction.phoneNumber,
            until: loginRestriction.until.toISOString(),
          },
        ])
      })

      it.each`
        phoneNumber
        ${''}
        ${'1234567'}
        ${'12345678901234567890'}
        ${'123abcd'}
        ${'+4543218765'}
      `(
        'should return 400 Bad Request for invalid phone number $phoneNumber',
        async (phoneNumber) => {
          // Arrange
          await loginRestrictionModel.create({
            nationalId: '1234567890',
            phoneNumber: userPhoneNumber.replace('-', ''),
            until: startOfDay(addDays(new Date(), 8)),
          })

          // Act
          const response = await server
            .get(path)
            .set('X-Query-Phone-Number', phoneNumber)

          // Assert
          expect(response.status).toBe(400)
          expect(response.body).toEqual({
            status: 400,
            type: 'https://httpstatuses.org/400',
            title: 'Bad Request',
            detail: 'Phone number must be provided and valid Icelandic',
          })
        },
      )
    })
  })

  describe('withoutAuth and permissions', () => {
    it.each`
      method   | endpoint
      ${'GET'} | ${'/v1/login-restrictions/.phone-number'}
    `(
      '$method $endpoint should return 401 when request is not authenticated',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupAppWithoutAuth({
          AppModule,
          SequelizeConfigService,
        })
        const server = request(app.getHttpServer())

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
      },
    )

    it.each`
      method   | endpoint
      ${'GET'} | ${'/v1/login-restrictions/.phone-number'}
    `(
      '$method $endpoint should return 403 Forbidden when user does not have the correct scope',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const user = createCurrentUser()
        const app = await setupApp({ AppModule, SequelizeConfigService, user })
        const server = request(app.getHttpServer())

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
      },
    )
  })
})
