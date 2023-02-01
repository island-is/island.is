import request from 'supertest'

import { AuthScope } from '@island.is/auth/scopes'
import { FixtureFactory } from '@island.is/services/auth/testing'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { getRequestMethod, TestApp } from '@island.is/testing/nest'

import {
  setupWithAuth,
  setupWithoutAuth,
  setupWithoutPermission,
} from '../../../test/setup'
import { TestEndpointOptions } from '../../../test/types'

interface TestCase {
  domains: {
    name: string
    description: string
    organisationLogoKey: string
  }[]
  clients: {
    clientId: string
    clientName: string
  }[]
  expected: {
    id: string
    name: string
    organisationLogoKey: string
  }[]
}

const getTestCases: Record<string, TestCase> = {
  'should return all clients': {
    domains: [
      {
        name: 'test-domain-1',
        description: 'Test domain 1',
        organisationLogoKey: 'test-logo-key-1',
      },
      {
        name: 'test-domain-2',
        description: 'Test domain 2',
        organisationLogoKey: 'test-logo-key-2',
      },
    ],
    clients: [
      {
        clientId: 'test-domain-1/test-client-1',
        clientName: 'Test client 1',
      },
      {
        clientId: 'test-domain-2/test-client-2',
        clientName: 'Test client 2',
      },
    ],
    expected: [
      {
        id: 'test-domain-1/test-client-1',
        name: 'Test client 1',
        organisationLogoKey: 'test-logo-key-1',
      },
      {
        id: 'test-domain-2/test-client-2',
        name: 'Test client 2',
        organisationLogoKey: 'test-logo-key-2',
      },
    ],
  },
  'should return empty array when no clients exist': {
    domains: [
      {
        name: 'test-domain-1',
        description: 'Test domain 1',
        organisationLogoKey: 'test-logo-key-1',
      },
    ],
    clients: [],
    expected: [],
  },
}

const user = createCurrentUser({
  scope: [AuthScope.delegations],
})

describe('ClientsController', () => {
  describe('with auth', () => {
    describe.each(Object.keys(getTestCases))(
      'GET /v1/clients %s',
      (caseName) => {
        const testCase = getTestCases[caseName]
        let app: TestApp
        let server: request.SuperTest<request.Test>

        beforeAll(async () => {
          app = await setupWithAuth({ user })
          server = request(app.getHttpServer())

          const fixtureFactory = new FixtureFactory(app)

          await Promise.all(
            Object.values(testCase.domains).map((domain) =>
              fixtureFactory.createDomain(domain),
            ),
          )

          await Promise.all(
            Object.values(testCase.clients).map((client) =>
              fixtureFactory.createClient(client),
            ),
          )
        })

        it('should pass', async () => {
          // Act
          const res = await server.get('/v1/clients')

          // Assert
          expect(res.status).toBe(200)
          expect(res.body).toMatchObject(testCase.expected)
        })
      },
    )
  })

  describe('without auth and permissions', () => {
    it.each`
      method   | endpoint
      ${'GET'} | ${'/v1/clients'}
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
          type: 'https://httpstatuses.org/401',
          title: 'Unauthorized',
        })

        // CleanUp
        app.cleanUp()
      },
    )

    it.each`
      method   | endpoint
      ${'GET'} | ${'/v1/clients'}
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
          type: 'https://httpstatuses.org/403',
          title: 'Forbidden',
          detail: 'Forbidden resource',
        })

        // CleanUp
        app.cleanUp()
      },
    )
  })
})
