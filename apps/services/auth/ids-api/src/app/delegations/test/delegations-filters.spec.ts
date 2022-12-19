import { TestApp } from '@island.is/testing/nest'
import { testCases } from './delegations-filters-test-cases'
import request from 'supertest'
import faker from 'faker'
import { setupWithAuth } from '../../../../test/setup'
import { createNationalRegistryUser } from '@island.is/testing/fixtures'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import { DelegationDTO } from '@island.is/auth-api-lib'
import { FixtureFactory } from '../../../../test/fixtures/fixture-factory'
import { RskProcuringClient } from '@island.is/clients/rsk/procuring'

describe('DelegationsController', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>
  let factory: FixtureFactory
  let nationalRegistryApi: NationalRegistryClientService
  let rskApi: RskProcuringClient

  describe.each(Object.keys(testCases))(
    'Delegation filtering with test case: %s',
    (caseName) => {
      const testCase = testCases[caseName]
      const path = '/v2/delegations'

      beforeAll(async () => {
        app = await setupWithAuth({
          user: testCase.user,
        })
        server = request(app.getHttpServer())
        nationalRegistryApi = app.get(NationalRegistryClientService)
        jest
          .spyOn(nationalRegistryApi, 'getIndividual')
          .mockImplementation(async (nationalId: string) =>
            createNationalRegistryUser({
              nationalId,
              name: faker.name.findName(),
            }),
          )

        rskApi = app.get(RskProcuringClient)
      })

      beforeEach(async () => {
        factory = new FixtureFactory(app)

        await factory.createDomain(testCase.domain)

        await factory.createClient(testCase.client)

        await Promise.all(
          testCase.clientAllowedScopes.map((scope) =>
            factory.createClientAllowedScope(scope),
          ),
        )

        await Promise.all(
          testCase.apiScopes.map((scope) => factory.createApiScope(scope)),
        )

        await Promise.all(
          testCase.apiScopeUserAccess.map((access) =>
            factory.createApiScopeUserAccess(access),
          ),
        )

        await Promise.all(
          testCase.customDelegations.map((delegation) =>
            factory.createCustomDelegation(delegation),
          ),
        )

        jest
          .spyOn(nationalRegistryApi, 'getCustodyChildren')
          .mockImplementationOnce(async () => testCase.fromChildren)

        jest
          .spyOn(rskApi, 'getSimple')
          .mockImplementationOnce(async () => testCase.procuration)
      })

      afterAll(async () => {
        await app.cleanUp()
      })

      it(`GET ${path} returns correct filtered delegations`, async () => {
        const res = await server.get(path)

        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(testCase.expectedFrom.length)
        expect(res.body.map((d: DelegationDTO) => d.fromNationalId)).toEqual(
          testCase.expectedFrom,
        )
      })
    },
  )
})
