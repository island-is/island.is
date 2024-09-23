import { getModelToken } from '@nestjs/sequelize'
import request from 'supertest'
import { uuid } from 'uuidv4'
import addDays from 'date-fns/addDays'

import {
  ApiScope,
  ApiScopeDelegationType,
  Delegation,
  DelegationDelegationType,
  DelegationProviderModel,
  DelegationScope,
  DelegationTypeModel,
  Domain,
} from '@island.is/auth-api-lib'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import {
  createClient,
  createDomain,
  FixtureFactory,
} from '@island.is/services/auth/testing'
import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/shared/types'
import {
  createCurrentUser,
  createNationalRegistryUser,
} from '@island.is/testing/fixtures'
import { TestApp } from '@island.is/testing/nest'

import { defaultScopes, setupWithAuth } from '../../../../test/setup'
import { getFakeNationalId } from '../../../../test/stubs/genericStubs'

describe('DelegationsController', () => {
  describe('Given a user is authenticated', () => {
    let app: TestApp
    let factory: FixtureFactory
    let server: request.SuperTest<request.Test>

    let apiScopeModel: typeof ApiScope
    let apiScopeDelegationTypeModel: typeof ApiScopeDelegationType
    let delegationDelegationTypeModel: typeof DelegationDelegationType
    let delegationModel: typeof Delegation
    let delegationTypeModel: typeof DelegationTypeModel
    let nationalRegistryApi: NationalRegistryClientService
    let delegationProviderModel: typeof DelegationProviderModel
    let delegationScopesModel: typeof DelegationScope

    const client = createClient({
      clientId: '@island.is/webapp',
    })

    const scopeValid1 = 'scope/valid1'
    const scopeValid2 = 'scope/valid2'
    const scopeValid1and2 = 'scope/valid1and2'
    const scopeUnactiveType = 'scope/unactiveType'
    const scopeOutdated = 'scope/outdated'
    const disabledScope = 'disabledScope'

    client.allowedScopes = Object.values([
      scopeValid1,
      scopeValid2,
      scopeValid1and2,
      scopeUnactiveType,
      scopeOutdated,
      disabledScope,
    ]).map((s) => ({
      clientId: client.clientId,
      scopeName: s,
    }))

    const userNationalId = getFakeNationalId()

    const user = createCurrentUser({
      nationalId: userNationalId,
      scope: [defaultScopes.testUserHasAccess.name],
      client: client.clientId,
    })

    const domain = createDomain()

    beforeAll(async () => {
      app = await setupWithAuth({
        user,
      })
      server = request(app.getHttpServer())

      const domainModel = app.get<typeof Domain>(getModelToken(Domain))
      await domainModel.create(domain)

      apiScopeModel = app.get<typeof ApiScope>(getModelToken(ApiScope))

      apiScopeDelegationTypeModel = app.get<typeof ApiScopeDelegationType>(
        getModelToken(ApiScopeDelegationType),
      )
      delegationTypeModel = app.get<typeof DelegationTypeModel>(
        getModelToken(DelegationTypeModel),
      )
      delegationProviderModel = app.get<typeof DelegationProviderModel>(
        getModelToken(DelegationProviderModel),
      )
      delegationScopesModel = app.get<typeof DelegationScope>(
        getModelToken(DelegationScope),
      )
      delegationModel = app.get<typeof Delegation>(getModelToken(Delegation))
      delegationDelegationTypeModel = app.get<typeof DelegationDelegationType>(
        getModelToken(DelegationDelegationType),
      )
      nationalRegistryApi = app.get(NationalRegistryClientService)
      factory = new FixtureFactory(app)
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    describe('GET with general mandate delegation type', () => {
      const representeeNationalId = getFakeNationalId()
      let nationalRegistryApiSpy: jest.SpyInstance
      const scopeNames = [
        'api-scope/generalMandate1',
        'api-scope/generalMandate2',
        'api-scope/generalMandate3',
      ]

      beforeAll(async () => {
        client.supportedDelegationTypes = [
          AuthDelegationType.GeneralMandate,
          AuthDelegationType.LegalGuardian,
        ]
        await factory.createClient(client)

        const delegations = await delegationModel.create({
          id: uuid(),
          fromDisplayName: 'Test',
          fromNationalId: representeeNationalId,
          toNationalId: userNationalId,
          toName: 'Test',
        })

        await delegationProviderModel.create({
          id: AuthDelegationProvider.Custom,
          name: 'Custom',
          description: 'Custom',
        })

        await delegationDelegationTypeModel.create({
          delegationId: delegations.id,
          delegationTypeId: AuthDelegationType.GeneralMandate,
        })

        await apiScopeModel.bulkCreate(
          scopeNames.map((name) => ({
            name,
            domainName: domain.name,
            enabled: true,
            description: `${name}: description`,
            displayName: `${name}: display name`,
          })),
        )

        // set 2 of 3 scopes to have general mandate delegation type
        await apiScopeDelegationTypeModel.bulkCreate([
          {
            apiScopeName: scopeNames[0],
            delegationType: AuthDelegationType.GeneralMandate,
          },
          {
            apiScopeName: scopeNames[1],
            delegationType: AuthDelegationType.GeneralMandate,
          },
        ])

        nationalRegistryApiSpy = jest
          .spyOn(nationalRegistryApi, 'getIndividual')
          .mockImplementation(async (id) => {
            const user = createNationalRegistryUser({
              nationalId: representeeNationalId,
            })

            return user ?? null
          })
      })

      afterAll(async () => {
        await app.cleanUp()
        nationalRegistryApiSpy.mockClear()
      })

      it('should return mergedDelegationDTO with the generalMandate', async () => {
        const response = await server.get('/v2/delegations')

        expect(response.status).toEqual(200)
        expect(response.body).toHaveLength(1)
      })

      it('should get all general mandate scopes', async () => {
        const response = await server.get('/delegations/scopes').query({
          fromNationalId: representeeNationalId,
          delegationType: [AuthDelegationType.GeneralMandate],
        })

        expect(response.status).toEqual(200)
        expect(response.body).toEqual([scopeNames[0], scopeNames[1]])
      })

      it('should only return valid general mandates', async () => {
        const newNationalId = getFakeNationalId()
        const newDelegation = await delegationModel.create({
          id: uuid(),
          fromDisplayName: 'Test',
          fromNationalId: newNationalId,
          toNationalId: userNationalId,
          toName: 'Test',
        })

        await delegationDelegationTypeModel.create({
          delegationId: newDelegation.id,
          delegationTypeId: AuthDelegationType.GeneralMandate,
          validTo: addDays(new Date(), -2),
        })

        const response = await server.get('/delegations/scopes').query({
          fromNationalId: newNationalId,
          delegationType: [AuthDelegationType.GeneralMandate],
        })

        expect(response.status).toEqual(200)
        expect(response.body).toEqual([])
      })

      it('should return all general mandate scopes and other preset scopes', async () => {
        const newDelegation = await delegationModel.create({
          id: uuid(),
          fromDisplayName: 'Test',
          fromNationalId: representeeNationalId,
          domainName: domain.name,
          toNationalId: userNationalId,
          toName: 'Test',
        })

        await delegationTypeModel.create({
          id: AuthDelegationType.Custom,
          name: 'custom',
          description: 'custom',
          providerId: AuthDelegationProvider.Custom,
        })

        await delegationScopesModel.create({
          id: uuid(),
          delegationId: newDelegation.id,
          scopeName: scopeNames[2],
          // set valid from as yesterday and valid to as tomorrow
          validFrom: addDays(new Date(), -1),
          validTo: addDays(new Date(), 1),
        })

        await apiScopeDelegationTypeModel.create({
          apiScopeName: scopeNames[2],
          delegationType: AuthDelegationType.LegalGuardian,
        })

        const response = await server.get('/delegations/scopes').query({
          fromNationalId: representeeNationalId,
          delegationType: [
            AuthDelegationType.GeneralMandate,
            AuthDelegationType.LegalGuardian,
          ],
        })

        expect(response.status).toEqual(200)
        expect(response.body).toEqual(expect.arrayContaining(scopeNames))
        expect(response.body).toHaveLength(scopeNames.length)
      })
    })
  })
})
