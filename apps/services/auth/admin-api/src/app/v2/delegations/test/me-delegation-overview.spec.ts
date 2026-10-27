import request from 'supertest'

import {
  getRequestMethod,
  setupApp,
  setupAppWithoutAuth,
  TestApp,
} from '@island.is/testing/nest'
import { FixtureFactory } from '@island.is/services/auth/testing'
import {
  createCurrentUser,
  createNationalId,
  createNationalRegistryUser,
} from '@island.is/testing/fixtures'
import { AdminPortalScope, DelegationAdminScopes } from '@island.is/auth/scopes'
import {
  Client,
  ClientType,
  Delegation,
  DelegationDelegationType,
  DelegationOverviewDto,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'
import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/shared/types'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { getModelToken } from '@nestjs/sequelize'
import { faker } from '@island.is/shared/mocking'

import { AppModule } from '../../../app.module'

const path = '/me/delegation-overview'

describe('MeDelegationOverviewController', () => {
  describe('without auth and permissions', () => {
    it('should return 401 when user is not authenticated', async () => {
      // Arrange
      const app = await setupAppWithoutAuth({
        AppModule,
        SequelizeConfigService,
        dbType: 'postgres',
      })
      const server = request(app.getHttpServer())

      // Act
      const res = await getRequestMethod(server, 'GET')(path)

      // Assert
      expect(res.status).toEqual(401)

      await app.cleanUp()
    })

    it.each([
      [[]],
      [[DelegationAdminScopes.read, DelegationAdminScopes.admin]],
      [[AdminPortalScope.idsAdmin]],
    ])('should return 403 when user has scopes %j', async (scope: string[]) => {
      // Arrange
      const app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({ scope }),
        dbType: 'postgres',
      })
      const server = request(app.getHttpServer())

      // Act
      const res = await getRequestMethod(server, 'GET')(path)

      // Assert
      expect(res.status).toEqual(403)
      expect(res.body).toMatchObject({
        status: 403,
        title: 'Forbidden',
      })

      await app.cleanUp()
    })
  })

  describe('with institution scope', () => {
    const organizationUser = createCurrentUser({
      nationalIdType: 'company',
      scope: [DelegationAdminScopes.institution],
    })
    const personNationalId = createNationalId('person')

    let app: TestApp
    let server: request.SuperTest<request.Test>
    let factory: FixtureFactory

    beforeAll(async () => {
      app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: organizationUser,
        dbType: 'postgres',
      })
      server = request(app.getHttpServer())
      factory = new FixtureFactory(app)

      jest
        .spyOn(app.get(NationalRegistryV3ClientService), 'getAllDataIndividual')
        .mockImplementation(
          async (nationalId) =>
            createNationalRegistryUser({ nationalId }) as never,
        )

      const customScope = {
        supportedDelegationTypes: [AuthDelegationType.Custom],
      }

      await factory.createDomain({
        name: 'own-domain',
        nationalId: organizationUser.nationalId,
        apiScopes: [
          { name: 'own-s1', ...customScope },
          { name: 'own-s2', ...customScope },
          { name: 'own-protected', isAccessControlled: true, ...customScope },
        ],
      })
      await factory.createDomain({
        name: 'other-domain',
        nationalId: createNationalId('company'),
        apiScopes: [{ name: 'other-s1', ...customScope }],
      })

      await factory.createClient({
        clientId: 'own-client-a',
        clientName: 'A client',
        domainName: 'own-domain',
        supportedDelegationTypes: [AuthDelegationType.Custom],
        allowedScopes: [{ clientId: 'own-client-a', scopeName: 'own-s1' }],
      })
      await factory.createClient({
        clientId: 'own-client-b',
        clientName: 'B client',
        domainName: 'own-domain',
        supportedDelegationTypes: [AuthDelegationType.Custom],
        allowedScopes: [
          { clientId: 'own-client-b', scopeName: 'own-s1' },
          { clientId: 'own-client-b', scopeName: 'own-s2' },
        ],
      })
      await factory.createClient({
        clientId: 'own-client-no-custom',
        clientName: 'C client',
        domainName: 'own-domain',
        supportedDelegationTypes: [AuthDelegationType.ProcurationHolder],
        allowedScopes: [
          { clientId: 'own-client-no-custom', scopeName: 'own-s1' },
        ],
      })
      await factory.createClient({
        clientId: 'own-machine-client',
        clientName: 'AA machine client',
        clientType: ClientType.machine,
        domainName: 'own-domain',
        supportedDelegationTypes: [AuthDelegationType.Custom],
        allowedScopes: [
          { clientId: 'own-machine-client', scopeName: 'own-s1' },
        ],
      })
      await factory.createClient({
        clientId: 'own-client-guardian',
        clientName: 'D client',
        domainName: 'own-domain',
        supportedDelegationTypes: [AuthDelegationType.LegalGuardian],
      })
      await factory.createClient({
        clientId: 'own-client-guardian-require-scopes',
        clientName: 'E client',
        domainName: 'own-domain',
        requireApiScopes: true,
        supportedDelegationTypes: [AuthDelegationType.LegalGuardian],
        allowedScopes: [
          {
            clientId: 'own-client-guardian-require-scopes',
            scopeName: 'own-s1',
          },
        ],
      })
      await factory.createClient({
        clientId: 'own-client-protected',
        clientName: 'F client',
        domainName: 'own-domain',
        requireApiScopes: true,
        supportedDelegationTypes: [AuthDelegationType.Custom],
        allowedScopes: [
          { clientId: 'own-client-protected', scopeName: 'own-protected' },
        ],
      })
      await factory.createClient({
        clientId: 'own-client-general-mandate',
        clientName: 'G client',
        domainName: 'own-domain',
        supportedDelegationTypes: [AuthDelegationType.GeneralMandate],
        allowedScopes: [
          { clientId: 'own-client-general-mandate', scopeName: 'own-s1' },
        ],
      })
      for (const [clientId, clientName] of [
        ['own-client-archived', 'H archived client'],
        ['own-client-disabled', 'I disabled client'],
      ]) {
        await factory.createClient({
          clientId,
          clientName,
          domainName: 'own-domain',
          supportedDelegationTypes: [AuthDelegationType.Custom],
          allowedScopes: [{ clientId, scopeName: 'own-s1' }],
        })
      }
      const clientModel = app.get<typeof Client>(getModelToken(Client))
      await clientModel.update(
        { archived: new Date() },
        { where: { clientId: 'own-client-archived' } },
      )
      await clientModel.update(
        { enabled: false },
        { where: { clientId: 'own-client-disabled' } },
      )
      await factory.createClient({
        clientId: 'other-client',
        clientName: 'Other client',
        domainName: 'other-domain',
        supportedDelegationTypes: [AuthDelegationType.Custom],
        allowedScopes: [{ clientId: 'other-client', scopeName: 'other-s1' }],
      })
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    it('should list delegations with the organization clients they apply to', async () => {
      // Arrange
      const outgoing = await factory.createCustomDelegation({
        fromNationalId: personNationalId,
        domainName: 'own-domain',
        scopes: [{ scopeName: 'own-s1' }, { scopeName: 'own-s2' }],
      })
      const incoming = await factory.createCustomDelegation({
        toNationalId: personNationalId,
        domainName: 'own-domain',
        scopes: [{ scopeName: 'own-s2' }],
      })
      await factory.createCustomDelegation({
        toNationalId: personNationalId,
        domainName: 'other-domain',
        scopes: [{ scopeName: 'other-s1' }],
      })

      // Act
      const res = await getRequestMethod(
        server,
        'GET',
      )(path).set('X-Query-National-Id', personNationalId)

      // Assert
      expect(res.status).toEqual(200)
      const body = res.body as DelegationOverviewDto
      expect(body.clients.map((c) => c.clientId)).toEqual([
        'own-client-a',
        'own-client-b',
        'own-client-no-custom',
        'own-client-guardian',
        'own-client-guardian-require-scopes',
        'own-client-protected',
        'own-client-general-mandate',
      ])
      expect(body.outgoing).toEqual([
        expect.objectContaining({
          id: outgoing.id,
          toNationalId: outgoing.toNationalId,
          type: AuthDelegationType.Custom,
          isActive: true,
          clientIds: ['own-client-a', 'own-client-b'],
        }),
      ])
      expect(body.outgoing[0].scopes.map((s) => s.scopeName).sort()).toEqual([
        'own-s1',
        'own-s2',
      ])
      expect(body.incoming).toEqual([
        expect.objectContaining({
          id: incoming.id,
          fromNationalId: incoming.fromNationalId,
          clientIds: ['own-client-b'],
          scopes: [expect.objectContaining({ scopeName: 'own-s2' })],
        }),
      ])
    })

    it('should include delegation index records on clients supporting their type', async () => {
      // Arrange
      const nationalId = createNationalId('person')
      const companyNationalId = createNationalId('company')
      const expiredCompanyNationalId = createNationalId('company')
      const wardNationalId = createNationalId('person')
      await factory.createDelegationIndexRecord({
        fromNationalId: companyNationalId,
        toNationalId: nationalId,
        type: AuthDelegationType.ProcurationHolder,
        provider: AuthDelegationProvider.CompanyRegistry,
      })
      await factory.createDelegationIndexRecord({
        fromNationalId: nationalId,
        toNationalId: wardNationalId,
        type: AuthDelegationType.LegalGuardian,
        provider: AuthDelegationProvider.NationalRegistry,
      })
      await factory.createDelegationIndexRecord({
        fromNationalId: expiredCompanyNationalId,
        toNationalId: nationalId,
        type: AuthDelegationType.ProcurationHolder,
        provider: AuthDelegationProvider.CompanyRegistry,
        validTo: new Date(Date.now() - 24 * 60 * 60 * 1000),
      })
      await factory.createDelegationIndexRecord({
        toNationalId: nationalId,
        type: AuthDelegationType.Custom,
        provider: AuthDelegationProvider.Custom,
        customDelegationScopes: ['own-s1'],
      })

      // Act
      const res = await getRequestMethod(
        server,
        'GET',
      )(path).set('X-Query-National-Id', nationalId)

      // Assert
      expect(res.status).toEqual(200)
      const body = res.body as DelegationOverviewDto
      expect(body.incoming).toHaveLength(2)
      expect(body.incoming).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            fromNationalId: companyNationalId,
            type: AuthDelegationType.ProcurationHolder,
            isActive: true,
            clientIds: ['own-client-no-custom'],
          }),
          expect.objectContaining({
            fromNationalId: expiredCompanyNationalId,
            isActive: false,
            clientIds: ['own-client-no-custom'],
          }),
        ]),
      )
      expect(body.outgoing).toEqual([
        expect.objectContaining({
          toNationalId: wardNationalId,
          type: AuthDelegationType.LegalGuardian,
          clientIds: [
            'own-client-guardian',
            'own-client-guardian-require-scopes',
          ],
        }),
      ])
    })

    it('should include expired delegations as inactive', async () => {
      // Arrange
      const nationalId = createNationalId('person')
      const expired = await factory.createCustomDelegation({
        toNationalId: nationalId,
        domainName: 'own-domain',
        scopes: [
          {
            scopeName: 'own-s1',
            validFrom: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            validTo: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
        ],
      })

      // Act
      const res = await getRequestMethod(
        server,
        'GET',
      )(path).set('X-Query-National-Id', nationalId)

      // Assert
      expect(res.status).toEqual(200)
      expect((res.body as DelegationOverviewDto).incoming).toEqual([
        expect.objectContaining({
          id: expired.id,
          isActive: false,
          clientIds: ['own-client-a', 'own-client-b'],
        }),
      ])
    })

    it.each([
      ['missing', undefined],
      ['invalid', '1234567890'],
    ])(
      'should return 400 when the national id is %s',
      async (_, nationalId) => {
        // Act
        const req = getRequestMethod(server, 'GET')(path)
        const res = await (nationalId
          ? req.set('X-Query-National-Id', nationalId)
          : req)

        // Assert
        expect(res.status).toEqual(400)
      },
    )

    it('should read general mandates from the delegation table', async () => {
      // Arrange
      const nationalId = createNationalId('person')
      await factory.createDelegationType({
        id: AuthDelegationType.GeneralMandate,
        providerId: AuthDelegationProvider.Custom,
      })
      const generalMandate = await app
        .get<typeof Delegation>(getModelToken(Delegation))
        .create({
          id: faker.datatype.uuid(),
          fromNationalId: createNationalId('person'),
          toNationalId: nationalId,
          fromDisplayName: faker.name.findName(),
          toName: faker.name.findName(),
        })
      await app
        .get<typeof DelegationDelegationType>(
          getModelToken(DelegationDelegationType),
        )
        .create({
          delegationId: generalMandate.id,
          delegationTypeId: AuthDelegationType.GeneralMandate,
        })

      // Act
      const res = await getRequestMethod(
        server,
        'GET',
      )(path).set('X-Query-National-Id', nationalId)

      // Assert
      expect(res.status).toEqual(200)
      expect((res.body as DelegationOverviewDto).incoming).toEqual([
        expect.objectContaining({
          id: generalMandate.id,
          type: AuthDelegationType.GeneralMandate,
          isActive: true,
          clientIds: ['own-client-general-mandate'],
        }),
      ])
    })

    it('should return no delegations when the person has none on the organization clients', async () => {
      // Act
      const res = await getRequestMethod(
        server,
        'GET',
      )(path).set('X-Query-National-Id', createNationalId('person'))

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject({ incoming: [], outgoing: [] })
    })
  })

  describe('as another organization', () => {
    const otherOrganizationUser = createCurrentUser({
      nationalIdType: 'company',
      scope: [DelegationAdminScopes.institution],
    })
    let app: TestApp
    let server: request.SuperTest<request.Test>
    let factory: FixtureFactory

    beforeAll(async () => {
      app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: otherOrganizationUser,
        dbType: 'postgres',
      })
      server = request(app.getHttpServer())
      factory = new FixtureFactory(app)
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    it("should not return delegations on another organization's clients", async () => {
      // Arrange
      const nationalId = createNationalId('person')
      await factory.createDomain({
        name: 'someone-elses-domain',
        nationalId: createNationalId('company'),
        apiScopes: [
          {
            name: 'someone-elses-s1',
            supportedDelegationTypes: [AuthDelegationType.Custom],
          },
        ],
      })
      await factory.createClient({
        clientId: 'someone-elses-client',
        domainName: 'someone-elses-domain',
        supportedDelegationTypes: [AuthDelegationType.Custom],
        allowedScopes: [
          {
            clientId: 'someone-elses-client',
            scopeName: 'someone-elses-s1',
          },
        ],
      })
      await factory.createCustomDelegation({
        toNationalId: nationalId,
        domainName: 'someone-elses-domain',
        scopes: [{ scopeName: 'someone-elses-s1' }],
      })

      // Act
      const res = await getRequestMethod(
        server,
        'GET',
      )(path).set('X-Query-National-Id', nationalId)

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toEqual({ clients: [], incoming: [], outgoing: [] })
    })
  })
})
