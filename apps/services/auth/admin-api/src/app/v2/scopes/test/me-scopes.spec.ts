import request from 'supertest'
import { getModelToken } from '@nestjs/sequelize'

import { faker } from '@island.is/shared/mocking'
import { AdminPortalScope } from '@island.is/auth/scopes'
import {
  AdminCreateScopeDto,
  AdminScopeDTO,
  ApiScopeUserClaim,
  SequelizeConfigService,
  TranslatedValueDto,
} from '@island.is/auth-api-lib'
import { FixtureFactory } from '@island.is/services/auth/testing'
import { AuthDelegationType } from '@island.is/shared/types'
import { isDefined } from '@island.is/shared/utils'
import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'
import { setupApp, TestApp } from '@island.is/testing/nest'
import { User } from '@island.is/auth-nest-tools'

import { AppModule } from '../../../app.module'

const TENANT_ID = '@tenant'
const SHOULD_NOT_CREATE_TENANT_ID = '@should_not_create'

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

const createMockedApiScopes = (
  len = 3,
  scope?: Partial<Omit<AdminScopeDTO, 'name' | 'displayName' | 'description'>>,
) =>
  Array.from({ length: len }).map(
    (_, i) =>
      ({
        name: `${TENANT_ID}/scope${i + 1}`,
        description: [
          {
            locale: 'is',
            value: `Scope ${i + 1} description`,
          },
          {
            locale: 'en',
            value: `Scope ${i + 1} EN description`,
          },
        ],
        displayName: [
          {
            locale: 'is',
            value: `Scope ${i + 1} display name`,
          },
          {
            locale: 'en',
            value: `Scope ${i + 1} EN display name`,
          },
        ],
        domainName: TENANT_ID,
        customDelegationOnlyFor:
          i === 0 ? [AuthDelegationType.ProcurationHolder] : undefined,
        ...scope,
      } as AdminScopeDTO),
  )

const mockedApiScopes = createMockedApiScopes(2)

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
  const domain = await fixtureFactory.createDomain({
    name: tenantId,
    nationalId: tenantOwnerNationalId || createNationalId('company'),
    apiScopes: mockedApiScopes.map(({ name, displayName, description }) => ({
      name,
      displayName: displayName[0].value,
      description: description[0].value,
    })),
  })

  if (domain.scopes) {
    await Promise.all(
      domain.scopes.map((apiScope, i) =>
        fixtureFactory.createTranslations(apiScope, 'en', {
          displayName: `Scope ${i + 1} EN display name`,
          description: `Scope ${i + 1} EN description`,
        }),
      ),
    )
  }
}

interface GetTestCase {
  user: User
  tenantId: string
  tenantOwnerNationalId?: string
  expected: {
    status: number
    body:
      | Pick<AdminScopeDTO, 'name' | 'displayName' | 'description'>[]
      | Record<string, unknown>
  }
}

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

interface GetSingleTestCase extends GetTestCase {
  scopeName: string
  user: User
  tenantId: string
  tenantOwnerNationalId?: string
  expected: {
    status: number
    body:
      | Pick<AdminScopeDTO, 'name' | 'displayName' | 'description'>
      | Record<string, unknown>
  }
}

const getSingleTestCases: Record<string, GetSingleTestCase> = {
  'should have access as current user': {
    user: currentUser,
    tenantId: TENANT_ID,
    scopeName: mockedApiScopes[0].name,
    expected: {
      status: 200,
      body: mockedApiScopes[0],
    },
  },
  'should have access as super user': {
    user: superUser,
    tenantId: TENANT_ID,
    scopeName: mockedApiScopes[0].name,
    tenantOwnerNationalId: createNationalId('company'),
    expected: {
      status: 200,
      body: mockedApiScopes[0],
    },
  },
  'should return no content where user is not tenant owner': {
    user: currentUser,
    tenantId: TENANT_ID,
    scopeName: mockedApiScopes[0].name,
    tenantOwnerNationalId: createNationalId('company'),
    expected: {
      status: 204,
      body: {},
    },
  },
  'should throw no content because of tenant does not exist': {
    user: superUser,
    tenantId: SHOULD_NOT_CREATE_TENANT_ID,
    scopeName: mockedApiScopes[0].name,
    expected: {
      status: 204,
      body: {},
    },
  },
}

interface CreateTestCase {
  user: User
  tenantId: string
  input: AdminCreateScopeDto
  expected: {
    status: number
    body: AdminScopeDTO | Record<string, unknown>
  }
}

const mockedCreateApiScope = createMockedApiScopes(1)[0]

const createInput = {
  name: `${TENANT_ID}/${faker.random.word()}`,
  displayName: [
    {
      locale: 'is',
      value: faker.random.word(),
    },
  ],
  description: [
    {
      locale: 'is',
      value: faker.random.words(),
    },
  ],
}

const expectedCreateOutput = {
  ...mockedCreateApiScope,
  ...createInput,
}

