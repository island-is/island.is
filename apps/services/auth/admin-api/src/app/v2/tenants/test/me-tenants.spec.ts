import request from 'supertest'

import { AdminPortalScope } from '@island.is/auth/scopes'
import { SequelizeConfigService } from '@island.is/auth-api-lib'
import { FixtureFactory } from '@island.is/services/auth/testing'
import { AuthDelegationType } from '@island.is/shared/types'
import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'
import { setupApp, TestApp } from '@island.is/testing/nest'

import { AppModule } from '../../../app.module'
import { User } from '@island.is/auth-nest-tools'
import { NoContentException } from '@island.is/nest/problem'

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

interface TestCase {
  user: User
  tenants: {
    name: string
    nationalId: string
  }[]
  expected: {
    name: string
  }[]
}

const testCases: Record<string, TestCase> = {
  'should return a list of tenants that a user owns': {
    user: currentUser,
    tenants: [
      {
        name: 'domain-1',
        nationalId: currentUser.nationalId,
      },
      {
        name: 'domain-2',
        nationalId: currentUser.nationalId,
      },
      {
        name: 'domain-3',
        nationalId: createNationalId('company'),
      },
    ],
    expected: [
      {
        name: 'domain-1',
      },
      {
        name: 'domain-2',
      },
    ],
  },
  'should return a list of all tenants for a super user': {
    user: superUser,
    tenants: [
      {
        name: 'domain-1',
        nationalId: currentUser.nationalId,
      },
      {
        name: 'domain-2',
        nationalId: createNationalId('company'),
      },
      {
        name: 'domain-3',
        nationalId: superUser.nationalId,
      },
    ],
    expected: [
      {
        name: 'domain-1',
      },
      {
        name: 'domain-2',
      },
      {
        name: 'domain-3',
      },
    ],
  },
}

