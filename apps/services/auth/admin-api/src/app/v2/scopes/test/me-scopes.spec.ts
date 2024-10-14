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
  ApiScopeDelegationType,
  AdminPatchScopeDto,
  ApiScope,
  SUPER_USER_DELEGATION_TYPES,
} from '@island.is/auth-api-lib'
import { FixtureFactory } from '@island.is/services/auth/testing'
import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/shared/types'
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
  supportedDelegationTypes: [],
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
        supportedDelegationTypes: [AuthDelegationType.LegalGuardian],
      },
      expected: {
        status: 200,
        body: {
          ...expectedCreateOutput,
          grantToAuthenticatedUser: true,
          grantToLegalGuardians: true,
          supportedDelegationTypes: [AuthDelegationType.LegalGuardian],
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
    addedDelegationTypes?: AuthDelegationType[]
    removedDelegationTypes?: AuthDelegationType[]
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
  isAccessControlled: true,
}

const patchExpectedOutput = {
  alsoForDelegatedUser: false,
  automaticDelegationGrant: false,
  domainName: TENANT_ID,
  emphasize: false,
  enabled: true,
  grantToPersonalRepresentatives: false,
  grantToLegalGuardians: false,
  grantToProcuringHolders: false,
  allowExplicitDelegationGrant: false,
  name: `${TENANT_ID}/scope1`,
  order: 0,
  required: false,
  showInDiscoveryDocument: true,
  supportedDelegationTypes: [],
  ...inputPatch,
}

const patchTestCases: Record<string, PatchTestCase> = {
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
          supportedDelegationTypes: [],
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
      body: {
        ...patchExpectedOutput,
      },
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

const expected403Response = {
  status: 403,
  body: {
    title: 'Forbidden',
    status: 403,
    detail: 'User does not have access to update admin controlled fields',
    type: 'https://httpstatuses.org/403',
  },
}

SUPER_USER_DELEGATION_TYPES.map((delegationType) => {
  const delegationTypeName = AuthDelegationType[delegationType]

  patchTestCases[
    `should return a forbidden exception when adding super user delegation type: ${delegationTypeName}`
  ] = {
    user: currentUser,
    tenantId: TENANT_ID,
    scopeName: mockedPatchApiScope.name,
    input: {
      addedDelegationTypes: [delegationType],
    },
    expected: expected403Response,
  }

  patchTestCases[
    `should return a forbidden exception when removing super user delegation type: ${delegationTypeName}`
  ] = {
    user: currentUser,
    tenantId: TENANT_ID,
    scopeName: mockedPatchApiScope.name,
    input: {
      removedDelegationTypes: [delegationType],
    },
    expected: expected403Response,
  }
})

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
          dbType: 'postgres',
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
          dbType: 'postgres',
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
      let apiScopeDelegationTypeModel: typeof ApiScopeDelegationType

      beforeAll(async () => {
        app = await setupApp({
          AppModule,
          SequelizeConfigService,
          user: testCase.user,
          dbType: 'postgres',
        })
        server = request(app.getHttpServer())
        apiScopeDelegationTypeModel = await app.get(
          getModelToken(ApiScopeDelegationType),
        )

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
          const apiScopeDelegationTypes =
            await apiScopeDelegationTypeModel.findAll({
              where: {
                apiScopeName: response.body.name,
              },
            })

          expect(apiScopeDelegationTypes).toHaveLength(
            (testCase.expected.body.supportedDelegationTypes as string[])
              .length,
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

    // PATCH: /v2/me/tenants/:tenantId/scopes/:scopeName
    describe.each(Object.keys(patchTestCases))('%s', (testCaseName) => {
      const testCase = patchTestCases[testCaseName]
      let app: TestApp
      let server: request.SuperTest<request.Test>
      let apiScopeDelegationTypeModel: typeof ApiScopeDelegationType

      beforeAll(async () => {
        app = await setupApp({
          AppModule,
          SequelizeConfigService,
          user: testCase.user,
          dbType: 'postgres',
        })
        server = request(app.getHttpServer())

        apiScopeDelegationTypeModel = await app.get(
          getModelToken(ApiScopeDelegationType),
        )

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

        // Assert - db record
        if (testCase.expected.body.supportedDelegationTypes) {
          const apiScopeDelegationTypes =
            await apiScopeDelegationTypeModel.findAll({
              where: {
                apiScopeName: testCase.scopeName,
              },
            })

          expect(apiScopeDelegationTypes).toHaveLength(
            (testCase.expected.body.supportedDelegationTypes as string[])
              .length,
          )
        }
      })
    })
  })

  describe('PATCH: /v2/me/tenants/:tenantId/scopes/:scopeName as super user', () => {
    let app: TestApp
    let server: request.SuperTest<request.Test>
    let apiScopeDelegationTypeModel: typeof ApiScopeDelegationType
    let fixtureFactory: FixtureFactory

    beforeAll(async () => {
      app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: superUser,
        dbType: 'postgres',
      })
      server = request(app.getHttpServer())
      fixtureFactory = new FixtureFactory(app)

      apiScopeDelegationTypeModel = await app.get(
        getModelToken(ApiScopeDelegationType),
      )

      await createTestData({
        app,
        tenantId: TENANT_ID,
        tenantOwnerNationalId: superUser.nationalId,
      })
    })

    const patchAndAssert = async ({
      input,
      expected,
    }: {
      input: AdminPatchScopeDto
      expected: Partial<AdminScopeDTO>
    }) => {
      const response = await server
        .patch(
          `/v2/me/tenants/${TENANT_ID}/scopes/${encodeURIComponent(
            mockedPatchApiScope.name,
          )}`,
        )
        .send(input)

      expect(response.status).toEqual(200)
      expect(response.body).toMatchObject({
        ...expected,
        supportedDelegationTypes: expect.arrayContaining(
          expected?.supportedDelegationTypes || [],
        ),
      })
      const apiScopeDelegationTypes = await apiScopeDelegationTypeModel.findAll(
        {
          where: {
            apiScopeName: mockedPatchApiScope.name,
          },
        },
      )

      expect(apiScopeDelegationTypes).toHaveLength(
        expected.supportedDelegationTypes?.length || 0,
      )
    }

    it('should be able to add supported delegation types to api scope with array property', async () => {
      await patchAndAssert({
        input: {
          addedDelegationTypes: [
            AuthDelegationType.Custom,
            AuthDelegationType.LegalGuardian,
            AuthDelegationType.ProcurationHolder,
            AuthDelegationType.PersonalRepresentative,
            AuthDelegationType.LegalRepresentative,
          ],
        },
        expected: {
          grantToPersonalRepresentatives: true,
          grantToLegalGuardians: true,
          grantToProcuringHolders: true,
          allowExplicitDelegationGrant: true,
          supportedDelegationTypes: [
            AuthDelegationType.Custom,
            // Add general mandate since it is directly connected to Custom delegation type
            AuthDelegationType.GeneralMandate,
            AuthDelegationType.LegalGuardian,
            AuthDelegationType.ProcurationHolder,
            AuthDelegationType.PersonalRepresentative,
            AuthDelegationType.LegalRepresentative,
          ],
        },
      })
    })

    it('should be able to remove supported delegation types to api scope with array property', async () => {
      await patchAndAssert({
        input: {
          addedDelegationTypes: [
            AuthDelegationType.Custom,
            AuthDelegationType.LegalGuardian,
            AuthDelegationType.ProcurationHolder,
            AuthDelegationType.PersonalRepresentative,
            AuthDelegationType.LegalRepresentative,
          ],
        },
        expected: {
          grantToPersonalRepresentatives: true,
          grantToLegalGuardians: true,
          grantToProcuringHolders: true,
          allowExplicitDelegationGrant: true,
          supportedDelegationTypes: [
            AuthDelegationType.Custom,
            // Add general mandate since it is directly connected to Custom delegation type
            AuthDelegationType.GeneralMandate,
            AuthDelegationType.LegalGuardian,
            AuthDelegationType.ProcurationHolder,
            AuthDelegationType.PersonalRepresentative,
            AuthDelegationType.LegalRepresentative,
          ],
        },
      })

      await patchAndAssert({
        input: {
          removedDelegationTypes: [
            AuthDelegationType.Custom,
            AuthDelegationType.LegalGuardian,
            AuthDelegationType.ProcurationHolder,
            AuthDelegationType.PersonalRepresentative,
            AuthDelegationType.LegalRepresentative,
          ],
        },
        expected: {
          grantToPersonalRepresentatives: false,
          grantToLegalGuardians: false,
          grantToProcuringHolders: false,
          allowExplicitDelegationGrant: false,
          supportedDelegationTypes: [],
        },
      })
    })

    it('should only update requested delegation setting fields', async () => {
      // Arrange
      // Create new subject under testing test data to control initial state of delegation settings.
      const sutScope = await fixtureFactory.createApiScope({
        domainName: TENANT_ID,
        allowExplicitDelegationGrant: true,
        supportedDelegationTypes: [AuthDelegationType.Custom],
      })

      // Act - Update partially delegation setting
      const response = await server
        .patch(
          `/v2/me/tenants/${TENANT_ID}/scopes/${encodeURIComponent(
            sutScope.name,
          )}`,
        )
        .send({
          addedDelegationTypes: [AuthDelegationType.ProcurationHolder],
        })

      // Assert that we only updated requested delegation setting fields
      expect(response.status).toEqual(200)
      expect(response.body).toMatchObject({
        ...sutScope.toDTO(),
        displayName: [
          {
            locale: 'is',
            value: sutScope.displayName,
          },
        ],
        description: [
          {
            locale: 'is',
            value: sutScope.description,
          },
        ],
        grantToProcuringHolders: true,
        supportedDelegationTypes: expect.arrayContaining([
          AuthDelegationType.Custom,
          AuthDelegationType.ProcurationHolder,
        ]),
      } as AdminScopeDTO)
      const apiScopeDelegationTypes = await apiScopeDelegationTypeModel.findAll(
        {
          where: {
            apiScopeName: sutScope.name,
          },
        },
      )

      expect(apiScopeDelegationTypes).toHaveLength(2)
    })
  })

  describe('POST: /v2/me/tenants/:tenantId/scopes as super user', () => {
    let app: TestApp
    let server: request.SuperTest<request.Test>
    let apiScopeDelegationTypeModel: typeof ApiScopeDelegationType

    beforeAll(async () => {
      app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: superUser,
        dbType: 'postgres',
      })
      server = request(app.getHttpServer())

      apiScopeDelegationTypeModel = await app.get(
        getModelToken(ApiScopeDelegationType),
      )

      await createTestData({
        app,
        tenantId: TENANT_ID,
        tenantOwnerNationalId: superUser.nationalId,
      })
    })

    const createAndAssert = async ({
      input,
      expected,
    }: {
      input: AdminCreateScopeDto
      expected: Partial<AdminScopeDTO>
    }) => {
      const response = await server
        .post(`/v2/me/tenants/${TENANT_ID}/scopes`)
        .send(input)

      expect(response.status).toEqual(200)
      expect(response.body).toMatchObject({
        ...expected,
        supportedDelegationTypes: expect.arrayContaining(
          expected?.supportedDelegationTypes || [],
        ),
      })

      const apiScopeDelegationTypes = await apiScopeDelegationTypeModel.findAll(
        {
          where: {
            apiScopeName: response.body.name,
          },
        },
      )

      expect(apiScopeDelegationTypes).toHaveLength(
        expected.supportedDelegationTypes?.length || 0,
      )
    }

    it('should be able to create api scope using supportedDelegationTypes property', async () => {
      await createAndAssert({
        input: {
          ...createInput,
          supportedDelegationTypes: [
            AuthDelegationType.Custom,
            AuthDelegationType.LegalGuardian,
            AuthDelegationType.ProcurationHolder,
            AuthDelegationType.PersonalRepresentative,
          ],
        },
        expected: {
          grantToPersonalRepresentatives: true,
          grantToLegalGuardians: true,
          grantToProcuringHolders: true,
          allowExplicitDelegationGrant: true,
          supportedDelegationTypes: [
            AuthDelegationType.Custom,
            // Add general mandate since it is directly connected to Custom delegation type
            AuthDelegationType.GeneralMandate,
            AuthDelegationType.LegalGuardian,
            AuthDelegationType.ProcurationHolder,
            AuthDelegationType.PersonalRepresentative,
          ],
        },
      })
    })
  })

  describe('POST: /v2/me/tenants/:tenantId/scopes as normal user', () => {
    let app: TestApp
    let server: request.SuperTest<request.Test>
    let apiScopeDelegationTypeModel: typeof ApiScopeDelegationType

    beforeAll(async () => {
      app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: currentUser,
        dbType: 'postgres',
      })
      server = request(app.getHttpServer())

      apiScopeDelegationTypeModel = await app.get(
        getModelToken(ApiScopeDelegationType),
      )

      await createTestData({
        app,
        tenantId: TENANT_ID,
        tenantOwnerNationalId: currentUser.nationalId,
      })
    })

    const createAndAssert = async ({
      input,
      expected,
    }: {
      input: AdminCreateScopeDto
      expected: Partial<AdminScopeDTO>
    }) => {
      const response = await server
        .post(`/v2/me/tenants/${TENANT_ID}/scopes`)
        .send(input)

      expect(response.status).toEqual(200)
      expect(response.body).toMatchObject({
        ...expected,
        supportedDelegationTypes: expect.arrayContaining(
          expected?.supportedDelegationTypes || [],
        ),
      })

      const apiScopeDelegationTypes = await apiScopeDelegationTypeModel.findAll(
        {
          where: {
            apiScopeName: response.body.name,
          },
        },
      )

      expect(apiScopeDelegationTypes).toHaveLength(
        expected.supportedDelegationTypes?.length || 0,
      )
    }

    it('should be able to create api scope using supportedDelegationTypes property without personal representative since user is not super admin', async () => {
      await createAndAssert({
        input: {
          ...createInput,
          supportedDelegationTypes: [
            AuthDelegationType.Custom,
            AuthDelegationType.LegalGuardian,
            AuthDelegationType.ProcurationHolder,
            AuthDelegationType.PersonalRepresentative,
          ],
        },
        expected: {
          grantToPersonalRepresentatives: false,
          grantToLegalGuardians: true,
          grantToProcuringHolders: true,
          allowExplicitDelegationGrant: true,
          supportedDelegationTypes: [
            AuthDelegationType.Custom,
            // Add general mandate since it is directly connected to Custom delegation type
            AuthDelegationType.GeneralMandate,
            AuthDelegationType.LegalGuardian,
            AuthDelegationType.ProcurationHolder,
          ],
        },
      })
    })
  })
})