const createTestCases: Record<string, CreateTestCase> = {
  'should create scope and have access as current user': {
    user: currentUser,
    tenantId: TENANT_ID,
    input: createInput,
    expected: {
      status: 200,
      body: expectedCreateOutput,
    },
  },
  'should create scope and have access as super user': {
    user: superUser,
    tenantId: TENANT_ID,
    input: createInput,
    expected: {
      status: 200,
      body: expectedCreateOutput,
    },
  },
  'should create scope with additional fields and have access as current user':
    {
      user: currentUser,
      tenantId: TENANT_ID,
      input: {
        ...createInput,
        grantToAuthenticatedUser: true,
        grantToLegalGuardians: true,
      },
      expected: {
        status: 200,
        body: {
          ...expectedCreateOutput,
          grantToAuthenticatedUser: true,
          grantToLegalGuardians: true,
          customDelegationOnlyFor: [AuthDelegationType.ProcurationHolder],
        },
      },
    },
  'should return a bad request because of invalid input': {
    user: superUser,
    tenantId: TENANT_ID,
    input: {} as typeof createInput,
    expected: {
      status: 400,
      body: {
        detail: ['name should not be empty', 'name must be a string'],
      },
    },
  },
  'should return a bad request because of missing displayName and description':
    {
      user: superUser,
      tenantId: TENANT_ID,
      input: { name: createInput.name } as typeof createInput,
      expected: {
        status: 400,
        body: {
          detail: 'Scope displayName and description are required',
        },
      },
    },
  'should return a bad request because of invalid scope name': {
    user: superUser,
    tenantId: TENANT_ID,
    input: {
      ...createInput,
      name: 'invalid_scope_name',
    },
    expected: {
      status: 400,
      body: {
        detail: 'Invalid scope name: "invalid_scope_name"',
      },
    },
  },
  'should return a bad request because of illegal fields': {
    user: superUser,
    tenantId: TENANT_ID,
    input: { ...createInput, enabled: false } as typeof createInput,
    expected: {
      status: 400,
      body: {
        detail: ['property enabled should not exist'],
      },
    },
  },
  'should return bad request for illegal value in customDelegationOnlyFor': {
    user: superUser,
    tenantId: TENANT_ID,
    input: {
      ...createInput,
      customDelegationOnlyFor: [AuthDelegationType.LegalGuardian] as any,
    },
    expected: {
      status: 400,
      body: {
        detail: [
          'each value in customDelegationOnlyFor must be one of the following values: ProcurationHolder, Custom',
        ],
      },
    },
  },
}

interface PatchTestCase {
  user: User
  tenantId: string
  scopeName: string
  input: {
    displayName?: TranslatedValueDto[]
    description?: TranslatedValueDto[]
    grantToAuthenticatedUser?: boolean
    grantToLegalGuardians?: boolean
    grantToProcuringHolders?: boolean
    allowExplicitDelegationGrant?: boolean
    grantToPersonalRepresentatives?: boolean
    isAccessControlled?: boolean
  }
  expected: {
    status: number
    body: AdminScopeDTO | Record<string, unknown>
  }
}

const mockedPatchApiScope = createMockedApiScopes(1, {
  grantToAuthenticatedUser: false,
  grantToLegalGuardians: false,
  grantToProcuringHolders: false,
  allowExplicitDelegationGrant: false,
  isAccessControlled: false,
  grantToPersonalRepresentatives: false,
})[0]

const inputPatch = {
  displayName: [
    {
      locale: 'is',
      value: 'Updated scope displayName',
    },
    {
      locale: 'en',
      value: 'Updated EN scope displayName',
    },
  ],
  description: [
    {
      locale: 'is',
      value: 'Updated scope description',
    },
    {
      locale: 'en',
      value: 'Updated EN scope description',
    },
  ],
  grantToAuthenticatedUser: true,
  grantToLegalGuardians: true,
  grantToProcuringHolders: true,
  customDelegationOnlyFor: [AuthDelegationType.ProcurationHolder],
  allowExplicitDelegationGrant: true,
  isAccessControlled: true,
}

const patchExpectedOutput = {
  alsoForDelegatedUser: false,
  automaticDelegationGrant: false,
  domainName: TENANT_ID,
  emphasize: false,
  enabled: true,
  grantToPersonalRepresentatives: false,
  name: `${TENANT_ID}/scope1`,
  order: 0,
  required: false,
  showInDiscoveryDocument: true,
  ...inputPatch,
}