describe('MeTenantsController', () => {
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
          dbType: 'postgres',
        })
        server = request(app.getHttpServer())

        const fixtureFactory = new FixtureFactory(app)

        await Promise.all(
          testCase.tenants.map(async (tenant) =>
            fixtureFactory.createDomain(tenant),
          ),
        )
      })

      it('should pass', async () => {
        // Act
        const response = await server.get('/v2/me/tenants')

        // Assert
        expect(response.status).toEqual(200)
        expect(response.body).toMatchObject(testCase.expected)
      })
    })
    describe('Test getting by id', () => {
      let app: TestApp
      let server: request.SuperTest<request.Test>

      beforeAll(async () => {
        app = await setupApp({
          AppModule,
          SequelizeConfigService,
          user: currentUser,
          dbType: 'postgres',
        })
        server = request(app.getHttpServer())

        const fixtureFactory = new FixtureFactory(app)

        await Promise.all([
          fixtureFactory.createDomain({
            name: 'domain-1',
            nationalId: currentUser.nationalId,
          }),
          fixtureFactory.createDomain({
            name: 'domain-2',
            nationalId: superUser.nationalId,
          }),
        ])
      })

      it('should return instance with name domain-1', async () => {
        // Act
        const response = await server.get('/v2/me/tenants/domain-1')

        // Assert
        expect(response.status).toEqual(200)
        expect(response.body).toMatchObject({
          name: 'domain-1',
        })
      })

      it('should throw a NoContentException', async () => {
        // Act
        const response = await server.get('/v2/me/tenants/domain-2')
        // Assert
        expect(response.status).toBe(204)
        expect(response.body).toEqual({})
      })
    })
    describe('Test get by id with super user', () => {
      let app: TestApp
      let server: request.SuperTest<request.Test>

      beforeAll(async () => {
        app = await setupApp({
          AppModule,
          SequelizeConfigService,
          user: superUser,
          dbType: 'postgres',
        })
        server = request(app.getHttpServer())

        const fixtureFactory = new FixtureFactory(app)

        await Promise.all([
          fixtureFactory.createDomain({
            name: 'domain-1',
            nationalId: currentUser.nationalId,
          }),
          fixtureFactory.createDomain({
            name: 'domain-2',
            nationalId: superUser.nationalId,
          }),
        ])
      })

      it('Should return an instance with name domain-1', async () => {
        // Act
        const response = await server.get('/v2/me/tenants/domain-1')
        // Assert
        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({ name: 'domain-1' })
      })
      it('Should return an instance with name domain-2', async () => {
        // Act
        const response = await server.get('/v2/me/tenants/domain-2')
        // Assert
        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({ name: 'domain-2' })
      })
    })

    describe('Admin CRUD as super user', () => {
      let app: TestApp
      let server: request.SuperTest<request.Test>
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
      })

      afterAll(async () => {
        await app.cleanUp()
      })

      it('POST should create a tenant', async () => {
        const input = {
          name: '@super.new.domain',
          nationalId: createNationalId('company'),
          displayName: 'Super new domain',
          description: 'A freshly created tenant',
          organisationLogoKey: 'stafraent-island',
          contactEmail: 'contact@example.is',
        }

        const res = await server.post('/v2/me/tenants').send(input)

        expect(res.status).toBeLessThan(300)
        expect(res.body).toMatchObject({
          name: input.name,
          displayName: input.displayName,
          contactEmail: input.contactEmail,
        })
      })

      it('POST should reject a duplicate tenant name', async () => {
        await fixtureFactory.createDomain({
          name: '@super.duplicate.domain',
          nationalId: createNationalId('company'),
        })

        const res = await server.post('/v2/me/tenants').send({
          name: '@super.duplicate.domain',
          nationalId: createNationalId('company'),
          displayName: 'dup',
          description: 'dup',
          organisationLogoKey: 'dup',
        })

        expect(res.status).toBe(409)
      })

      it('POST should reject an invalid name format', async () => {
        const res = await server.post('/v2/me/tenants').send({
          name: 'missing-at-sign',
          nationalId: createNationalId('company'),
          displayName: 'x',
          description: 'x',
          organisationLogoKey: 'x',
        })

        expect(res.status).toBe(400)
      })

      it('GET /:tenantId/admin-details should return the full domain record', async () => {
        const created = await fixtureFactory.createDomain({
          name: '@super.details.domain',
          nationalId: createNationalId('company'),
        })

        const res = await server.get(
          `/v2/me/tenants/${encodeURIComponent(created.name)}/admin-details`,
        )

        expect(res.status).toBe(200)
        expect(res.body).toMatchObject({
          name: created.name,
          nationalId: created.nationalId,
        })
      })

      it('PATCH should update editable fields', async () => {
        const created = await fixtureFactory.createDomain({
          name: '@super.patch.domain',
          nationalId: createNationalId('company'),
        })

        const res = await server
          .patch(`/v2/me/tenants/${encodeURIComponent(created.name)}`)
          .send({
            displayName: 'Updated display name',
            contactEmail: 'updated@example.is',
          })

        expect(res.status).toBe(200)
        expect(res.body).toMatchObject({
          name: created.name,
          displayName: 'Updated display name',
          contactEmail: 'updated@example.is',
        })
      })

      it('PATCH should update nationalId', async () => {
        const created = await fixtureFactory.createDomain({
          name: '@super.patch.national-id.domain',
          nationalId: createNationalId('company'),
        })
        const newNationalId = createNationalId('company')

        const res = await server
          .patch(`/v2/me/tenants/${encodeURIComponent(created.name)}`)
          .send({
            nationalId: newNationalId,
          })

        expect(res.status).toBe(200)
        expect(res.body).toMatchObject({
          name: created.name,
          nationalId: newNationalId,
        })
      })

      it('PATCH should reject an invalid nationalId format', async () => {
        const created = await fixtureFactory.createDomain({
          name: '@super.patch.invalid-nid.domain',
          nationalId: createNationalId('company'),
        })

        const res = await server
          .patch(`/v2/me/tenants/${encodeURIComponent(created.name)}`)
          .send({
            nationalId: 'not-ten-digits',
          })

        expect(res.status).toBe(400)
      })

      it('DELETE should delete an unreferenced tenant', async () => {
        const created = await fixtureFactory.createDomain({
          name: '@super.delete.domain',
          nationalId: createNationalId('company'),
        })

        const res = await server.delete(
          `/v2/me/tenants/${encodeURIComponent(created.name)}`,
        )

        expect(res.status).toBe(204)
      })
    })

    describe('Admin CRUD as non-super user', () => {
      let app: TestApp
      let server: request.SuperTest<request.Test>

      beforeAll(async () => {
        app = await setupApp({
          AppModule,
          SequelizeConfigService,
          user: currentUser,
          dbType: 'postgres',
        })
        server = request(app.getHttpServer())
      })

      afterAll(async () => {
        await app.cleanUp()
      })

      it('POST should be forbidden', async () => {
        const res = await server.post('/v2/me/tenants').send({
          name: '@regular.denied.domain',
          nationalId: createNationalId('company'),
          displayName: 'x',
          description: 'x',
          organisationLogoKey: 'x',
        })

        expect(res.status).toBe(403)
      })

      it('PATCH should be forbidden', async () => {
        const res = await server
          .patch('/v2/me/tenants/any-tenant')
          .send({ displayName: 'x' })

        expect(res.status).toBe(403)
      })

      it('DELETE should be forbidden', async () => {
        const res = await server.delete('/v2/me/tenants/any-tenant')

        expect(res.status).toBe(403)
      })

      it('GET /:tenantId/admin-details should be forbidden', async () => {
        const res = await server.get('/v2/me/tenants/any-tenant/admin-details')

        expect(res.status).toBe(403)
      })
    })
  })
})
