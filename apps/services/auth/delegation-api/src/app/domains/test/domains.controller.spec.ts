import assert from 'assert'
import differenceWith from 'lodash/differenceWith'
import request from 'supertest'

import { TestApp } from '@island.is/testing/nest'

import {
  setupWithAuth,
  setupWithoutAuth,
  setupWithoutPermission,
} from '../../../../test/setup'
import { TestEndpointOptions } from '../../../../test/types'
import { FixtureFactory } from '../../../../test/fixtures/fixture-factory'
import { getRequestMethod } from '../../../../test/utils'
import { testCases } from './test-cases'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { AuthScope } from '@island.is/auth/scopes'
import shuffle from 'lodash/shuffle'

describe('DomainsController', () => {
  describe('withAuth', () => {
    describe.each(Object.keys(testCases))('with test case: %s', (caseName) => {
      const testCase = testCases[caseName]
      const validDomains = testCase.expected.map((domain) => domain.name)
      const invalidDomains = differenceWith(
        testCase.domains,
        testCase.expected,
        (a, b) => a.name === b.name,
      ).map((domain) => domain.name)
      let app: TestApp
      let server: request.SuperTest<request.Test>

      beforeAll(async () => {
        // Arrange
        app = await setupWithAuth({
          user: testCase.user,
          customScopeRules: testCase.customScopeRules,
        })
        server = request(app.getHttpServer())

        const factory = new FixtureFactory(app)
        await Promise.all(
          testCase.domains.map((domain) => factory.createDomain(domain)),
        )
        await Promise.all(
          (testCase.accessTo ?? []).map((scope) =>
            factory.createApiScopeUserAccess({
              nationalId: testCase.user.nationalId,
              scope,
            }),
          ),
        )
        await Promise.all(
          (testCase.delegations ?? []).map((delegation) =>
            factory.createCustomDelegation({
              fromNationalId: testCase.user.nationalId,
              toNationalId: testCase.user.actor?.nationalId,
              ...delegation,
            }),
          ),
        )
      })

      it('GET /domains returns expected domains', async () => {
        // Arrange
        const expected = testCase.expected.map(({ name }) => ({
          name,
        }))

        // Act
        const res = await server.get('/v1/domains')

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(testCase.expected.length)
        expect(res.body).toMatchObject(expected)
      })

      if (validDomains.length) {
        it.each(validDomains)(
          'GET /domains/%s returns expected domains',
          async (domainName) => {
            // Arrange
            const domain = testCase.expected.find(
              (domain) => domain.name === domainName,
            )
            assert(domain)
            const expected = { name: domain.name }

            // Act
            const res = await server.get(`/v1/domains/${domainName}`)

            // Assert
            expect(res.status).toEqual(200)
            expect(res.body).toMatchObject(expected)
          },
        )

        it.each(validDomains)(
          'GET /domains/%s/scopes returns expected scopes',
          async (domainName) => {
            // Arrange
            const domain = testCase.expected.find(
              (domain) => domain.name === domainName,
            )
            assert(domain)
            const expected = domain.scopes

            // Act
            const res = await server.get(`/v1/domains/${domainName}/scopes`)

            // Assert
            expect(res.status).toEqual(200)
            expect(res.body).toHaveLength(expected.length)
            expect(res.body).toMatchObject(expected)
          },
        )

        it.each(validDomains)(
          'GET /domains/%s/scope-tree returns expected scope tree',
          async (domainName) => {
            // Arrange
            const domain = testCase.expected.find(
              (domain) => domain.name === domainName,
            )
            assert(domain)
            const expected = domain.scopes

            // Act
            const res = await server.get(`/v1/domains/${domainName}/scope-tree`)

            // Assert
            expect(res.status).toEqual(200)
            expect(res.body).toHaveLength(expected.length)
            expect(res.body).toMatchObject(expected)
          },
        )
      }

      if (invalidDomains.length) {
        it.each(invalidDomains)(
          'GET /domains/%s returns unexpected domains',
          async (domainName) => {
            // Act
            const res = await server.get(`/v1/domains/${domainName}`)

            // Assert
            expect(res.status).toEqual(204)
          },
        )

        it.each(invalidDomains)(
          'GET /domains/%s/scope-tree returns no results',
          async (domainName) => {
            // Act
            const res = await server.get(`/v1/domains/${domainName}/scope-tree`)

            // Assert
            expect(res.status).toEqual(200)
            expect(res.body).toHaveLength(0)
          },
        )

        it.each(invalidDomains)(
          'GET /domains/%s/scopes returns no results',
          async (domainName) => {
            // Act
            const res = await server.get(`/v1/domains/${domainName}/scopes`)

            // Assert
            expect(res.status).toEqual(200)
            expect(res.body).toHaveLength(0)
          },
        )
      }
    })

    describe('with translations', () => {
      let app: TestApp
      let server: request.SuperTest<request.Test>
      const domainName = 'd1'
      const domainTranslations = {
        displayName: 'Translated domain display name',
        description: 'Translated domain description',
      }
      const scopeTranslations = {
        displayName: 'Translated scope display name',
        description: 'Translated scope description',
      }
      const groupTranslations = {
        displayName: 'Translated group display name',
        description: 'Translated group description',
      }

      beforeAll(async () => {
        // Arrange
        app = await setupWithAuth({
          user: createCurrentUser({ scope: [AuthScope.delegations] }),
        })
        server = request(app.getHttpServer())

        const factory = new FixtureFactory(app)
        const domain = await factory.createDomain({ name: domainName })
        const group = await factory.createApiScopeGroup()
        const scope = await factory.createApiScope({
          domainName,
          groupId: group.id,
          allowExplicitDelegationGrant: true,
        })
        await factory.createTranslations(domain, 'en', domainTranslations)
        await factory.createTranslations(group, 'en', groupTranslations)
        await factory.createTranslations(scope, 'en', scopeTranslations)
      })

      it('GET /domains?lang=en should return translated domains', async () => {
        // Act
        const res = await server.get('/v1/domains?lang=en')

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toMatchObject([domainTranslations])
      })

      it(`GET /domains/${domainName}?lang=en should return translated domain`, async () => {
        // Act
        const res = await server.get(`/v1/domains/${domainName}?lang=en`)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toMatchObject(domainTranslations)
      })

      it(`GET /domains/${domainName}/scopes?lang=en should return translated scopes and groups`, async () => {
        // Act
        const res = await server.get(`/v1/domains/${domainName}/scopes?lang=en`)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toMatchObject([
          { ...scopeTranslations, group: { ...groupTranslations } },
        ])
      })

      it(`GET /domains/${domainName}/scope-tree?lang=en should return translated scopes and groups`, async () => {
        // Act
        const res = await server.get(
          `/v1/domains/${domainName}/scope-tree?lang=en`,
        )

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toMatchObject([
          { ...groupTranslations, children: [{ ...scopeTranslations }] },
        ])
      })
    })

    it('GET /domains/:domainName/scope-tree should correctly sort scopes and groups', async () => {
      // Arrange
      const app = await setupWithAuth({
        user: createCurrentUser({ scope: [AuthScope.delegations] }),
      })
      const factory = new FixtureFactory(app)
      const domainName = 'd1'
      await factory.createDomain({ name: domainName })
      const models = [
        { name: 't1', order: 1, allowExplicitDelegationGrant: true },
        {
          name: 't2',
          order: 2,
          apiScopes: [
            { name: 't2.2', order: 2, allowExplicitDelegationGrant: true },
            { name: 't2.5', order: 5, allowExplicitDelegationGrant: true },
          ],
        },
        { name: 't3', order: 3, allowExplicitDelegationGrant: true },
        {
          name: 't4',
          order: 4,
          apiScopes: [
            { name: 't4.1', order: 1, allowExplicitDelegationGrant: true },
          ],
        },
      ]
      for (const model of shuffle(models)) {
        if (model.apiScopes) {
          await factory.createApiScopeGroup({
            ...model,
            domainName,
            apiScopes: shuffle(model.apiScopes),
          })
        } else {
          await factory.createApiScope({ ...model, domainName })
        }
      }
      const expected = models.map(({ name, apiScopes }) => ({
        name,
        ...(apiScopes
          ? { children: apiScopes.map(({ name }) => ({ name })) }
          : {}),
      }))

      // Act
      const res = await request(app.getHttpServer()).get(
        `/v1/domains/${domainName}/scope-tree`,
      )

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject(expected)
    })
  })

  describe('withoutAuth and permissions', () => {
    async function formatUrl(app: TestApp, endpoint: string) {
      if (!endpoint.includes(':domain')) {
        return endpoint
      }
      const factory = new FixtureFactory(app)
      const domain = await factory.createDomain()
      return endpoint.replace(':domain', encodeURIComponent(domain.name))
    }

    it.each`
      method   | endpoint
      ${'GET'} | ${'/v1/domains'}
      ${'GET'} | ${'/v1/domains/:domain'}
      ${'GET'} | ${'/v1/domains/:domain/scope-tree'}
      ${'GET'} | ${'/v1/domains/:domain/scopes'}
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
      method   | endpoint
      ${'GET'} | ${'/v1/domains'}
      ${'GET'} | ${'/v1/domains/:domain'}
      ${'GET'} | ${'/v1/domains/:domain/scope-tree'}
      ${'GET'} | ${'/v1/domains/:domain/scopes'}
    `(
      '$method $endpoint should return 403 Forbidden when user does not have the correct scope',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupWithoutPermission()
        const server = request(app.getHttpServer())
        const url = await formatUrl(app, endpoint)

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
})
