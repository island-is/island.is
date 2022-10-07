import request from 'supertest'
import { getModelToken } from '@nestjs/sequelize'
import { uuid } from 'uuidv4'
import shuffle from 'lodash/shuffle'

import { ApiScope, ApiScopeGroup, Translation } from '@island.is/auth-api-lib'
import { AuthScope } from '@island.is/auth/scopes'
import {
  createCurrentUser,
  createNationalRegistryUser,
} from '@island.is/testing/fixtures'
import { TestApp } from '@island.is/testing/nest'

import {
  ScopeGroupSetupOptions,
  Scopes,
  ScopeSetupOptions,
  setupWithAuth,
  setupWithoutAuth,
  setupWithoutPermission,
} from '../../../../test/setup'
import { TestEndpointOptions } from '../../../../test/types'
import { getRequestMethod } from '../../../../test/utils'
import { createTranslations } from '../../../../test/fixtures'

const user = createCurrentUser({
  nationalId: '1122334455',
  scope: [
    AuthScope.delegations,
    Scopes[0].name,
    Scopes[3].name,
    Scopes[6].name,
  ],
})
const userName = 'Tester Tests'
const nationalRegistryUser = createNationalRegistryUser()

describe('ScopesController', () => {
  describe('withAuth', () => {
    let app: TestApp
    let server: request.SuperTest<request.Test>
    let apiScopeModel: typeof ApiScope
    let apiScopeGroupModel: typeof ApiScopeGroup
    let translationModel: typeof Translation

    beforeAll(async () => {
      // TestApp setup with auth and database
      app = await setupWithAuth({
        user,
        userName,
        nationalRegistryUser,
      })
      server = request(app.getHttpServer())

      // Get reference on delegation and delegationScope models to seed DB
      apiScopeModel = app.get<typeof ApiScope>(getModelToken(ApiScope))
      apiScopeGroupModel = app.get<typeof ApiScopeGroup>(
        getModelToken(ApiScopeGroup),
      )
      translationModel = app.get<typeof Translation>(getModelToken(Translation))
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    describe('GET /scopes', () => {
      it('should return all allowed scopes for user', async () => {
        // Arrange
        const expectedScopes = await apiScopeModel.findAll({
          where: {
            name: Scopes[0].name,
          },
        })

        // Act
        const res = await server.get('/v1/scopes')

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(1)
        expect(res.body).toMatchObject(
          expectedScopes.map((scope) => scope.toDTO()),
        )
      })
    })

    describe('GET /scopes?locale=en', () => {
      beforeAll(async () => {
        const scope = await apiScopeModel.findOne({
          where: { name: Scopes[0].name },
          include: {
            model: apiScopeGroupModel,
            required: true,
          },
        })
        if (!scope || !scope.group) {
          throw new Error('Scope not found')
        }

        await translationModel.bulkCreate([
          ...createTranslations(scope, 'en', {
            displayName: 'Translated scope display name',
            description: 'Translated scope description',
          }),
          ...createTranslations(scope.group, 'en', {
            displayName: 'Translated group display name',
            description: 'Translated group description',
          }),
        ])
      })

      it('should return translated scopes and groups', async () => {
        // Arrange

        // Act
        const res = await server.get('/v1/scopes?locale=en')

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(1)
        expect(res.body[0]).toMatchObject({
          displayName: 'Translated scope display name',
          description: 'Translated scope description',
          group: {
            displayName: 'Translated group display name',
            description: 'Translated group description',
          },
        })
      })
    })

    it('should return an empty array when user does not have any allowed scopes', async () => {
      // Arrange
      const app = await setupWithAuth({
        user: {
          ...user,
          scope: [AuthScope.delegations],
        },
        userName,
        nationalRegistryUser,
      })

      // Act
      const res = await request(app.getHttpServer()).get('/v1/scopes')

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toHaveLength(0)
    })

    it.only('should return a sorted list of scopes and groups', async () => {
      // Arrange
      const group2: ScopeGroupSetupOptions = {
        id: uuid(),
        order: 2,
      }
      const group4: ScopeGroupSetupOptions = {
        id: uuid(),
        order: 4,
      }
      const sortedScopes: ScopeSetupOptions[] = [
        {
          name: 'Test 1',
          order: 1,
        },
        {
          name: 'Test 2-2',
          order: 2,
          groupId: group2.id,
        },
        {
          name: 'Test 2-5',
          order: 5,
          groupId: group2.id,
        },
        {
          name: 'Test 3',
          order: 3,
        },
        {
          name: 'Test 4-1',
          order: 1,
          groupId: group4.id,
        },
      ]
      const app = await setupWithAuth({
        user: {
          ...user,
          scope: [
            AuthScope.readDelegations,
            ...sortedScopes.map((scope) => scope.name),
          ],
        },
        scopeGroups: shuffle([group2, group4]),
        scopes: shuffle(sortedScopes),
        userName,
        nationalRegistryUser,
      })

      // Act
      const res = await request(app.getHttpServer()).get('/v1/scopes')

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject(sortedScopes)
    })
  })

  it('should return some scope only for procuring holder delegations', async () => {
    // Arrange
    const app = await setupWithAuth({
      user: {
        ...user,
        delegationType: ['ProcurationHolder'],
        actor: {
          nationalId: user.nationalId,
          scope: [],
        },
      },
      userName,
      nationalRegistryUser,
    })
    const apiScopeModel = app.get<typeof ApiScope>(getModelToken(ApiScope))
    const expectedScopes = await apiScopeModel.findAll({
      where: {
        name: [Scopes[0].name, Scopes[3].name],
      },
    })

    // Act
    const res = await request(app.getHttpServer()).get('/v1/scopes')

    // Assert
    expect(res.status).toEqual(200)
    expect(res.body).toHaveLength(2)
    expect(res.body).toMatchObject(expectedScopes.map((scope) => scope.toDTO()))
  })

  it('should return some scope only for procuring holder and legal guardian delegations', async () => {
    // Arrange
    const app = await setupWithAuth({
      user: {
        ...user,
        delegationType: ['ProcurationHolder', 'LegalGuardian'],
        actor: {
          nationalId: user.nationalId,
          scope: [],
        },
      },
      userName,
      nationalRegistryUser,
    })
    const apiScopeModel = app.get<typeof ApiScope>(getModelToken(ApiScope))

    const expectedScopes = await apiScopeModel.findAll({
      where: {
        name: [Scopes[0].name, Scopes[3].name, Scopes[6].name],
      },
    })

    // Act
    const res = await request(app.getHttpServer()).get('/v1/scopes')

    // Assert
    expect(res.status).toEqual(200)
    expect(res.body).toHaveLength(3)
    expect(res.body).toMatchObject(expectedScopes.map((scope) => scope.toDTO()))
  })

  it('should not return legal guardian delegation', async () => {
    // Arrange
    const app = await setupWithAuth({
      user: {
        ...user,
        delegationType: ['ProcurationHolder', 'Custom'],
        actor: {
          nationalId: user.nationalId,
          scope: [],
        },
      },
      userName,
      nationalRegistryUser,
    })
    const apiScopeModel = app.get<typeof ApiScope>(getModelToken(ApiScope))

    const expectedScopes = await apiScopeModel.findAll({
      where: {
        name: [Scopes[0].name, Scopes[3].name],
      },
    })

    // Act
    const res = await request(app.getHttpServer()).get('/v1/scopes')

    // Assert
    expect(res.status).toEqual(200)
    expect(res.body).toHaveLength(2)
    expect(res.body).toMatchObject(expectedScopes.map((scope) => scope.toDTO()))
  })

  it('should not return some scope for custom delegations', async () => {
    // Arrange
    const app = await setupWithAuth({
      user: {
        ...user,
        delegationType: ['Custom'],
        actor: {
          nationalId: user.nationalId,
          scope: [],
        },
      },
      userName,
      nationalRegistryUser,
    })
    const apiScopeModel = app.get<typeof ApiScope>(getModelToken(ApiScope))
    const expectedScopes = await apiScopeModel.findAll({
      where: {
        name: [Scopes[0].name],
      },
    })

    // Act
    const res = await request(app.getHttpServer()).get('/v1/scopes')

    // Assert
    expect(res.status).toEqual(200)
    expect(res.body).toHaveLength(1)
    expect(res.body).toMatchObject(expectedScopes.map((scope) => scope.toDTO()))
  })

  describe('withoutAuth and permissions', () => {
    it.each`
      method   | endpoint
      ${'GET'} | ${'/v1/scopes'}
    `(
      '$method $endpoint should return 401 when user is not authenticated',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupWithoutAuth()
        const server = request(app.getHttpServer())

        // Act
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(401)
        expect(res.body).toMatchObject({
          status: 401,
          type: 'https://httpstatuses.org/401',
          title: 'Unauthorized',
        })

        // CleanUp
        app.cleanUp()
      },
    )

    it.each`
      method   | endpoint
      ${'GET'} | ${'/v1/scopes'}
    `(
      '$method $endpoint should return 403 Forbidden when user does not have the correct scope',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupWithoutPermission()
        const server = request(app.getHttpServer())

        // Act
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(403)
        expect(res.body).toMatchObject({
          status: 403,
          type: 'https://httpstatuses.org/403',
          title: 'Forbidden',
          detail: 'Forbidden resource',
        })

        // CleanUp
        app.cleanUp()
      },
    )
  })
})
