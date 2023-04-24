import faker from 'faker'
import request from 'supertest'

import { AdminPortalScope } from '@island.is/auth/scopes'
import {
  AdminPatchClientDto,
  Client,
  clientBaseAttributes,
  ClientGrantType,
  RefreshTokenExpiration,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'
import { User } from '@island.is/auth-nest-tools'
import { FixtureFactory } from '@island.is/services/auth/testing'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { getRequestMethod, setupApp, TestApp } from '@island.is/testing/nest'

import { AppModule } from '../../../app.module'
import { getModelToken } from '@nestjs/sequelize'

const tenantId = '@test.is'
const clientId = '@test.is/test-client'

const createTestClientData = async (app: TestApp, user: User) => {
  const fixtureFactory = new FixtureFactory(app)
  await fixtureFactory.createDomain({
    name: tenantId,
    nationalId: user.nationalId,
  })
  const client = await fixtureFactory.createClient({
    ...clientBaseAttributes,
    clientId: clientId,
    domainName: tenantId,
    redirectUris: [faker.internet.url()],
    postLogoutRedirectUris: [faker.internet.url()],
    allowedGrantTypes: [],
    claims: [{ type: faker.random.word(), value: faker.random.word() }],
  })
  const [translation] = await fixtureFactory.createTranslations(client, 'en', {
    clientName: faker.random.word(),
  })

  return {
    clientId: client.clientId,
    clientType: client.clientType,
    tenantId: client.domainName ?? '',
    absoluteRefreshTokenLifetime: client.absoluteRefreshTokenLifetime,
    slidingRefreshTokenLifetime: client.slidingRefreshTokenLifetime,
    accessTokenLifetime: client.accessTokenLifetime,
    allowOfflineAccess: client.allowOfflineAccess,
    customClaims: client.claims?.map(
      (claim) => ({ type: claim.type, value: claim.value } ?? []),
    ),
    displayName: [
      {
        locale: 'is',
        value: client.clientName ?? '',
      },
      {
        locale: translation.language,
        value: translation.value ?? '',
      },
    ],
    redirectUris:
      client.redirectUris?.map((redirectUri) => redirectUri.redirectUri) ?? [],
    postLogoutRedirectUris:
      client.postLogoutRedirectUris?.map(
        (postLogoutRedirectUri) => postLogoutRedirectUri.redirectUri,
      ) ?? [],
    refreshTokenExpiration: RefreshTokenExpiration.Absolute,
    requireApiScopes: false,
    requireConsent: false,
    requirePkce: true,
    supportTokenExchange: false,
    supportsCustomDelegation: false,
    supportsLegalGuardians: false,
    supportsPersonalRepresentatives: false,
    supportsProcuringHolders: false,
    promptDelegations: false,
  }
}

describe('MeClientsController with auth', () => {
  const user = createCurrentUser({ scope: [AdminPortalScope.idsAdmin] })
  const otherUser = createCurrentUser({ scope: [AdminPortalScope.idsAdmin] })
  const superUser = createCurrentUser({
    scope: [AdminPortalScope.idsAdminSuperUser],
  })

  describe('with tenant id that user does not own', () => {
    it.each`
      method     | endpoint
      ${'GET'}   | ${`/v2/me/tenants/${tenantId}/clients`}
      ${'GET'}   | ${`/v2/me/tenants/${tenantId}/clients/${encodeURIComponent(clientId)}`}
      ${'POST'}  | ${`/v2/me/tenants/${tenantId}/clients`}
      ${'PATCH'} | ${`/v2/me/tenants/${tenantId}/clients/${encodeURIComponent(clientId)}`}
    `(
      '$method $endpoint should return 204 No Content',
      async ({ method, endpoint }) => {
        // Arrange
        const app = await setupApp({
          AppModule,
          SequelizeConfigService,
          user,
        })
        const server = request(app.getHttpServer())
        await createTestClientData(app, otherUser)

        // Act
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(204)
        expect(res.body).toEqual({})
      },
    )
  })

  it.each`
    userRole    | currentUser
    ${'normal'} | ${user}
    ${'super'}  | ${superUser}
  `('should create client as $userRole user', async ({ currentUser }) => {
    // Arrange
    const app = await setupApp({
      AppModule,
      SequelizeConfigService,
      user: currentUser,
    })
    const server = request(app.getHttpServer())
    await createTestClientData(app, user)
    const newClient = {
      clientId: '@test.is/new-test-client',
      clientType: 'web',
      clientName: 'New Test Client',
    }

    // Act
    const res = await server
      .post(`/v2/me/tenants/${tenantId}/clients`)
      .send(newClient)

    // Assert
    expect(res.status).toEqual(201)
    expect(res.body).toMatchObject({
      clientId: newClient.clientId,
      clientType: newClient.clientType,
      tenantId,
    })
  })

  it.each`
    userAccess  | currentUser
    ${'normal'} | ${user}
    ${'super'}  | ${superUser}
  `('should return clients as $userAccess user', async ({ currentUser }) => {
    // Arrange
    const app = await setupApp({
      AppModule,
      SequelizeConfigService,
      user: currentUser,
    })
    const server = request(app.getHttpServer())
    const expected = await createTestClientData(app, user)

    // Act
    const res = await server.get(`/v2/me/tenants/${tenantId}/clients`)

    // Assert
    expect(res.status).toEqual(200)
    expect(res.body).toEqual([expected])
  })

  it.each`
    userRole    | currentUser
    ${'normal'} | ${user}
    ${'super'}  | ${superUser}
  `(
    'should return single client as $userRole user',
    async ({ currentUser }) => {
      // Arrange
      const app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: currentUser,
      })
      const server = request(app.getHttpServer())
      const expected = await createTestClientData(app, user)

      // Act
      const res = await server.get(
        `/v2/me/tenants/${tenantId}/clients/${encodeURIComponent(clientId)}`,
      )

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toEqual(expected)
    },
  )

  it.each`
    clientType   | typeSpecificDefaults
    ${'web'}     | ${{}}
    ${'machine'} | ${{ allowOfflineAccess: false, requirePkce: false }}
    ${'native'}  | ${{ absoluteRefreshTokenLifetime: 365 * 24 * 60 * 60, requireClientSecret: false, slidingRefreshTokenLifetime: 90 * 24 * 60 * 60 }}
  `(
    'should create $clientType client with correct defaults',
    async ({ clientType, typeSpecificDefaults }) => {
      // Arrange
      const app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user,
      })
      const server = request(app.getHttpServer())
      const clientModel = app.get(getModelToken(Client))
      await createTestClientData(app, user)
      const newClient = {
        clientId: '@test.is/new-test-client',
        clientName: 'New test client',
        clientType,
      }

      // Act
      const res = await server
        .post(`/v2/me/tenants/${tenantId}/clients`)
        .send(newClient)

      // Assert - response
      expect(res.status).toEqual(201)
      expect(res.body).toEqual({
        clientId: newClient.clientId,
        clientType,
        tenantId,
        displayName: [
          {
            locale: 'is',
            value: newClient.clientName,
          },
        ],
        refreshTokenExpiration:
          clientBaseAttributes.refreshTokenExpiration === 1
            ? RefreshTokenExpiration.Absolute
            : RefreshTokenExpiration.Sliding,
        absoluteRefreshTokenLifetime:
          typeSpecificDefaults.absoluteRefreshTokenLifetime ??
          clientBaseAttributes.absoluteRefreshTokenLifetime,
        slidingRefreshTokenLifetime:
          typeSpecificDefaults.slidingRefreshTokenLifetime ??
          clientBaseAttributes.slidingRefreshTokenLifetime,
        accessTokenLifetime: clientBaseAttributes.accessTokenLifetime,
        allowOfflineAccess:
          typeSpecificDefaults.allowOfflineAccess ??
          clientBaseAttributes.allowOfflineAccess,
        redirectUris: [],
        postLogoutRedirectUris: [],
        requireApiScopes: false,
        requireConsent: false,
        requirePkce:
          typeSpecificDefaults.requirePkce ?? clientBaseAttributes.requirePkce,
        supportTokenExchange: false,
        supportsCustomDelegation: false,
        supportsLegalGuardians: false,
        supportsPersonalRepresentatives: false,
        supportsProcuringHolders: false,
        promptDelegations: false,
        customClaims: [],
      })

      // Assert - db record
      const dbClient = await clientModel.findByPk(newClient.clientId, {
        include: [{ model: ClientGrantType, as: 'allowedGrantTypes' }],
      })
      expect(dbClient).toMatchObject({
        ...clientBaseAttributes,
        allowRememberConsent: clientBaseAttributes.allowRememberConsent
          ? '1'
          : '0',
        clientId: newClient.clientId,
        clientType: newClient.clientType,
        clientName: newClient.clientName,
        domainName: tenantId,

        ...typeSpecificDefaults,
      })
    },
  )

  describe('create client with invalid request body', () => {
    it('should return 400 Bad Request with invalid client id', async () => {
      // Arrange
      const app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user,
      })
      const server = request(app.getHttpServer())
      await createTestClientData(app, user)
      const newClient = {
        clientId: 'invalid-client-id',
        clientType: 'web',
        clientName: 'New test client',
      }

      // Act
      const res = await server
        .post(`/v2/me/tenants/${tenantId}/clients`)
        .send(newClient)

      // Assert
      expect(res.status).toEqual(400)
      expect(res.body).toEqual({
        type: 'https://httpstatuses.org/400',
        title: 'Bad Request',
        status: 400,
        detail: 'Invalid client id',
      })
    })

    it('should return 400 Bad Request with invalid client type', async () => {
      // Arrange
      const app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user,
      })
      const server = request(app.getHttpServer())
      await createTestClientData(app, user)
      const newClient = {
        clientId: '@test.is/new-test-client',
        clientType: 'invalid-client-type',
        clientName: 'New test client',
      }

      // Act
      const res = await server
        .post(`/v2/me/tenants/${tenantId}/clients`)
        .send(newClient)

      // Assert
      expect(res.status).toEqual(400)
      expect(res.body).toEqual({
        type: 'https://httpstatuses.org/400',
        title: 'Bad Request',
        status: 400,
        detail: [
          'clientType must be one of the following values: machine, native, web',
        ],
      })
    })
  })

  describe('update client', () => {
    describe.each`
      userRole    | currentUser
      ${'normal'} | ${user}
      ${'super'}  | ${superUser}
    `('as $userRole', ({ userRole, currentUser }) => {
      it('should succeed with normal fields', async () => {
        // Arrange
        const app = await setupApp({
          AppModule,
          SequelizeConfigService,
          user: currentUser,
        })
        const server = request(app.getHttpServer())
        const expected = await createTestClientData(app, user)
        const updatedClient: AdminPatchClientDto = {
          displayName: [
            {
              locale: 'is',
              value: 'Updated test client',
            },
            {
              locale: 'en',
              value: 'Updated EN test client',
            },
          ],
          redirectUris: [faker.internet.url()],
          postLogoutRedirectUris: [faker.internet.url()],
          absoluteRefreshTokenLifetime: 1000,
          slidingRefreshTokenLifetime: 1000,
          refreshTokenExpiration: RefreshTokenExpiration.Sliding,
        }

        // Act
        const res = await server
          .patch(
            `/v2/me/tenants/${tenantId}/clients/${encodeURIComponent(
              clientId,
            )}`,
          )
          .send(updatedClient)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toEqual({
          ...expected,
          ...updatedClient,
        })
      })

      it('should return 400 Bad Request if icelandic display name is empty', async () => {
        // Arrange
        const app = await setupApp({
          AppModule,
          SequelizeConfigService,
          user: currentUser,
        })
        const server = request(app.getHttpServer())
        await createTestClientData(app, user)
        const updatedClient: AdminPatchClientDto = {
          displayName: [
            {
              locale: 'is',
              value: '',
            },
            {
              locale: 'en',
              value: 'Updated EN test client',
            },
          ],
        }

        // Act
        const res = await server
          .patch(
            `/v2/me/tenants/${tenantId}/clients/${encodeURIComponent(
              clientId,
            )}`,
          )
          .send(updatedClient)

        // Assert
        expect(res.status).toEqual(400)
        expect(res.body).toEqual({
          type: 'https://httpstatuses.org/400',
          title: 'Bad Request',
          status: 400,
          detail: 'Client name in Icelandic is required',
        })
      })

      it(`should return ${
        userRole === 'normal' ? '403 Forbidden' : '200 OK'
      } for superuser fields`, async () => {
        // Arrange
        const app = await setupApp({
          AppModule,
          SequelizeConfigService,
          user: currentUser,
        })
        const server = request(app.getHttpServer())
        const expected = await createTestClientData(app, user)
        const updatedClient: AdminPatchClientDto = {
          supportsCustomDelegation: true,
          supportsLegalGuardians: true,
          supportsProcuringHolders: true,
          supportsPersonalRepresentatives: true,
          promptDelegations: true,
          requireApiScopes: true,
          requireConsent: true,
          allowOfflineAccess: true,
          requirePkce: true,
          supportTokenExchange: true,
          accessTokenLifetime: 3600,
          customClaims: [
            {
              type: 'claim1',
              value: 'value1',
            },
          ],
        }

        // Act
        const res = await server
          .patch(
            `/v2/me/tenants/${tenantId}/clients/${encodeURIComponent(
              clientId,
            )}`,
          )
          .send(updatedClient)

        // Assert
        if (userRole === 'normal') {
          expect(res.status).toEqual(403)
          expect(res.body).toEqual({
            type: 'https://httpstatuses.org/403',
            title: 'Forbidden',
            status: 403,
            detail:
              'User does not have access to update admin controlled fields.',
          })
        } else if (userRole === 'super') {
          expect(res.status).toEqual(200)
          expect(res.body).toEqual({
            ...expected,
            ...updatedClient,
          })
        } else {
          throw new Error('Invalid user role')
        }
      })
    })
  })
})
