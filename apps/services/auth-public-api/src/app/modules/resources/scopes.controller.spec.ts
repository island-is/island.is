import request from 'supertest'

import { ApiScope } from '@island.is/auth-api-lib'
import { AuthScope } from '@island.is/auth/scopes'
import { TestApp } from '@island.is/testing/nest'
import {
  createCurrentUser,
  createNationalRegistryUser,
} from '@island.is/testing/fixtures'

import {
  setupWithAuth,
  setupWithoutAuth,
  setupWithoutPermission,
} from '../../../../test/setup'
import { getRequestMethod } from '../../../../test/utils'
import { TestEndpointOptions } from '../../../../test/types'

const scopes = ['@island.is/scope0', '@island.is/scope1']
const user = createCurrentUser({
  nationalId: '1122334455',
  scope: [AuthScope.readDelegations, scopes[0]],
})
const userName = 'Tester Tests'
const nationalRegistryUser = createNationalRegistryUser({
  kennitala: '6677889900',
})

describe('ScopesController', () => {
  describe('withAuth', () => {
    let app: TestApp
    let server: request.SuperTest<request.Test>
    let apiScopeModel: typeof ApiScope

    beforeAll(async () => {
      // TestApp setup with auth and database
      app = await setupWithAuth({
        user,
        userName,
        nationalRegistryUser,
        scopes,
      })
      server = request(app.getHttpServer())

      // Get reference on delegation and delegationScope models to seed DB
      apiScopeModel = app.get<typeof ApiScope>('ApiScopeRepository')
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    describe('GET /scopes', () => {
      it('should return all allowed scopes for user', async () => {
        // Arrange
        const expectedScopes = await apiScopeModel.findAll({
          where: {
            name: scopes[0],
          },
        })

        // Act
        const res = await server.get('/v1/scopes')

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(1)
        expect(res.body).toMatchObject(
          expectedScopes.map((scope) => scope.toDTO()),
        )
      })
    })

    it('should return an empty array when user does not have any allowed scopes', async () => {
      // Arrange
      const app = await setupWithAuth({
        user: {
          ...user,
          scope: [AuthScope.readDelegations],
        },
        userName,
        nationalRegistryUser,
        scopes,
      })

      // Act
      const res = await request(app.getHttpServer()).get('/v1/scopes')

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toHaveLength(0)
    })
  })

  describe('withoutAuth and permissions', () => {
    it.each`
      method   | endpoint
      ${'GET'} | ${'/v1/scopes'}
    `(
      '$method $endpoint should return 401 when user is not authenticated',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupWithoutAuth()
        const server = request(app.getHttpServer())

        // Act
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(401)
        expect(res.body).toMatchObject({
          status: 401,
          type: 'https://httpstatuses.com/401',
          title: 'Unauthorized',
        })

        // CleanUp
        app.cleanUp()
      },
    )

    it.each`
      method   | endpoint
      ${'GET'} | ${'/v1/scopes'}
    `(
      '$method $endpoint should return 403 Forbidden when user does not have the correct scope',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupWithoutPermission()
        const server = request(app.getHttpServer())

        // Act
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(403)
        expect(res.body).toMatchObject({
          status: 403,
          type: 'https://httpstatuses.com/403',
          title: 'Forbidden',
          detail: 'Forbidden resource',
        })

        // CleanUp
        app.cleanUp()
      },
    )
  })
})
