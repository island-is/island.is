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

import { AppModule } from '../../app.module'
import { User } from '@island.is/auth-nest-tools'

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
  })
})
