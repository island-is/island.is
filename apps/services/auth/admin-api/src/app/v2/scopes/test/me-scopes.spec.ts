import request from 'supertest'

import { AdminPortalScope } from '@island.is/auth/scopes'
import { AdminScopeDto, SequelizeConfigService } from '@island.is/auth-api-lib'
import { FixtureFactory } from '@island.is/services/auth/testing'
import { AuthDelegationType } from '@island.is/shared/types'
import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'
import { setupApp, TestApp } from '@island.is/testing/nest'
import { User } from '@island.is/auth-nest-tools'

import { AppModule } from '../../../app.module'

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
    name: '@scope1',
    displayName: 'Scope 1 display name',
    description: 'Scope 1 description',
  },
  {
    name: '@scope',
    displayName: 'Scope 2 display name',
    description: 'Scope 2 description',
  },
]

const createTestData = async (
  app: TestApp,
  tenantId: string,
  tenantOwnerNationalId?: string,
) => {
  const fixtureFactory = new FixtureFactory(app)
  await fixtureFactory.createDomain({
    name: tenantId,
    nationalId: tenantOwnerNationalId || createNationalId('company'),
    apiScopes: mockedApiScopes,
  })
}

interface TestCase {
  user: User
  tenantId: string
  tenantOwnerNationalId?: string
  expected: {
    status: number
    body: AdminScopeDto[] | Record<string, unknown>
  }
}

const SHOULD_NOT_CREATE_TENANT_ID = '@should_not_create'

const testCases: Record<string, TestCase> = {
  'should have access as current user': {
    user: currentUser,
    tenantId: '@tenant1',
    expected: {
      status: 200,
      body: mockedApiScopes,
    },
  },
  'should have access as super user': {
    user: superUser,
    tenantId: '@tenant1',
    tenantOwnerNationalId: createNationalId('company'),
    expected: {
      status: 200,
      body: mockedApiScopes,
    },
  },
  'should return no content where user is not tenant owner': {
    user: currentUser,
    tenantId: '@tenant1',
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

describe('MeScopesController', () => {
  describe('with auth', () => {
    describe.each(Object.keys(testCases))('%s', (testCaseName) => {
      const testCase = testCases[testCaseName]
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
          await createTestData(
            app,
            testCase.tenantId,
            testCase.tenantOwnerNationalId ?? testCase.user.nationalId,
          )
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
  })
})
