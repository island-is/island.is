import faker from 'faker'
import request from 'supertest'

import { AdminPortalScope } from '@island.is/auth/scopes'
import {
  Client,
  clientBaseAttributes,
  ClientGrantType,
  GrantTypeEnum,
  SequelizeConfigService,
  TranslatedValueDto,
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
    clientId: clientId,
    domainName: tenantId,
  })
  const redirectUri = await fixtureFactory.createClientRedirectUri({ clientId })
  const postLogoutRedirectUri = await fixtureFactory.createClientPostLogoutRedirectUri(
    {
      clientId,
    },
  )
  await fixtureFactory.createClientGrantType({
    clientId,
    grantType: GrantTypeEnum.TokenExchange,
  })
  const [translation] = await fixtureFactory.createTranslations(client, 'en', {
    clientName: faker.random.word(),
  })
  const clientClaim = await fixtureFactory.createClientClaim({
    clientId,
    type: faker.random.word(),
    value: faker.random.word(),
  })

  return {
    client,
    clientNameTranslation: {
      locale: translation.language,
      value: translation.value,
    } as TranslatedValueDto,
    redirectUri: redirectUri.redirectUri,
    postLogoutRedirectUri: postLogoutRedirectUri.redirectUri,
    customClaim: { type: clientClaim.type, value: clientClaim.value },
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
      method    | endpoint
      ${'GET'}  | ${`/v2/me/tenants/${tenantId}/clients`}
      ${'GET'}  | ${`/v2/me/tenants/${tenantId}/clients/${encodeURIComponent(clientId)}`}
      ${'POST'} | ${`/v2/me/tenants/${tenantId}/clients`}
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
    userAccess  | currentUser
    ${'normal'} | ${user}
    ${'super'}  | ${superUser}
  `('should create client as $userAccess user', async ({ currentUser }) => {
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
    const testClientData = await createTestClientData(app, user)

    // Act
    const res = await server.get(`/v2/me/tenants/${tenantId}/clients`)

    // Assert
    expect(res.status).toEqual(200)
    expect(res.body).toEqual([
      {
        absoluteRefreshTokenLifetime: 2592000,
        accessTokenLifetime: 3600,
        allowOfflineAccess: false,
        clientId,
        clientType: 'web',
        tenantId,
        customClaims: {
          [testClientData.customClaim.type]: testClientData.customClaim.value,
        },
        displayName: [
          {
            locale: 'is',
            value: testClientData.client.clientName,
          },
          {
            locale: testClientData.clientNameTranslation.locale,
            value: testClientData.clientNameTranslation.value,
          },
        ],
        postLogoutRedirectUris: [testClientData.postLogoutRedirectUri],
        promptDelegations: false,
        redirectUris: [testClientData.redirectUri],
        refreshTokenExpiration: 1,
        requireApiScopes: false,
        requireConsent: false,
        requirePkce: true,
        slidingRefreshTokenLifetime: 1296000,
        supportTokenExchange: true,
        supportsCustomDelegation: false,
        supportsLegalGuardians: false,
        supportsPersonalRepresentatives: false,
        supportsProcuringHolders: false,
      },
    ])
  })

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
        refreshTokenExpiration: clientBaseAttributes.refreshTokenExpiration,
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
        customClaims: {},
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
})
