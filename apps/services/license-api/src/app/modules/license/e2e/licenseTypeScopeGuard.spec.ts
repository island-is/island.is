import { TestEndpointOptions, getRequestMethod } from '@island.is/testing/nest'
import {
  setupWithAuth,
  setupWithoutAuth,
  setupWithoutScope,
} from '../../../../test/setup'
import request from 'supertest'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { LicenseApiScope } from '@island.is/auth/scopes'

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

  it.each`
    method      | endpoint                                    | scope
    ${'PUT'}    | ${'/users/.nationalId/licenses/firearm'}    | ${LicenseApiScope.licensesDisability}
    ${'PUT'}    | ${'/users/.nationalId/licenses/disability'} | ${LicenseApiScope.licensesFirearm}
    ${'DELETE'} | ${'/users/.nationalId/licenses/firearm'}    | ${LicenseApiScope.licensesDisability}
    ${'DELETE'} | ${'/users/.nationalId/licenses/disability'} | ${LicenseApiScope.licensesFirearm}
    ${'POST'}   | ${'/licenses/verify'}                       | ${LicenseApiScope.licensesFirearm}
  `(
    '$method $endpoint should return 403 when scope is $scope',
    async ({ method, endpoint, scope }) => {
      //Arrange
      const user = createCurrentUser({ nationalId: '3333333333', scope })
      const app = await setupWithAuth(user)
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
