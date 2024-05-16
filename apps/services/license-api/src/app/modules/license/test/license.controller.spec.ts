import {
  TestApp,
  TestEndpointOptions,
  getRequestMethod,
} from '@island.is/testing/nest'
import {
  setupWithAuth,
  setupWithoutAuth,
  setupWithoutScope,
} from '../../../../test/setup'
import request from 'supertest'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { LicenseApiScope } from '@island.is/auth/scopes'
import { User } from '@island.is/auth-nest-tools'

describe('UserLicensesController - Without scopes, auth or invalid scopes', () => {
  it.each`
    method      | endpoint
    ${'PUT'}    | ${'/v1/users/.nationalId/licenses/test'}
    ${'DELETE'} | ${'/v1/users/.nationalId/licenses/test'}
  `(
    '$method $endpoint should return 401 when user is unauthorized',
    async ({ method, endpoint }: TestEndpointOptions) => {
      //Arrange
      const app = await setupWithoutAuth()
      const server = request(app.getHttpServer())

      //Act
      const res = await getRequestMethod(server, method)(endpoint)

      //Assert
      expect(res.status).toEqual(401)
      expect(res.body).toMatchObject({
        status: 401,
        title: 'Unauthorized',
        type: 'https://httpstatuses.org/401',
      })

      app.cleanUp()
    },
  )
  it.each`
    method      | endpoint
    ${'PUT'}    | ${'/v1/users/.nationalId/licenses/test'}
    ${'DELETE'} | ${'/v1/users/.nationalId/licenses/test'}
  `(
    '$method $endpoint should return 403 when user has no scope',
    async ({ method, endpoint }: TestEndpointOptions) => {
      //Arrange
      const app = await setupWithoutScope()
      const server = request(app.getHttpServer())

      //Act
      const res = await getRequestMethod(server, method)(endpoint)

      //Assert
      expect(res.status).toEqual(403)
      expect(res.body).toMatchObject({
        status: 403,
        title: 'Forbidden',
        type: 'https://httpstatuses.org/403',
      })

      app.cleanUp()
    },
  )
})
describe('UserLicensesController - with correct auth and scope', () => {
  let app: TestApp
  let user: User
  let server: request.SuperTest<request.Test>
  describe('Update passes - pull', () => {
    it.each`
      method   | endpoint                                       | scope
      ${'PUT'} | ${'/v1/users/.nationalId/licenses/firearm'}    | ${LicenseApiScope.licensesFirearm}
      ${'PUT'} | ${'/v1/users/.nationalId/licenses/disability'} | ${LicenseApiScope.licensesDisability}
    `(
      '$method $endpoint should return 200 ok when scope is $scope',
      async ({ method, endpoint, scope }) => {
        //Arrange
        user = createCurrentUser({
          nationalId: '0101303019',
          scope: [scope],
        })
        app = await setupWithAuth(user)
        server = request(app.getHttpServer())
        //Act
        const res = await getRequestMethod(server, method)(endpoint)
          .set('x-param-nationalid', user.nationalId)
          .send({
            licenseUpdateType: 'pull',
          })

        //Assert
        expect(res.status).toEqual(200)
        app.cleanUp()
      },
    )
  })
  describe('Update passes - push', () => {
    it.each`
      method   | endpoint                                       | scope
      ${'PUT'} | ${'/v1/users/.nationalId/licenses/firearm'}    | ${LicenseApiScope.licensesFirearm}
      ${'PUT'} | ${'/v1/users/.nationalId/licenses/disability'} | ${LicenseApiScope.licensesDisability}
    `(
      '$method $endpoint should return 200 ok when scope is $scope',
      async ({ method, endpoint, scope }) => {
        //Arrange
        user = createCurrentUser({
          nationalId: '0101303019',
          scope: [scope],
        })
        app = await setupWithAuth(user)
        server = request(app.getHttpServer())
        //Act

        const res = await getRequestMethod(server, method)(endpoint)
          .set('x-param-nationalid', user.nationalId)
          .send({
            licenseUpdateType: 'push',
            expiryDate: '2050-01-01T00:00:00',
          })

        //Assert
        expect(res.status).toEqual(200)
        app.cleanUp()
      },
    )
  })
  describe('Delete passes', () => {
    it.each`
      method      | endpoint                                       | scope
      ${'DELETE'} | ${'/v1/users/.nationalId/licenses/firearm'}    | ${LicenseApiScope.licensesFirearm}
      ${'DELETE'} | ${'/v1/users/.nationalId/licenses/disability'} | ${LicenseApiScope.licensesDisability}
    `(
      '$method $endpoint should return 200 ok when scope is $scope',
      async ({ method, endpoint, scope }) => {
        //Arrange
        user = createCurrentUser({
          nationalId: '0101303019',
          scope: [scope],
        })
        app = await setupWithAuth(user)
        server = request(app.getHttpServer())
        //Act

        const res = await getRequestMethod(server, method)(endpoint)
          .set('x-param-nationalid', user.nationalId)
          .send()

        //Assert
        expect(res.status).toEqual(200)
        app.cleanUp()
      },
    )
  })
})

describe('LicenseController - Without scopes, auth or invalid scopes', () => {
  it('POST /v1/licenses/verify should return 401 when user is unauthorized', async () => {
    //Arrange
    const app = await setupWithoutAuth()
    const server = request(app.getHttpServer())

    //Act
    const res: request.Response = await server
      .post('/v1/licenses/verify')
      .send()

    //Assert
    expect(res.status).toEqual(401)
    expect(res.body).toMatchObject({
      status: 401,
      title: 'Unauthorized',
      type: 'https://httpstatuses.org/401',
    })

    app.cleanUp()
  })
  it('POST /v1/licenses/verify should return 403 when user has no scope', async () => {
    //Arrange
    const app = await setupWithoutScope()
    const server = request(app.getHttpServer())

    //Act
    const res: request.Response = await server
      .post('/v1/licenses/verify')
      .send()

    //Assert
    expect(res.status).toEqual(403)
    expect(res.body).toMatchObject({
      status: 403,
      title: 'Forbidden',
      type: 'https://httpstatuses.org/403',
    })

    app.cleanUp()
  })
})
describe('LicenseController - with correct auth and scope', () => {
  let app: TestApp
  let user: User
  let server: request.SuperTest<request.Test>

  it('POST /v1/licenses/verify should 200 ok', async () => {
    //Arrange
    user = createCurrentUser({
      nationalId: '0101303019',
      scope: [LicenseApiScope.licensesVerify],
    })
    app = await setupWithAuth(user)
    server = request(app.getHttpServer())
    //Act

    const res: request.Response = await server
      .post('/v1/licenses/verify')
      .send({
        barcodeData: JSON.stringify({
          dynamicBarcodeData: {
            code: 'test',
            date: '2022-06-28T15:42:11.665950Z',
          },
        }),
      })

    //Assert
    expect(res.status).toEqual(200)
    app.cleanUp()
  })
})
