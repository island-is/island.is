import request from 'supertest'

import { AdminPortalScope } from '@island.is/auth/scopes'
import { AdminScopeDTO, SequelizeConfigService } from '@island.is/auth-api-lib'
import { FixtureFactory } from '@island.is/services/auth/testing'
import { AuthDelegationType } from '@island.is/shared/types'
import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'
import { setupApp, TestApp } from '@island.is/testing/nest'
import { User } from '@island.is/auth-nest-tools'

import { AppModule } from '../../../app.module'

const CLIENT_ID = '@client1'
const TENANT_ID = '@tenant1'

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

const createMockedApiScopes = (len: number) =>
  Array.from({ length: len }).map(
    (_, i) =>
      ({
        name: `${TENANT_ID}/scope${i + 1}`,
        description: [
          {
            locale: 'is',
            value: `Scope ${i + 1} description`,
          },
        ],
        displayName: [
          {
            locale: 'is',
            value: `Scope ${i + 1} display name`,
          },
        ],
      } as AdminScopeDTO),
  )

const mockedApiScopes = createMockedApiScopes(2)

const createTestData = async ({
  app,
  tenantId,
  tenantOwnerNationalId,
  clientId,
  hasNoScopes = false,
}: {
  app: TestApp
  tenantId: string
  tenantOwnerNationalId?: string
  clientId?: string
  hasNoScopes?: boolean
}) => {
  const fixtureFactory = new FixtureFactory(app)
  await fixtureFactory.createDomain({
    name: tenantId,
    nationalId: tenantOwnerNationalId || createNationalId('company'),
    apiScopes: hasNoScopes
      ? undefined
      : mockedApiScopes.map(({ name, description, displayName }) => ({
          name,
          description: description[0].value,
          displayName: displayName[0].value,
        })),
  })
  await fixtureFactory.createClient({
    ...(clientId && {
      clientId,
      allowedScopes: mockedApiScopes.map(({ name }) => ({
        scopeName: name,
        clientId,
      })),
    }),
    domainName: tenantId,
  })
}

interface TestCase {
  user: User
  tenantId: string
  clientId: string
  tenantOwnerNationalId?: string
  hasNoScopes?: boolean
  expected: {
    status: number
    body:
      | Pick<AdminScopeDTO, 'name' | 'displayName' | 'description'>[]
      | Record<string, unknown>
  }
}

const SHOULD_NOT_CREATE_TENANT_ID = '@should_not_create_tenant'
const SHOULD_NOT_CREATE_CLIENT_ID = '@should_not_create_client'

const testCases: Record<string, TestCase> = {
  'should have access as current user': {
    user: currentUser,
    tenantId: TENANT_ID,
    clientId: CLIENT_ID,
    expected: {
      status: 200,
      body: mockedApiScopes,
    },
  },
  'should have access as super user': {
    user: superUser,
    tenantId: TENANT_ID,
    clientId: CLIENT_ID,
    tenantOwnerNationalId: createNationalId('company'),
    expected: {
      status: 200,
      body: mockedApiScopes,
    },
  },
  'should return no content where user is not tenant owner': {
    user: currentUser,
    tenantId: TENANT_ID,
    clientId: CLIENT_ID,
    tenantOwnerNationalId: createNationalId('company'),
    expected: {
      status: 204,
      body: {},
    },
  },
  'should throw no content because of tenant does not exist': {
    user: superUser,
    tenantId: SHOULD_NOT_CREATE_TENANT_ID,
    clientId: CLIENT_ID,
    expected: {
      status: 204,
      body: {},
    },
  },
  'should throw no content because client does not exist': {
    user: superUser,
    tenantId: TENANT_ID,
    clientId: SHOULD_NOT_CREATE_CLIENT_ID,
    expected: {
      status: 204,
      body: {},
    },
  },
  'should return empty array if client has no allowed scopes': {
    user: superUser,
    tenantId: TENANT_ID,
    clientId: CLIENT_ID,
    hasNoScopes: true,
    expected: {
      status: 200,
      body: [],
    },
  },
}

describe('MeClientScopesController', () => {
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
          await createTestData({
            app,
            tenantId: testCase.tenantId,
            tenantOwnerNationalId:
              testCase.tenantOwnerNationalId ?? testCase.user.nationalId,
            clientId:
              testCase.clientId === SHOULD_NOT_CREATE_CLIENT_ID
                ? undefined
                : testCase.clientId,
            hasNoScopes: testCase?.hasNoScopes ?? false,
          })
        }
      })

      it(testCaseName, async () => {
        // Act
        const response = await server.get(
          `/v2/me/tenants/${encodeURIComponent(
            testCase.tenantId,
          )}/clients/${encodeURIComponent(testCase.clientId)}/scopes`,
        )

        // Assert
        expect(response.status).toEqual(testCase.expected.status)
        expect(response.body).toMatchObject(testCase.expected.body)
      })
    })
  })
})
