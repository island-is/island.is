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
  })
})
