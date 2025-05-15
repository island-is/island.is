import { getModelToken } from '@nestjs/sequelize'
import faker from 'faker'
import request from 'supertest'

import {
  AdminCreateClientDto,
  AdminPatchClientDto,
  Client,
  clientBaseAttributes,
  ClientDelegationType,
  ClientGrantType,
  ClientSso,
  defaultAcrValue,
  RefreshTokenExpiration,
  SequelizeConfigService,
  SUPER_USER_DELEGATION_TYPES,
  translateRefreshTokenExpiration,
} from '@island.is/auth-api-lib'
import { User } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { FixtureFactory } from '@island.is/services/auth/testing'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { getRequestMethod, setupApp, TestApp } from '@island.is/testing/nest'

import { AppModule } from '../../../app.module'
import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/shared/types'

const tenantId = '@test.is'
const clientId = '@test.is/test-client'

const createTestClientData = async (app: TestApp, user: User) => {
  const fixtureFactory = new FixtureFactory(app)
  await fixtureFactory.createDomain({
    name: tenantId,
    nationalId: user.nationalId,
  })

  await Promise.all(
    [
      [AuthDelegationType.Custom, AuthDelegationProvider.Custom],
      [AuthDelegationType.GeneralMandate, AuthDelegationProvider.Custom],
      [
        AuthDelegationType.ProcurationHolder,
        AuthDelegationProvider.CompanyRegistry,
      ],
      [
        AuthDelegationType.PersonalRepresentative,
        AuthDelegationProvider.PersonalRepresentativeRegistry,
      ],
      [
        AuthDelegationType.LegalGuardian,
        AuthDelegationProvider.NationalRegistry,
      ],
      [
        AuthDelegationType.LegalRepresentative,
        AuthDelegationProvider.DistrictCommissionersRegistry,
      ],
    ].map(async ([delegationType, provider]) =>
      fixtureFactory.createDelegationType({
        id: delegationType,
        providerId: provider,
      }),
    ),
  )

  const client = await fixtureFactory.createClient({
    ...clientBaseAttributes,
    clientId,
    domainName: tenantId,
    redirectUris: [faker.internet.url()],
    postLogoutRedirectUris: [faker.internet.url()],
    allowedGrantTypes: [],
    claims: [{ type: faker.random.word(), value: faker.random.word() }],
    supportedDelegationTypes: [],
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
    singleSession: false,
    supportedDelegationTypes: client.supportedDelegationTypes?.map(
      (type) => type.delegationType,
    ),
    allowedAcr: [defaultAcrValue],
    sso: ClientSso.Enabled,
  }
}

const clientForCreateTest: Partial<AdminCreateClientDto> = {
  absoluteRefreshTokenLifetime: 1000,
  slidingRefreshTokenLifetime: 1000,
  accessTokenLifetime: 1000,
  allowOfflineAccess: true,
  customClaims: [
    {
      type: 'test',
      value: 'test',
    },
  ],
  displayName: [
    {
      locale: 'is',
      value: 'test-client',
    },
    {
      locale: 'en',
      value: 'test-client',
    },
  ],
  refreshTokenExpiration: RefreshTokenExpiration.Sliding,
  requireApiScopes: true,
  requireConsent: true,
  requirePkce: true,
  promptDelegations: true,
  singleSession: true,
  sso: ClientSso.Enabled,
}

describe('MeClientsController with auth', () => {
  const user = createCurrentUser({
    scope: [AdminPortalScope.idsAdmin],
  })
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
          dbType: 'postgres',
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
      dbType: 'postgres',
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
      dbType: 'postgres',
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
        dbType: 'postgres',
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
    ${'native'} | ${{
  absoluteRefreshTokenLifetime: 365 * 24 * 60 * 60,
  requireClientSecret: false,
  slidingRefreshTokenLifetime: 90 * 24 * 60 * 60,
}}
  `(
    'should create $clientType client with correct defaults',
    async ({ clientType, typeSpecificDefaults }) => {
      // Arrange
      const app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user,
        dbType: 'postgres',
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
        singleSession: false,
        allowedAcr: [defaultAcrValue],
        supportedDelegationTypes: [],
        sso: ClientSso.Enabled,
      })

      // Assert - db record
      const dbClient = await clientModel.findByPk(newClient.clientId, {
        include: [{ model: ClientGrantType, as: 'allowedGrantTypes' }],
      })
      expect(dbClient).toMatchObject({
        ...clientBaseAttributes,
        clientId: newClient.clientId,
        clientType: newClient.clientType,
        clientName: newClient.clientName,
        domainName: tenantId,
        sso: ClientSso.Enabled,

        ...typeSpecificDefaults,
      })
    },
  )

  it.each`
    value | typeSpecificDefaults
    ${'super admin fields'} | ${{
  requireConsent: false,
  singleSession: false,
  allowOfflineAccess: true,
  requirePkce: false,
  supportTokenExchange: true,
  accessTokenLifetime: 100,
  allowedAcr: ['some-acr-value'],
  customClaims: [{ type: 'claim1', value: 'value1' }],
}}
  `(
    'should create client with default values for $value as normal user',
    async ({ typeSpecificDefaults }) => {
      // Arrange
      const app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user,
        dbType: 'postgres',
      })
      const server = request(app.getHttpServer())
      const clientModel = app.get(getModelToken(Client))
      const newClientId = '@test.is/new-test-client'
      await createTestClientData(app, user)
      const newClient = {
        ...typeSpecificDefaults,
        clientId: newClientId,
        clientName: 'test-client',
        clientType: 'web',
        sso: ClientSso.Enabled,
      }

      // Act
      const res = await server
        .post(`/v2/me/tenants/${tenantId}/clients`)
        .send(newClient)

      // Assert - response
      expect(res.status).toEqual(201)
      expect(res.body).toEqual({
        clientId: newClientId,
        clientType: newClient.clientType,
        tenantId,
        displayName: typeSpecificDefaults.displayName ?? [
          {
            locale: 'is',
            value: newClient.clientName,
          },
        ],
        refreshTokenExpiration: typeSpecificDefaults.refreshTokenExpiration
          ? typeSpecificDefaults.refreshTokenExpiration
          : translateRefreshTokenExpiration(
              clientBaseAttributes.refreshTokenExpiration,
            ),
        absoluteRefreshTokenLifetime:
          typeSpecificDefaults.absoluteRefreshTokenLifetime ??
          clientBaseAttributes.absoluteRefreshTokenLifetime,
        slidingRefreshTokenLifetime:
          typeSpecificDefaults.slidingRefreshTokenLifetime ??
          clientBaseAttributes.slidingRefreshTokenLifetime,
        accessTokenLifetime:
          typeSpecificDefaults.accessTokenLifetime ??
          clientBaseAttributes.accessTokenLifetime,
        allowOfflineAccess: clientBaseAttributes.allowOfflineAccess,
        redirectUris: [],
        postLogoutRedirectUris: [],
        requireApiScopes: false,
        requireConsent: false,
        requirePkce:
          typeSpecificDefaults.requirePkce ?? clientBaseAttributes.requirePkce,
        supportTokenExchange: typeSpecificDefaults.supportTokenExchange,
        supportsCustomDelegation: false,
        supportsLegalGuardians: false,
        supportsPersonalRepresentatives: false,
        supportsProcuringHolders: false,
        promptDelegations: false,
        customClaims: typeSpecificDefaults.customClaims ?? [],
        singleSession: false,
        supportedDelegationTypes: [],
        sso: ClientSso.Enabled,
        allowedAcr: typeSpecificDefaults.allowedAcr ?? [defaultAcrValue],
      })

      // Assert - db record
      const dbClient = await clientModel.findByPk(newClientId, {
        include: [{ model: ClientGrantType, as: 'allowedGrantTypes' }],
      })

      expect(dbClient).toMatchObject({
        ...clientBaseAttributes,
        clientId: newClientId,
        clientType: newClient.clientType,
        clientName: newClient.clientName,
        domainName: tenantId,
        sso: ClientSso.Enabled,

        slidingRefreshTokenLifetime:
          typeSpecificDefaults.slidingRefreshTokenLifetime ??
          clientBaseAttributes.slidingRefreshTokenLifetime,
        absoluteRefreshTokenLifetime:
          typeSpecificDefaults.absoluteRefreshTokenLifetime ??
          clientBaseAttributes.absoluteRefreshTokenLifetime,
        accessTokenLifetime:
          typeSpecificDefaults.accessTokenLifetime ??
          clientBaseAttributes.accessTokenLifetime,
        allowOfflineAccess:
          typeSpecificDefaults.allowOfflineAccess ??
          clientBaseAttributes.allowOfflineAccess,
        requirePkce:
          typeSpecificDefaults.requirePkce ?? clientBaseAttributes.requirePkce,
        refreshTokenExpiration: translateRefreshTokenExpiration(
          typeSpecificDefaults.refreshTokenExpiration,
        ),
      })
    },
  )

  it.each`
    value                                   | typeSpecificDefaults
    ${'none'}                               | ${{}}
    ${'allowOfflineAccess and requirePkce'} | ${{ allowOfflineAccess: false, requirePkce: false }}
    ${'refreshTokenExpiration'}             | ${{ refreshTokenExpiration: RefreshTokenExpiration.Sliding }}
    ${'all values'}                         | ${{ ...clientForCreateTest }}
  `(
    'super user should create client with correct none default values for $value',
    async ({ typeSpecificDefaults }) => {
      // Arrange
      const app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: superUser,
        dbType: 'postgres',
      })
      const server = request(app.getHttpServer())
      const clientModel = app.get(getModelToken(Client))
      const newClientId = '@test.is/new-test-client'
      await createTestClientData(app, superUser)
      const newClient = {
        ...typeSpecificDefaults,
        clientId: newClientId,
        clientName: 'test-client',
        clientType: 'web',
      }

      // Act
      const res = await server
        .post(`/v2/me/tenants/${tenantId}/clients`)
        .send(newClient)

      // Assert - response
      expect(res.status).toEqual(201)
      expect(res.body).toEqual({
        clientId: newClientId,
        clientType: newClient.clientType,
        tenantId,
        displayName: typeSpecificDefaults.displayName ?? [
          {
            locale: 'is',
            value: newClient.clientName,
          },
        ],
        refreshTokenExpiration: typeSpecificDefaults.refreshTokenExpiration
          ? typeSpecificDefaults.refreshTokenExpiration
          : translateRefreshTokenExpiration(
              clientBaseAttributes.refreshTokenExpiration,
            ),
        absoluteRefreshTokenLifetime:
          typeSpecificDefaults.absoluteRefreshTokenLifetime ??
          clientBaseAttributes.absoluteRefreshTokenLifetime,
        slidingRefreshTokenLifetime:
          typeSpecificDefaults.slidingRefreshTokenLifetime ??
          clientBaseAttributes.slidingRefreshTokenLifetime,
        accessTokenLifetime:
          typeSpecificDefaults.accessTokenLifetime ??
          clientBaseAttributes.accessTokenLifetime,
        allowOfflineAccess:
          typeSpecificDefaults.allowOfflineAccess ??
          clientBaseAttributes.allowOfflineAccess,
        redirectUris: [],
        postLogoutRedirectUris: [],
        requireApiScopes: typeSpecificDefaults.requireApiScopes
          ? typeSpecificDefaults.requireApiScopes
          : false,
        requireConsent: typeSpecificDefaults.requireConsent
          ? typeSpecificDefaults.requireConsent
          : false,
        requirePkce:
          typeSpecificDefaults.requirePkce ?? clientBaseAttributes.requirePkce,
        supportTokenExchange: typeSpecificDefaults.supportTokenExchange
          ? typeSpecificDefaults.supportTokenExchange
          : false,
        supportsCustomDelegation: typeSpecificDefaults.supportsCustomDelegation
          ? typeSpecificDefaults.supportsCustomDelegation
          : false,
        supportsLegalGuardians: typeSpecificDefaults.supportsLegalGuardians
          ? typeSpecificDefaults.supportsLegalGuardians
          : false,
        supportsPersonalRepresentatives:
          typeSpecificDefaults.supportsPersonalRepresentatives
            ? typeSpecificDefaults.supportsPersonalRepresentatives
            : false,
        supportsProcuringHolders: typeSpecificDefaults.supportsProcuringHolders
          ? typeSpecificDefaults.supportsProcuringHolders
          : false,
        promptDelegations: typeSpecificDefaults.promptDelegations
          ? typeSpecificDefaults.promptDelegations
          : false,
        customClaims: typeSpecificDefaults.customClaims ?? [],
        singleSession: typeSpecificDefaults.singleSession ?? false,
        allowedAcr: [defaultAcrValue],
        supportedDelegationTypes: [],
        sso: ClientSso.Enabled,
      })

      // Assert - db record
      const dbClient = await clientModel.findByPk(newClientId, {
        include: [{ model: ClientGrantType, as: 'allowedGrantTypes' }],
      })

      expect(dbClient).toMatchObject({
        ...clientBaseAttributes,
        clientId: newClientId,
        clientType: newClient.clientType,
        clientName: newClient.clientName,
        domainName: tenantId,
        sso: ClientSso.Enabled,

        slidingRefreshTokenLifetime:
          typeSpecificDefaults.slidingRefreshTokenLifetime ??
          clientBaseAttributes.slidingRefreshTokenLifetime,
        absoluteRefreshTokenLifetime:
          typeSpecificDefaults.absoluteRefreshTokenLifetime ??
          clientBaseAttributes.absoluteRefreshTokenLifetime,
        accessTokenLifetime:
          typeSpecificDefaults.accessTokenLifetime ??
          clientBaseAttributes.accessTokenLifetime,
        allowOfflineAccess:
          typeSpecificDefaults.allowOfflineAccess ??
          clientBaseAttributes.allowOfflineAccess,
        requirePkce:
          typeSpecificDefaults.requirePkce ?? clientBaseAttributes.requirePkce,
        refreshTokenExpiration: translateRefreshTokenExpiration(
          typeSpecificDefaults.refreshTokenExpiration,
        ),
      })
    },
  )

  it('should create client with correct delegation types for super user', async () => {
    const app = await setupApp({
      AppModule,
      SequelizeConfigService,
      user: superUser,
      dbType: 'postgres',
    })
    const server = request(app.getHttpServer())
    const newClientId = '@test.is/new-test-client'
    await createTestClientData(app, superUser)
    const newClient = {
      clientId: newClientId,
      clientName: 'test-client',
      clientType: 'web',
      sso: ClientSso.Enabled,
      supportedDelegationTypes: [
        AuthDelegationType.Custom,
        AuthDelegationType.PersonalRepresentative,
        AuthDelegationType.ProcurationHolder,
        AuthDelegationType.LegalGuardian,
        AuthDelegationType.LegalRepresentative,
      ],
    }

    // Act
    const res = await server
      .post(`/v2/me/tenants/${tenantId}/clients`)
      .send(newClient)

    // Assert
    expect(res.status).toEqual(201)
    expect(res.body.supportedDelegationTypes).toEqual(
      expect.arrayContaining([
        AuthDelegationType.Custom,
        AuthDelegationType.PersonalRepresentative,
        AuthDelegationType.ProcurationHolder,
        AuthDelegationType.LegalGuardian,
        AuthDelegationType.LegalRepresentative,
      ]),
    )
  })

  describe('create client with invalid request body', () => {
    it('should return 400 Bad Request with invalid client id', async () => {
      // Arrange
      const app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user,
        dbType: 'postgres',
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
        dbType: 'postgres',
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

    it('should return 400 Bad Request with invalid fields', async () => {
      // Arrange
      const app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user,
        dbType: 'postgres',
      })
      const server = request(app.getHttpServer())
      await createTestClientData(app, user)
      const newClient = {
        clientId: '@test.is/new-test-client',
        clientName: 'test-client',
        clientType: 'web',
        enabled: false,
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
        detail: ['property enabled should not exist'],
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
          dbType: 'postgres',
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
          dbType: 'postgres',
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

      it('should return 400 Bad Request for unexpected input fields', async () => {
        // Arrange
        const app = await setupApp({
          AppModule,
          SequelizeConfigService,
          user: currentUser,
          dbType: 'postgres',
        })
        const server = request(app.getHttpServer())
        await createTestClientData(app, user)
        const updatedClient = {
          enabled: false,
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
          detail: ['property enabled should not exist'],
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
          dbType: 'postgres',
        })
        const server = request(app.getHttpServer())
        const expected = await createTestClientData(app, user)
        const updatedClient: AdminPatchClientDto = {
          promptDelegations: true,
          requireApiScopes: true,
          requireConsent: true,
          allowOfflineAccess: true,
          requirePkce: true,
          supportTokenExchange: true,
          singleSession: true,
          accessTokenLifetime: 3600,
          customClaims: [
            {
              type: 'claim1',
              value: 'value1',
            },
          ],
          allowedAcr: ['some-acr-value'],
          sso: ClientSso.Enabled,
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

    describe('update supported delegation types', () => {
      const updateAndAssert = async ({
        server,
        body,
        supportedDelegationTypes,
        supportsCustomDelegation,
        supportsLegalGuardians,
        supportsPersonalRepresentatives,
        supportsProcuringHolders,
      }: {
        server: request.SuperTest<request.Test>
        body: AdminPatchClientDto
        supportedDelegationTypes: string[]
        supportsCustomDelegation: boolean
        supportsLegalGuardians: boolean
        supportsPersonalRepresentatives: boolean
        supportsProcuringHolders: boolean
      }) => {
        const res = await server
          .patch(
            `/v2/me/tenants/${tenantId}/clients/${encodeURIComponent(
              clientId,
            )}`,
          )
          .send(body)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body.supportedDelegationTypes.length).toEqual(
          supportedDelegationTypes.length,
        )
        expect(res.body).toEqual(
          expect.objectContaining({
            supportedDelegationTypes: expect.arrayContaining(
              supportedDelegationTypes,
            ),
            supportsCustomDelegation,
            supportsLegalGuardians,
            supportsPersonalRepresentatives,
            supportsProcuringHolders,
          }),
        )
      }

      it('should add supported delegation types and still support old boolean fields', async () => {
        // Arrange
        const app = await setupApp({
          AppModule,
          SequelizeConfigService,
          user: superUser,
          dbType: 'postgres',
        })
        const server = request(app.getHttpServer())
        await createTestClientData(app, superUser)

        const body: AdminPatchClientDto = {
          addedDelegationTypes: [
            AuthDelegationType.Custom,
            AuthDelegationType.LegalGuardian,
            AuthDelegationType.PersonalRepresentative,
            AuthDelegationType.ProcurationHolder,
            AuthDelegationType.LegalRepresentative,
          ],
        }

        // Act
        await updateAndAssert({
          server,
          body,
          supportedDelegationTypes: [
            AuthDelegationType.Custom,
            // Add general mandate since it is directly connected to Custom delegation type
            AuthDelegationType.GeneralMandate,
            AuthDelegationType.LegalGuardian,
            AuthDelegationType.PersonalRepresentative,
            AuthDelegationType.ProcurationHolder,
            AuthDelegationType.LegalRepresentative,
          ],
          supportsCustomDelegation: true,
          supportsLegalGuardians: true,
          supportsPersonalRepresentatives: true,
          supportsProcuringHolders: true,
        })
      })

      it('should remove supported delegation types and still support old boolean fields', async () => {
        // Arrange
        const app = await setupApp({
          AppModule,
          SequelizeConfigService,
          user: superUser,
          dbType: 'postgres',
        })
        const server = request(app.getHttpServer())
        await createTestClientData(app, superUser)

        // add delegation types that we can then remove
        await updateAndAssert({
          server,
          body: {
            addedDelegationTypes: [
              AuthDelegationType.Custom,
              AuthDelegationType.LegalGuardian,
              AuthDelegationType.PersonalRepresentative,
              AuthDelegationType.ProcurationHolder,
              AuthDelegationType.LegalRepresentative,
            ],
            supportsCustomDelegation: true,
            supportsLegalGuardians: true,
            supportsPersonalRepresentatives: true,
            supportsProcuringHolders: true,
          },
          supportedDelegationTypes: [
            AuthDelegationType.Custom,
            // Add general mandate since it is directly connected to Custom delegation type
            AuthDelegationType.GeneralMandate,
            AuthDelegationType.LegalGuardian,
            AuthDelegationType.PersonalRepresentative,
            AuthDelegationType.ProcurationHolder,
            AuthDelegationType.LegalRepresentative,
          ],
          supportsCustomDelegation: true,
          supportsLegalGuardians: true,
          supportsPersonalRepresentatives: true,
          supportsProcuringHolders: true,
        })

        const body: AdminPatchClientDto = {
          removedDelegationTypes: [
            AuthDelegationType.Custom,
            AuthDelegationType.LegalGuardian,
            AuthDelegationType.PersonalRepresentative,
            AuthDelegationType.ProcurationHolder,
            AuthDelegationType.LegalRepresentative,
          ],
        }

        // Act
        await updateAndAssert({
          server,
          body,
          supportedDelegationTypes: [],
          supportsCustomDelegation: false,
          supportsLegalGuardians: false,
          supportsPersonalRepresentatives: false,
          supportsProcuringHolders: false,
        })
      })

      it.each`
        action
        ${'added'}
        ${'removed'}
      `(
        'should not have $action super user delegation type as normal',
        async ({ action }) => {
          // Arrange
          const app = await setupApp({
            AppModule,
            SequelizeConfigService,
            user,
            dbType: 'postgres',
          })
          const server = request(app.getHttpServer())
          await createTestClientData(app, user)

          // Act
          const res = await Promise.all(
            SUPER_USER_DELEGATION_TYPES.map((delegationType) =>
              server
                .patch(
                  `/v2/me/tenants/${tenantId}/clients/${encodeURIComponent(
                    clientId,
                  )}`,
                )
                .send({
                  [`${action}DelegationTypes`]: [delegationType],
                }),
            ),
          )

          // Assert
          res.forEach((r) => {
            expect(r.status).toEqual(403)
            expect(r.body).toEqual({
              type: 'https://httpstatuses.org/403',
              title: 'Forbidden',
              status: 403,
              detail:
                'User does not have access to update admin controlled fields.',
            })
          })

          // DB assert
          const clientDelegationTypeModel = app.get(
            getModelToken(ClientDelegationType),
          )
          const clientDelegationTypes = await clientDelegationTypeModel.findAll(
            {
              where: {
                clientId,
              },
            },
          )

          expect(clientDelegationTypes.length).toEqual(0)
        },
      )
    })
  })
})
