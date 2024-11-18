import { getModelToken } from '@nestjs/sequelize'
import assert from 'assert'
import faker from 'faker'
import { Op } from 'sequelize'
import request from 'supertest'

import {
  Delegation,
  DelegationScope,
  DelegationsIndexService,
} from '@island.is/auth-api-lib'
import { RskRelationshipsClient } from '@island.is/clients-rsk-relationships'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import { CompanyRegistryClientService } from '@island.is/clients/rsk/company-registry'
import {
  expectMatchingDelegations,
  FixtureFactory,
} from '@island.is/services/auth/testing'
import { createNationalRegistryUser } from '@island.is/testing/fixtures'
import { TestApp } from '@island.is/testing/nest'

import { accessIncomingTestCases } from '../../../../test/access-incoming-test-cases'
import { setupWithAuth } from '../../../../test/setup'
import { filterExpectedDelegations } from './utils'

describe('MeDelegationsController', () => {
  describe.each(Object.keys(accessIncomingTestCases))(
    'Incoming Access with test case: %s',
    (caseName) => {
      const testCase = accessIncomingTestCases[caseName]
      let app: TestApp
      let server: request.SuperTest<request.Test>
      let factory: FixtureFactory
      let delegations: Delegation[] = []
      const fromName = faker.name.findName()
      let delegationIndexService: DelegationsIndexService

      beforeAll(async () => {
        // Arrange
        app = await setupWithAuth({
          user: testCase.user,
          customScopeRules: testCase.customScopeRules,
        })
        server = request(app.getHttpServer())
        delegationIndexService = app.get(DelegationsIndexService)
        const rskRelationshipsClientService = app.get(RskRelationshipsClient)
        const nationalRegistryClientService = app.get(
          NationalRegistryClientService,
        )
        const companyRegistryClientService = app.get(
          CompanyRegistryClientService,
        )
        jest
          .spyOn(nationalRegistryClientService, 'getCustodyChildren')
          .mockImplementation(async () => [])
        jest
          .spyOn(nationalRegistryClientService, 'getIndividual')
          .mockImplementation(async (nationalId: string) =>
            createNationalRegistryUser({
              nationalId,
              name: fromName,
            }),
          )
        jest
          .spyOn(rskRelationshipsClientService, 'getIndividualRelationships')
          .mockImplementation(async () => null)
        jest
          .spyOn(companyRegistryClientService, 'getCompany')
          .mockImplementation(async () => null)
        jest
          .spyOn(delegationIndexService, 'indexDelegations')
          .mockImplementation()
        jest
          .spyOn(delegationIndexService, 'indexCustomDelegations')
          .mockImplementation()

        factory = new FixtureFactory(app)
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
      })

      beforeEach(async () => {
        if (delegations) {
          await Delegation.destroy({
            where: {
              id: { [Op.in]: delegations.map((delegation) => delegation.id) },
            },
          })
        }

        delegations = await Promise.all(
          (testCase.delegations ?? []).map((delegation) =>
            factory.createCustomDelegation({
              toNationalId: testCase.user.nationalId,
              fromName,
              ...delegation,
            }),
          ),
        )
      })

      it('GET /v1/me/delegations?direction=incoming filters delegations', async () => {
        // Arrange
        const expectedDelegations = filterExpectedDelegations(
          delegations,
          testCase.expected,
        )

        // Act
        const res = await server.get('/v1/me/delegations?direction=incoming')

        // Assert
        expect(delegationIndexService.indexDelegations).toHaveBeenCalled()
        expect(res.status).toEqual(200)
        expectMatchingDelegations(res.body, expectedDelegations)
      })

      if (testCase.expected.length > 0) {
        it.each(testCase.expected)(
          'GET /v1/me/delegation/:id finds delegation in domain $name',
          async (domain) => {
            // Arrange
            const expectedDelegation = filterExpectedDelegations(
              delegations,
              testCase.expected,
            ).find((delegation) => delegation.domainName === domain.name)
            assert(expectedDelegation)

            // Act
            const res = await server.get(
              `/v1/me/delegations/${expectedDelegation.id}`,
            )

            // Assert
            expect(res.status).toEqual(200)
            expectMatchingDelegations(res.body, expectedDelegation)
          },
        )

        it.each(testCase.expected)(
          'DELETE /v1/me/delegations/:id removes access to delegation',
          async (domain) => {
            // Arrange
            const delegationScopeModel = app.get<typeof DelegationScope>(
              getModelToken(DelegationScope),
            )
            const delegationModel = app.get<typeof DelegationScope>(
              getModelToken(Delegation),
            )
            const delegation = delegations.find(
              (delegation) =>
                delegation.domainName === domain.name &&
                delegation.toNationalId === testCase.user.nationalId,
            )
            assert(delegation)

            // Act
            const res = await server.delete(
              `/v1/me/delegations/${delegation.id}`,
            )

            // Assert
            expect(res.status).toEqual(204)
            expect(
              delegationIndexService.indexCustomDelegations,
            ).toHaveBeenCalled()

            const delegationAfter = await delegationModel.findByPk(
              delegation.id,
            )
            expect(delegationAfter).toBeNull()

            const scopesAfter = await delegationScopeModel.findAll({
              where: {
                delegationId: delegation.id,
                scopeName:
                  delegation.delegationScopes?.map(
                    (scope) => scope.scopeName,
                  ) ?? [],
              },
            })
            expect(scopesAfter).toHaveLength(0)
          },
        )
      }

      if (testCase.expected.length === 0 && delegations.length > 0) {
        it.each(delegations)(
          'GET /v1/me/delegation/:id returns no content response for $name',
          async (delegation) => {
            // Act
            const res = await server.get(`/v1/me/delegations/${delegation.id}`)

            // Assert
            expect(res.status).toEqual(204)
            expect(res.body).toMatchObject({})
          },
        )
      }
    },
  )
})
