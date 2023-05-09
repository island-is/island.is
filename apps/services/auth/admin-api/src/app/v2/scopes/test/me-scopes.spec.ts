import request from 'supertest'

import { AdminPortalScope } from '@island.is/auth/scopes'
import {
  AdminScopeDTO,
  ApiScopeUserClaim,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'
import { FixtureFactory } from '@island.is/services/auth/testing'
import { AuthDelegationType } from '@island.is/shared/types'
import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'
import { setupApp, TestApp } from '@island.is/testing/nest'
import { User } from '@island.is/auth-nest-tools'

import { AppModule } from '../../../app.module'
import { getModelToken } from '@nestjs/sequelize'

const TENANT_ID = '@tenant'

const currentUser = createCurrentUser({
  delegationType: AuthDelegationType.Custom,
  nationalIdType: 'company',
  scope: [AdminPortalScope.idsAdmin],
})

const superUser = createCurrentUser({
  delegationType: AuthDelegationType.Custom,
  nationalIdType: 'company',
  scope: [AdminPortalScope.idsAdminSuperUser],
})

const mockedApiScopes = [
  {
    name: `${TENANT_ID}/scope1`,
    displayName: 'Scope 1 display name',
    description: 'Scope 1 description',
  },
  {
    name: `${TENANT_ID}/scope2`,
    displayName: 'Scope 2 display name',
    description: 'Scope 2 description',
  },
]

const mockedCreateApiScope = {
  name: `${TENANT_ID}/scope`,
  displayName: 'Scope 1 display name',
  description: 'Scope 1 description',
}

type CreateTestData = {
  app: TestApp
  tenantId: string
  tenantOwnerNationalId?: string
}

const createTestData = async ({
  app,
  tenantId,
  tenantOwnerNationalId,
}: CreateTestData) => {
  const fixtureFactory = new FixtureFactory(app)
  await fixtureFactory.createDomain({
    name: tenantId,
    nationalId: tenantOwnerNationalId || createNationalId('company'),
    apiScopes: mockedApiScopes,
  })
}

interface GetTestCase {
  user: User
  tenantId: string
  tenantOwnerNationalId?: string
  expected: {
    status: number
    body: AdminScopeDTO[] | Record<string, unknown>
  }
}

const SHOULD_NOT_CREATE_TENANT_ID = '@should_not_create'

const getTestCases: Record<string, GetTestCase> = {
  'should have access as current user': {
    user: currentUser,
    tenantId: TENANT_ID,
    expected: {
      status: 200,
      body: mockedApiScopes,
    },
  },
  'should have access as super user': {
    user: superUser,
    tenantId: TENANT_ID,
    tenantOwnerNationalId: createNationalId('company'),
    expected: {
      status: 200,
      body: mockedApiScopes,
    },
  },
  'should return no content where user is not tenant owner': {
    user: currentUser,
    tenantId: TENANT_ID,
    tenantOwnerNationalId: createNationalId('company'),
    expected: {
      status: 204,
      body: {},
    },
  },
  'should throw no content because of tenant does not exist': {
    user: superUser,
    tenantId: SHOULD_NOT_CREATE_TENANT_ID,
    expected: {
      status: 204,
      body: {},
    },
  },
}

interface CreateTestCase {
  user: User
  tenantId: string
  input: typeof mockedCreateApiScope
  expected: {
    status: number
    body: AdminScopeDTO | Record<string, unknown>
  }
}

const createTestCases: Record<string, CreateTestCase> = {
  'should create scope and have access as current user': {
    user: currentUser,
    tenantId: TENANT_ID,
    input: mockedCreateApiScope,
    expected: {
      status: 200,
      body: mockedCreateApiScope,
    },
  },
  'should create scope and have access as super user': {
    user: superUser,
    tenantId: TENANT_ID,
    input: mockedCreateApiScope,
    expected: {
      status: 200,
      body: mockedCreateApiScope,
    },
  },
  'should return a bad request because of invalid input': {
    user: superUser,
    tenantId: TENANT_ID,
    input: {} as typeof mockedCreateApiScope,
    expected: {
      status: 400,
      body: {
        detail: [
          'name should not be empty',
          'name must be a string',
          'displayName should not be empty',
          'displayName must be a string',
          'description should not be empty',
          'description must be a string',
        ],
      },
    },
  },
  'should return a bad request because of invalid scope name': {
    user: superUser,
    tenantId: TENANT_ID,
    input: {
      ...mockedCreateApiScope,
      name: 'invalid_scope_name',
    },
    expected: {
      status: 400,
      body: {
        detail: 'Invalid scope name: "invalid_scope_name"',
      },
    },
  },
}

describe('MeScopesController', () => {
  describe('with auth', () => {
    // GET: /v2/me/tenants/:tenantId/scopes
    describe.each(Object.keys(getTestCases))('%s', (testCaseName) => {
      const testCase = getTestCases[testCaseName]
      let app: TestApp
      let server: request.SuperTest<request.Test>

      beforeAll(async () => {
        app = await setupApp({
          AppModule,
          SequelizeConfigService,
          user: testCase.user,
        })
        server = request(app.getHttpServer())

        if (testCase.tenantId !== SHOULD_NOT_CREATE_TENANT_ID) {
          await createTestData({
            app,
            tenantId: testCase.tenantId,
            tenantOwnerNationalId:
              testCase.tenantOwnerNationalId ?? testCase.user.nationalId,
          })
        }
      })

      it(testCaseName, async () => {
        // Act
        const response = await server.get(
          `/v2/me/tenants/${testCase.tenantId}/scopes`,
        )
        // Assert
        expect(response.status).toEqual(testCase.expected.status)
        expect(response.body).toMatchObject(testCase.expected.body)
      })
    })

    // POST: /v2/me/tenants/:tenantId/scopes
    describe.each(Object.keys(createTestCases))('%s', (testCaseName) => {
      const testCase = createTestCases[testCaseName]
      let app: TestApp
      let server: request.SuperTest<request.Test>

      beforeAll(async () => {
        app = await setupApp({
          AppModule,
          SequelizeConfigService,
          user: testCase.user,
        })
        server = request(app.getHttpServer())

        await createTestData({
          app,
          tenantId: testCase.tenantId,
          tenantOwnerNationalId: testCase.user.nationalId,
        })
      })

      it(testCaseName, async () => {
        const apiScopeUserClaim = app.get(getModelToken(ApiScopeUserClaim))

        // Act
        const response = await server
          .post(`/v2/me/tenants/${testCase.tenantId}/scopes`)
          .send(testCase.input)

        // Assert response
        expect(response.status).toEqual(testCase.expected.status)

        if (response.status === 200) {
          // Assert response
          expect(response.body).toStrictEqual({
            ...testCase.expected.body,
            allowExplicitDelegationGrant: false,
            alsoForDelegatedUser: false,
            automaticDelegationGrant: false,
            domainName: TENANT_ID,
            emphasize: false,
            enabled: true,
            grantToAuthenticatedUser: true,
            grantToLegalGuardians: false,
            grantToPersonalRepresentatives: false,
            grantToProcuringHolders: false,
            order: 0,
            required: false,
            showInDiscoveryDocument: true,
          })

          // Assert - db record
          const dbApiScopeUserClaim = await apiScopeUserClaim.findByPk(
            response.body.name,
          )

          expect(dbApiScopeUserClaim).toMatchObject({
            apiScopeName: testCase.expected.body.name,
            claimName: 'nationalId',
          })
        } else {
          // Assert response
          expect(response.body).toMatchObject(testCase.expected.body)
        }
      })
    })
  })
})