const patchTestCases: Record<string, PatchTestCase> = {
  'should not update scope since user is not a super user and input contains super user fields':
    {
      user: currentUser,
      tenantId: TENANT_ID,
      scopeName: mockedPatchApiScope.name,
      input: inputPatch,
      expected: {
        status: 403,
        body: {
          detail: 'User does not have access to update admin controlled fields',
          status: 403,
          title: 'Forbidden',
          type: 'https://httpstatuses.org/403',
        },
      },
    },
  'should update scope even though user is not a super user since there are no super admin fields':
    {
      user: currentUser,
      tenantId: TENANT_ID,
      scopeName: mockedPatchApiScope.name,
      input: {
        description: inputPatch.description,
        displayName: inputPatch.displayName,
      },
      expected: {
        status: 200,
        body: {
          ...patchExpectedOutput,
          grantToAuthenticatedUser: true,
          grantToLegalGuardians: false,
          grantToProcuringHolders: false,
          allowExplicitDelegationGrant: false,
          isAccessControlled: false,
        },
      },
    },
  'should update scope and have access as super user': {
    user: superUser,
    tenantId: TENANT_ID,
    scopeName: mockedPatchApiScope.name,
    input: inputPatch,
    expected: {
      status: 200,
      body: patchExpectedOutput,
    },
  },
  'should return a bad request because of invalid input': {
    user: superUser,
    tenantId: TENANT_ID,
    scopeName: mockedPatchApiScope.name,
    input: {} as typeof inputPatch,
    expected: {
      status: 400,
      body: {
        detail: 'No fields provided to update.',
        status: 400,
        title: 'Bad Request',
        type: 'https://httpstatuses.org/400',
      },
    },
  },
  'should return a bad request for unexpected input': {
    user: superUser,
    tenantId: TENANT_ID,
    scopeName: mockedPatchApiScope.name,
    input: {
      displayName: inputPatch.displayName,
      enabled: false,
    } as unknown as typeof inputPatch,
    expected: {
      status: 400,
      body: {
        detail: ['property enabled should not exist'],
        status: 400,
        title: 'Bad Request',
        type: 'https://httpstatuses.org/400',
      },
    },
  },
  'should return a no content exception because scope does not exist': {
    user: superUser,
    tenantId: TENANT_ID,
    scopeName: 'scope_does_not_exist',
    input: inputPatch,
    expected: {
      status: 204,
      body: {},
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

      it(`Get scopes: ${testCaseName}`, async () => {
        // Act
        const response = await server.get(
          `/v2/me/tenants/${testCase.tenantId}/scopes`,
        )
        // Assert
        expect(response.status).toEqual(testCase.expected.status)
        expect(response.body).toMatchObject(testCase.expected.body)
      })
    })

    // GET: /v2/me/tenants/:tenantId/scopes/:scopeName
    describe.each(Object.keys(getSingleTestCases))('%s', (testCaseName) => {
      const testCase = getSingleTestCases[testCaseName]
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

      it(`Get scope: ${testCaseName}`, async () => {
        // Act
        const response = await server.get(
          `/v2/me/tenants/${testCase.tenantId}/scopes/${encodeURIComponent(
            testCase.scopeName,
          )}`,
        )

        // Assert
        expect(response.status).toEqual(testCase.expected.status)

        if (response.status === 204) {
          expect(response.body).toMatchObject(testCase.expected.body)
        } else {
          expect(response.body).toMatchObject({
            enabled: true,
            order: 0,
            showInDiscoveryDocument: true,
            grantToAuthenticatedUser: true,
            grantToLegalGuardians: false,
            grantToProcuringHolders: false,
            grantToPersonalRepresentatives: false,
            allowExplicitDelegationGrant: false,
            automaticDelegationGrant: false,
            alsoForDelegatedUser: false,
            isAccessControlled: false,
            required: false,
            emphasize: false,
            domainName: TENANT_ID,
            ...testCase.expected.body,
          })
        }
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

      it(`POST: ${testCaseName}`, async () => {
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
            grantToAuthenticatedUser: isDefined(
              testCase.expected.body.grantToAuthenticatedUser,
            )
              ? testCase.expected.body.grantToAuthenticatedUser
              : true,
            grantToLegalGuardians: isDefined(
              testCase.expected.body.grantToLegalGuardians,
            )
              ? testCase.expected.body.grantToLegalGuardians
              : false,
            allowExplicitDelegationGrant: false,
            alsoForDelegatedUser: false,
            automaticDelegationGrant: false,
            domainName: TENANT_ID,
            emphasize: false,
            enabled: true,
            grantToPersonalRepresentatives: false,
            grantToProcuringHolders: false,
            isAccessControlled: false,
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
          console.log(response.body)
          expect(response.body).toMatchObject(testCase.expected.body)
        }
      })
    })

    // PATCH: /v2/me/tenants/:tenantId/scopes/:scopeName
    describe.each(Object.keys(patchTestCases))('%s', (testCaseName) => {
      const testCase = patchTestCases[testCaseName]
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

      it(`PATCH: ${testCaseName}`, async () => {
        // Act
        const response = await server
          .patch(
            `/v2/me/tenants/${testCase.tenantId}/scopes/${encodeURIComponent(
              testCase.scopeName,
            )}`,
          )
          .send(testCase.input)

        // Assert response
        expect(response.status).toEqual(testCase.expected.status)
        expect(response.body).toEqual(testCase.expected.body)
      })
    })
  })
})
