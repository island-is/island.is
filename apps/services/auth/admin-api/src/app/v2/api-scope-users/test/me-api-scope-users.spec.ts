import request from 'supertest'
import { getModelToken } from '@nestjs/sequelize'

import { AdminPortalScope } from '@island.is/auth/scopes'
import { ApiScopeUser, SequelizeConfigService } from '@island.is/auth-api-lib'
import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'
import { setupApp, TestApp } from '@island.is/testing/nest'

import { AppModule } from '../../../app.module'

const superUser = createCurrentUser({
  nationalIdType: 'person',
  scope: [AdminPortalScope.idsAdminSuperUser],
})

const regularUser = createCurrentUser({
  nationalIdType: 'person',
  scope: [AdminPortalScope.idsAdmin],
})

describe('MeApiScopeUsersController', () => {
  describe('with super user auth', () => {
    let app: TestApp
    let server: request.SuperTest<request.Test>
    let apiScopeUserModel: typeof ApiScopeUser

    beforeAll(async () => {
      app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: superUser,
        dbType: 'postgres',
      })
      server = request(app.getHttpServer())
      apiScopeUserModel = app.get(getModelToken(ApiScopeUser))
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    afterEach(async () => {
      await apiScopeUserModel.destroy({ where: {}, truncate: true })
    })

    describe('GET /v2/me/api-scope-users', () => {
      it('should return an empty list when no users exist', async () => {
        const response = await server.get(
          '/v2/me/api-scope-users?page=1&count=10',
        )

        expect(response.status).toEqual(200)
        expect(response.body).toMatchObject({
          rows: [],
          count: 0,
        })
      })

      it('should return paginated list of API scope users', async () => {
        const nationalId1 = createNationalId('person')
        const nationalId2 = createNationalId('person')

        await apiScopeUserModel.bulkCreate([
          { nationalId: nationalId1, name: 'User One', email: 'one@test.is' },
          { nationalId: nationalId2, name: 'User Two', email: 'two@test.is' },
        ])

        const response = await server.get(
          '/v2/me/api-scope-users?page=1&count=10',
        )

        expect(response.status).toEqual(200)
        expect(response.body.count).toEqual(2)
        expect(response.body.rows).toHaveLength(2)
      })

      it('should filter users by search string', async () => {
        const nationalId1 = createNationalId('person')
        const nationalId2 = createNationalId('person')

        await apiScopeUserModel.bulkCreate([
          { nationalId: nationalId1, name: 'Alice', email: 'alice@test.is' },
          { nationalId: nationalId2, name: 'Bob', email: 'bob@test.is' },
        ])

        const response = await server.get(
          '/v2/me/api-scope-users?page=1&count=10&searchString=Alice',
        )

        expect(response.status).toEqual(200)
        expect(response.body.count).toEqual(1)
        expect(response.body.rows[0].name).toEqual('Alice')
      })
    })

    describe('GET /v2/me/api-scope-users/:nationalId', () => {
      it('should return an API scope user by national ID', async () => {
        const nationalId = createNationalId('person')
        await apiScopeUserModel.create({
          nationalId,
          name: 'Test User',
          email: 'test@test.is',
        })

        const response = await server.get(
          `/v2/me/api-scope-users/${nationalId}`,
        )

        expect(response.status).toEqual(200)
        expect(response.body).toMatchObject({
          nationalId,
          name: 'Test User',
          email: 'test@test.is',
        })
      })

      it('should return 204 when user is not found', async () => {
        const response = await server.get(
          `/v2/me/api-scope-users/${createNationalId('person')}`,
        )

        expect(response.status).toEqual(204)
      })
    })

    describe('POST /v2/me/api-scope-users', () => {
      it('should create a new API scope user', async () => {
        const nationalId = createNationalId('person')

        const response = await server.post('/v2/me/api-scope-users').send({
          nationalId,
          name: 'New User',
          email: 'new@test.is',
        })

        expect(response.status).toEqual(201)
        expect(response.body).toMatchObject({
          nationalId,
          name: 'New User',
          email: 'new@test.is',
        })

        const dbUser = await apiScopeUserModel.findByPk(nationalId)
        expect(dbUser).not.toBeNull()
        expect(dbUser?.name).toEqual('New User')
      })
    })

    describe('PATCH /v2/me/api-scope-users/:nationalId', () => {
      it('should update an existing API scope user', async () => {
        const nationalId = createNationalId('person')
        await apiScopeUserModel.create({
          nationalId,
          name: 'Original Name',
          email: 'original@test.is',
        })

        const response = await server
          .patch(`/v2/me/api-scope-users/${nationalId}`)
          .send({
            name: 'Updated Name',
            email: 'updated@test.is',
          })

        expect(response.status).toEqual(200)
        expect(response.body).toMatchObject({
          nationalId,
          name: 'Updated Name',
          email: 'updated@test.is',
        })
      })
    })

    describe('DELETE /v2/me/api-scope-users/:nationalId', () => {
      it('should delete an API scope user', async () => {
        const nationalId = createNationalId('person')
        await apiScopeUserModel.create({
          nationalId,
          name: 'To Delete',
          email: 'delete@test.is',
        })

        const response = await server.delete(
          `/v2/me/api-scope-users/${nationalId}`,
        )

        expect(response.status).toEqual(204)

        const dbUser = await apiScopeUserModel.findByPk(nationalId)
        expect(dbUser).toBeNull()
      })
    })
  })

  describe('without super user auth', () => {
    let app: TestApp
    let server: request.SuperTest<request.Test>

    beforeAll(async () => {
      app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: regularUser,
        dbType: 'postgres',
      })
      server = request(app.getHttpServer())
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    it('should return 403 for regular users', async () => {
      const response = await server.get(
        '/v2/me/api-scope-users?page=1&count=10',
      )

      expect(response.status).toEqual(403)
    })
  })
})
