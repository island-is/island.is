import request from 'supertest'

import { User } from '@island.is/auth-nest-tools'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { getRequestMethod, TestApp } from '@island.is/testing/nest'

import { FixtureFactory } from '../../../../test/fixtures/fixture-factory'
import { TestEndpointOptions } from '../../../../test/types'
import {
  setupWithoutAuth,
  setupWithoutPermission,
} from '../../../../test/setup'

describe('withoutAuth and permissions', () => {
  async function formatUrl(app: TestApp, endpoint: string, user?: User) {
    if (!endpoint.includes(':delegation')) {
      return endpoint
    }
    const factory = new FixtureFactory(app)
    const domain = await factory.createDomain({
      apiScopes: [{ name: 's1' }],
    })
    const delegation = await factory.createCustomDelegation({
      fromNationalId: user?.nationalId,
      domainName: domain.name,
      scopes: [{ scopeName: 's1' }],
    })
    return endpoint.replace(':delegation', encodeURIComponent(delegation.id))
  }

  it.each`
    method      | endpoint
    ${'GET'}    | ${'/v1/me/delegations'}
    ${'POST'}   | ${'/v1/me/delegations'}
    ${'GET'}    | ${'/v1/me/delegations/:delegation'}
    ${'PATCH'}  | ${'/v1/me/delegations/:delegation'}
    ${'DELETE'} | ${'/v1/me/delegations/:delegation'}
  `(
    '$method $endpoint should return 401 when user is not authenticated',
    async ({ method, endpoint }: TestEndpointOptions) => {
      // Arrange
      const app = await setupWithoutAuth()
      const server = request(app.getHttpServer())
      const url = await formatUrl(app, endpoint)

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
    method      | endpoint
    ${'GET'}    | ${'/v1/me/delegations'}
    ${'POST'}   | ${'/v1/me/delegations'}
    ${'GET'}    | ${'/v1/me/delegations/:delegation'}
    ${'PATCH'}  | ${'/v1/me/delegations/:delegation'}
    ${'DELETE'} | ${'/v1/me/delegations/:delegation'}
  `(
    '$method $endpoint should return 403 Forbidden when user does not have the correct scope',
    async ({ method, endpoint }: TestEndpointOptions) => {
      // Arrange
      const user = createCurrentUser()
      const app = await setupWithoutPermission({ user })
      const server = request(app.getHttpServer())
      const url = await formatUrl(app, endpoint, user)

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
