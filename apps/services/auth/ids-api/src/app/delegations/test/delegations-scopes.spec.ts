import { Type } from '@nestjs/common'
import { getConnectionToken } from '@nestjs/sequelize'
import faker from 'faker'
import { Sequelize } from 'sequelize-typescript'
import request from 'supertest'

import { DelegationType } from '@island.is/auth-api-lib'
import { FixtureFactory } from '@island.is/services/auth/testing'
import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'
import { TestApp, truncate } from '@island.is/testing/nest'

import { setupWithAuth } from '../../../../test/setup'

const domainName = faker.random.word()

const identityResources = ['id1', 'id2']

const legalGuardianScopes = ['lg1', 'lg2']
const procurationHolderScopes = ['ph1', 'ph2']
const customScopes1 = ['cu1', 'cu2']
const customScopes2 = ['cu3', 'cu4']

const apiScopes = [
  ...legalGuardianScopes,
  ...procurationHolderScopes,
  ...customScopes1,
  ...customScopes2,
]

const fromCustom = [
  { nationalId: createNationalId('person'), scopes: customScopes1 },
  { nationalId: createNationalId('person'), scopes: customScopes2 },
  { nationalId: createNationalId('person'), scopes: [] },
]

interface TestCase {
  fromNationalId: string
  delegationType: DelegationType[]
  expected: string[]
}

const testCases: Record<string, TestCase> = {
  '1': {
    fromNationalId: createNationalId('person'),
    delegationType: [DelegationType.LegalGuardian],
    expected: [...legalGuardianScopes, ...identityResources],
  },
  '2': {
    fromNationalId: createNationalId('company'),
    delegationType: [DelegationType.ProcurationHolder],
    expected: [...procurationHolderScopes, ...identityResources],
  },
  '3': {
    fromNationalId: fromCustom[0].nationalId,
    delegationType: [DelegationType.Custom],
    expected: [...fromCustom[0].scopes, ...identityResources],
  },
  '4': {
    fromNationalId: fromCustom[0].nationalId,
    delegationType: [DelegationType.LegalGuardian, DelegationType.Custom],
    expected: [
      ...legalGuardianScopes,
      ...fromCustom[0].scopes,
      ...identityResources,
    ],
  },
  '5': {
    fromNationalId: fromCustom[2].nationalId,
    delegationType: [DelegationType.Custom],
    expected: [],
  },
  '6': {
    fromNationalId: fromCustom[2].nationalId,
    delegationType: [DelegationType.LegalGuardian, DelegationType.Custom],
    expected: [...legalGuardianScopes, ...identityResources],
  },
}

const user = createCurrentUser({
  nationalIdType: 'person',
  scope: ['@identityserver.api/authentication'],
})

describe('DelegationsController', () => {
  let sequelize: Sequelize
  let app: TestApp
  let server: request.SuperTest<request.Test>
  let factory: FixtureFactory

  beforeAll(async () => {
    app = await setupWithAuth({
      user: user,
    })
    sequelize = await app.resolve(getConnectionToken() as Type<Sequelize>)

    server = request(app.getHttpServer())

    factory = new FixtureFactory(app)
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  describe.each(Object.keys(testCases))(
    'Delegation scopes with test case: %s',
    (caseName) => {
      const testCase = testCases[caseName]
      const path = '/v1/delegations/scopes'

      beforeAll(async () => {
        await truncate(sequelize)

        await factory.createDomain({ name: domainName })

        await Promise.all(
          identityResources.map((s) =>
            factory.createIdentityResource({
              name: s,
              description: s,
              displayName: s,
              automaticDelegationGrant: true,
            }),
          ),
        )

        await Promise.all(
          apiScopes.map((s) =>
            factory.createApiScope({
              name: s,
              description: s,
              displayName: s,
              domainName: domainName,
              grantToLegalGuardians: legalGuardianScopes.includes(s),
              grantToProcuringHolders: procurationHolderScopes.includes(s),
              allowExplicitDelegationGrant: [
                ...customScopes1,
                ...customScopes2,
              ].includes(s),
              automaticDelegationGrant: false,
              grantToPersonalRepresentatives: false,
              isAccessControlled: false,
            }),
          ),
        )

        await Promise.all(
          fromCustom.map((d) =>
            factory.createCustomDelegation({
              domainName: domainName,
              toNationalId: user.nationalId,
              fromNationalId: d.nationalId,
              scopes: d.scopes.map((s: string) => ({
                scopeName: s,
              })),
            }),
          ),
        )
      })

      it(`GET ${path} returns correct scopes`, async () => {
        const res = await server.get(
          `${path}?fromNationalId=${
            testCase.fromNationalId
          }&delegationType=${testCase.delegationType.join(',')}`,
        )

        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(testCase.expected.length)
        expect(res.body).toEqual(testCase.expected)
      })
    },
  )
})
