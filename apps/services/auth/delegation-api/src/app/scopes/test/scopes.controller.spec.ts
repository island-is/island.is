import faker from 'faker'
import shuffle from 'lodash/shuffle'
import request from 'supertest'

import { ScopeTreeDTO } from '@island.is/auth-api-lib'
import { AuthScope } from '@island.is/auth/scopes'
import { FixtureFactory } from '@island.is/services/auth/testing'
import { createCurrentUser } from '@island.is/testing/fixtures'
import {
  getRequestMethod,
  TestApp,
  TestEndpointOptions,
} from '@island.is/testing/nest'

import {
  setupWithAuth,
  setupWithoutAuth,
  setupWithoutPermission,
} from '../../../../test/setup'

describe('ScopesController', () => {
  describe('withAuth', () => {
    let app: TestApp
    let server: request.SuperTest<request.Test>
    const apiScopes = ['s1', 's2', 's3']
    const identityResources = ['i1', 'i2', 'i3']

    beforeAll(async () => {
      // Arrange
      app = await setupWithAuth({
        user: createCurrentUser({
          scope: [AuthScope.consents],
        }),
      })
      server = request(app.getHttpServer())

      const factory = new FixtureFactory(app)

      await Promise.all(
        apiScopes.map((s) => factory.createApiScope({ name: s })),
      )

      await Promise.all(
        identityResources.map((s) =>
          factory.createIdentityResource({ name: s }),
        ),
      )
    })

    it('GET /scopes/scope-tree returns requested scopes', async () => {
      const requestedScopes = ['s1', 'i2']

      // Act
      const res = await server.get(
        `/v1/scopes/scope-tree?${requestedScopes
          .map((s) => 'requestedScopes=' + s)
          .join('&')}`,
      )

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toHaveLength(requestedScopes.length)
      expect(res.body.map((s: ScopeTreeDTO) => s.name)).toMatchObject(
        requestedScopes,
      )
    })

    describe('with translations', () => {
      let app: TestApp
      let server: request.SuperTest<request.Test>
      const scopeTranslations = {
        displayName: 'Translated scope display name',
        description: 'Translated scope description',
      }
      const groupTranslations = {
        displayName: 'Translated group display name',
        description: 'Translated group description',
      }
      const scopeName = 'ts1'

      beforeAll(async () => {
        app = await setupWithAuth({
          user: createCurrentUser({ scope: [AuthScope.consents] }),
        })
        server = request(app.getHttpServer())

        const factory = new FixtureFactory(app)
        const group = await factory.createApiScopeGroup()
        const scope = await factory.createApiScope({
          name: scopeName,
          groupId: group.id,
        })
        await factory.createTranslations(group, 'en', groupTranslations)
        await factory.createTranslations(scope, 'en', scopeTranslations)
      })

      it(`GET /scopes/scope-tree?lang=en should return translated scopes and groups`, async () => {
        // Act
        const res = await server.get(
          `/v1/scopes/scope-tree?requestedScopes=${scopeName}&lang=en`,
        )

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toMatchObject([
          { ...groupTranslations, children: [{ ...scopeTranslations }] },
        ])
      })
    })

    it('GET /scopes/scope-tree should correctly sort scopes and groups', async () => {
      // Arrange
      const app = await setupWithAuth({
        user: createCurrentUser({ scope: [AuthScope.consents] }),
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
            { name: 't2.2', order: 2 },
            { name: 't2.5', order: 5 },
          ],
        },
        { name: 't3', order: 3 },
        {
          name: 't4',
          order: 4,
          apiScopes: [{ name: 't4.1', order: 1 }],
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
        `/v1/scopes/scope-tree?${[
          't1',
          't2',
          't2.2',
          't2.5',
          't3',
          't4',
          't4.1',
        ]
          .map((s) => 'requestedScopes=' + s)
          .join('&')}`,
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
      const domain = await factory.createDomain({ name: faker.random.word() })
      return endpoint.replace(':domain', encodeURIComponent(domain.name))
    }

    it.each`
      method   | endpoint
      ${'GET'} | ${'/v1/scopes/scope-tree'}
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
      ${'GET'} | ${'/v1/scopes/scope-tree'}
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
