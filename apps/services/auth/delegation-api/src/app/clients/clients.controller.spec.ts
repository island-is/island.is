import request from 'supertest'

import { AuthScope } from '@island.is/auth/scopes'
import { FixtureFactory } from '@island.is/services/auth/testing'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { TestEndpointOptions } from '@island.is/testing/nest'
import {
  buildQueryString,
  getRequestMethod,
  TestApp,
} from '@island.is/testing/nest'

import {
  setupWithAuth,
  setupWithoutAuth,
  setupWithoutPermission,
} from '../../../test/setup'

interface TestCase {
  domains: {
    name: string
    description: string
  }[]
  clients: {
    clientId: string
    clientName: string
  }[]
  filters?: {
    clientId?: string[]
  }
  expected: {
    clientId: string
    clientName: string
    domainName: string
  }[]
}

const getTestCases: Record<string, TestCase> = {
  'should return all clients': {
    domains: [
      {
        name: 'test-domain-1',
        description: 'Test domain 1',
      },
      {
        name: 'test-domain-2',
        description: 'Test domain 2',
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
        clientId: 'test-domain-1/test-client-1',
        clientName: 'Test client 1',
        domainName: 'test-domain-1',
      },
      {
        clientId: 'test-domain-2/test-client-2',
        clientName: 'Test client 2',
        domainName: 'test-domain-2',
      },
    ],
  },
  'should filter response by clientIds query param': {
    domains: [
      {
        name: 'test-domain-1',
        description: 'Test domain 1',
      },
      {
        name: 'test-domain-2',
        description: 'Test domain 2',
      },
    ],
    clients: [
      {
        clientId: 'test-domain-1/test-client-1',
        clientName: 'Test client 1',
      },
      {
        clientId: 'test-domain-1/test-client-3',
        clientName: 'Test client 3',
      },
      {
        clientId: 'test-domain-2/test-client-2',
        clientName: 'Test client 2',
      },
    ],
    filters: {
      clientId: ['test-domain-1/test-client-1', 'test-domain-2/test-client-2'],
    },
    expected: [
      {
        clientId: 'test-domain-1/test-client-1',
        clientName: 'Test client 1',
        domainName: 'test-domain-1',
      },
      {
        clientId: 'test-domain-2/test-client-2',
        clientName: 'Test client 2',
        domainName: 'test-domain-2',
      },
    ],
  },
  'should return empty array when no clients exist': {
    domains: [
      {
        name: 'test-domain-1',
        description: 'Test domain 1',
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
          // Arrange
          const query = testCase.filters
            ? buildQueryString(testCase.filters)
            : ''

          // Act
          const res = await server.get(`/v1/clients${query}`)

          // Assert
          expect(res.status).toBe(200)
          expect(res.body).toMatchObject(testCase.expected)
        })
      },
    )

    describe('with translations', () => {
      let app: TestApp
      let server: request.SuperTest<request.Test>

      const domainName = 'd1'
      const clientTranslations = {
        clientName: 'Translated client name',
      }

      beforeAll(async () => {
        // Arrange
        app = await setupWithAuth({
          user: createCurrentUser({ scope: [AuthScope.delegations] }),
        })
        server = request(app.getHttpServer())

        const factory = new FixtureFactory(app)
        await factory.createDomain({ name: domainName })
        const client = await factory.createClient({
          clientId: `${domainName}/c1`,
          domainName,
        })

        await factory.createTranslations(client, 'en', clientTranslations)
      })

      it('GET /clients?lang=en should return translated domains', async () => {
        // Act
        const res = await server.get('/v1/clients?lang=en')

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toMatchObject([clientTranslations])
      })
    })
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
