import request from 'supertest'
import { getModelToken } from '@nestjs/sequelize'

import {
  ApiScope,
  ApiScopeGroup,
  Domain,
  Translation,
} from '@island.is/auth-api-lib'
import { AuthScope } from '@island.is/auth/scopes'
import {
  createCurrentUser,
  createNationalRegistryUser,
} from '@island.is/testing/fixtures'
import { TestApp } from '@island.is/testing/nest'

import {
  Scopes,
  setupWithAuth,
  setupWithoutAuth,
  setupWithoutPermission,
} from '../../../../test/setup'
import { TestEndpointOptions } from '../../../../test/types'
import { getRequestMethod } from '../../../../test/utils'
import {
  createApiScopeGroup,
  createTranslations,
} from '../../../../test/fixtures'

const user = createCurrentUser({
  nationalId: '1122334455',
  scope: [AuthScope.readDelegations, Scopes[0].name, Scopes[3].name],
})
const userName = 'Tester Tests'
const nationalRegistryUser = createNationalRegistryUser({
  kennitala: '6677889900',
})

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
        })
        if (!scope) {
          throw new Error('Scope not found')
        }

        const group = await apiScopeGroupModel.create(
          createApiScopeGroup({
            displayName: 'Untranslated',
            description: 'Untranslated',
          }),
          { include: [Domain] },
        )
        await scope.update({ groupId: group.id })

        await translationModel.bulkCreate([
          ...createTranslations(scope, 'en', {
            displayName: 'Translated scope display name',
            description: 'Translated scope description',
          }),
          ...createTranslations(group, 'en', {
            displayName: 'Translated group display name',
            description: 'Translated group description',
          }),
        ])
      })

      afterAll(() => {
        return apiScopeModel.update(
          { groupId: null },
          { where: { name: Scopes[0].name } },
        )
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
          scope: [AuthScope.readDelegations],
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
  })

  it('should return some scope only for procuring holder delegations', async () => {
    // Arrange
    const app = await setupWithAuth({
      user: {
        ...user,
        actor: {
          nationalId: user.nationalId,
          delegationType: 'ProcurationHolder',
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
        actor: {
          nationalId: user.nationalId,
          delegationType: 'Custom',
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
          type: 'https://httpstatuses.com/401',
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
          type: 'https://httpstatuses.com/403',
          title: 'Forbidden',
          detail: 'Forbidden resource',
        })

        // CleanUp
        app.cleanUp()
      },
    )
  })
})
