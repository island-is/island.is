import { TestEndpointOptions, getRequestMethod } from '@island.is/testing/nest'
import {
  setupWithAuth,
  setupWithoutAuth,
  setupWithoutScope,
} from '../../../../test/setup'
import request from 'supertest'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { LicenseApiScope } from '@island.is/auth/scopes'
import { startMocking } from '@island.is/shared/mocking'
import { requestHandlers } from './__mock_data/requestHandlers'

startMocking(requestHandlers)

describe('LicenseController - Without scopes, auth or invalid scopes', () => {
  it.each`
    method      | endpoint
    ${'PUT'}    | ${'/users/.nationalId/licenses/test'}
    ${'DELETE'} | ${'/users/.nationalId/licenses/test'}
    ${'POST'}   | ${'/licenses/verify'}
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
    ${'PUT'}    | ${'/users/.nationalId/licenses/test'}
    ${'DELETE'} | ${'/users/.nationalId/licenses/test'}
    ${'POST'}   | ${'/licenses/verify'}
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
describe('LicenseController - with correct auth and scope', () => {
  describe('Update passes - pull', () => {
    it.each`
      method   | endpoint                                    | scope
      ${'PUT'} | ${'/users/.nationalId/licenses/firearm'}    | ${LicenseApiScope.licensesFirearm}
      ${'PUT'} | ${'/users/.nationalId/licenses/disability'} | ${LicenseApiScope.licensesDisability}
    `(
      '$method $endpoint should return 200 ok when scope is $scope',
      async ({ method, endpoint, scope, action }) => {
        //Arrange
        const user = createCurrentUser({ nationalId: '0101303019', scope })
        const app = await setupWithAuth(user)
        const server = request(app.getHttpServer())

        //Act
        const res = await getRequestMethod(server, method)(endpoint)
          .set('x-param-nationalid', user.nationalId)
          .send({ licenseUpdateType: 'pull' })
        console.log(JSON.stringify(res))

        //Assert
        expect(res.status).toEqual(200)
        app.cleanUp()
      },
    )
  })
  describe('Update passes - push', () => {
    it.each`
      method   | endpoint                                    | scope
      ${'PUT'} | ${'/users/.nationalId/licenses/firearm'}    | ${LicenseApiScope.licensesFirearm}
      ${'PUT'} | ${'/users/.nationalId/licenses/disability'} | ${LicenseApiScope.licensesDisability}
    `(
      '$method $endpoint should return 200 ok when scope is $scope',
      async ({ method, endpoint, scope, action }) => {
        //Arrange
        const user = createCurrentUser({ nationalId: '0101303019', scope })
        const app = await setupWithAuth(user)
        const server = request(app.getHttpServer())

        //Act
        const res = await getRequestMethod(server, method)(endpoint)
          .set('x-param-nationalid', user.nationalId)
          .send({
            licenseUpdateType: 'push',
            expiryDate: '1930-01-01T00:00:00',
          })
        console.log(JSON.stringify(res))

        //Assert
        expect(res.status).toEqual(200)
        app.cleanUp()
      },
    )
  })
})
/*
  it.each`
    method      | endpoint                                    | scope
    ${'PUT'}    | ${'/users/.nationalId/licenses/firearm'}    | ${LicenseApiScope.licensesFirearm}
    ${'PUT'}    | ${'/users/.nationalId/licenses/disability'} | ${LicenseApiScope.licensesDisability}
    ${'DELETE'} | ${'/users/.nationalId/licenses/firearm'}    | ${LicenseApiScope.licensesFirearm}
    ${'DELETE'} | ${'/users/.nationalId/licenses/disability'} | ${LicenseApiScope.licensesDisability}
    ${'POST'}   | ${'/licenses/verify'}                       | ${LicenseApiScope.licensesVerify}
  `(
    '$method $endpoint should return 200 ok when scope is $scope',
    async ({ method, endpoint, scope }) => {
      //Arrange
      const user = createCurrentUser({ nationalId: '0101303019', scope })
      const app = await setupWithAuth(user)
      const server = request(app.getHttpServer())

      //Act
      const res = await getRequestMethod(
        server,
        method,
      )(endpoint).set('x-param-nationalid', user.nationalId)
      console.log(JSON.stringify(res))

      //Assert
      expect(res.status).toEqual(200)
      app.cleanUp()
    },
  )*/
