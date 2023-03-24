import { getModelToken } from '@nestjs/sequelize'
import request from 'supertest'

import { ClientSecret, SequelizeConfigService } from '@island.is/auth-api-lib'
import { User } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { FixtureFactory } from '@island.is/services/auth/testing'
import { AuthDelegationType } from '@island.is/shared/types'
import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'
import { setupApp, TestApp } from '@island.is/testing/nest'

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

const tenants = [
  {
    name: 'domain-1',
    nationalId: currentUser.nationalId,
  },
  {
    name: 'domain-2',
    nationalId: createNationalId('company'),
  },
]

const clients = [
  {
    clientId: 'client-1',
    domainName: tenants[0].name,
  },
  {
    clientId: 'client-2',
    domainName: tenants[1].name,
  },
]

interface TestCase {
  user: User
  tenant: string
  client: string
  post: {
    secret: { decryptedValue: string }
    expected: {
      status: number
      result: { decryptedValue: string } | {}
    }
  }
  get: {
    expected: {
      status: number
      result: { decryptedValue: string }[] | {}
    }
  }
  delete: {
    id?: string
    expected: {
      status: number
    }
  }
  getAfterDelete: {
    expected: {
      status: number
      result: { decryptedValue: string }[] | {}
    }
  }
}

const testCases: Record<string, TestCase> = {
  '1': {
    // user has access to tenant
    user: currentUser,
    tenant: tenants[0].name,
    client: clients[0].clientId,
    post: {
      secret: { decryptedValue: 'secret-1' },
      expected: {
        status: 201,
        result: { decryptedValue: 'secret-1' },
      },
    },
    get: {
      expected: {
        status: 200,
        result: [{ decryptedValue: 'secret-1' }],
      },
    },
    delete: {
      expected: {
        status: 204,
      },
    },
    getAfterDelete: {
      expected: {
        status: 200,
        result: [],
      },
    },
  },
  '2': {
    // user does not have access to tenant
    user: currentUser,
    tenant: tenants[1].name,
    client: clients[1].clientId,
    post: {
      secret: { decryptedValue: 'secret-1' },
      expected: {
        status: 204,
        result: {},
      },
    },
    get: {
      expected: {
        status: 204,
        result: {},
      },
    },
    delete: {
      expected: {
        status: 204,
      },
    },
    getAfterDelete: {
      expected: {
        status: 204,
        result: {},
      },
    },
  },
  '3': {
    // superuser does not belong to tenant, but has access
    user: superUser,
    tenant: tenants[0].name,
    client: clients[0].clientId,
    post: {
      secret: { decryptedValue: 'secret-1' },
      expected: {
        status: 201,
        result: { decryptedValue: 'secret-1' },
      },
    },
    get: {
      expected: {
        status: 200,
        result: [{ decryptedValue: 'secret-1' }],
      },
    },
    delete: {
      expected: {
        status: 204,
      },
    },
    getAfterDelete: {
      expected: {
        status: 200,
        result: [],
      },
    },
  },
  '4': {
    // client does not belong to tenant
    user: currentUser,
    tenant: tenants[0].name,
    client: clients[1].clientId,
    post: {
      secret: { decryptedValue: 'secret-1' },
      expected: {
        status: 400,
        result: {},
      },
    },
    get: {
      expected: {
        status: 200,
        result: [],
      },
    },
    delete: {
      expected: {
        status: 204,
      },
    },
    getAfterDelete: {
      expected: {
        status: 200,
        result: [],
      },
    },
  },
}

describe('MeClientSecretsController', () => {
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
          tenants.map(async (tenant) => fixtureFactory.createDomain(tenant)),
        )

        await Promise.all(
          clients.map(async (client) => fixtureFactory.createClient(client)),
        )
      })

      afterAll(async () => {
        await app.cleanUp()
      })

      it('should pass post', async () => {
        // Act
        const response = await server
          .post(
            `/v2/me/tenants/${encodeURIComponent(
              testCase.tenant,
            )}/clients/${encodeURIComponent(testCase.client)}/secrets`,
          )
          .send(testCase.post.secret)

        // Assert
        expect(response.status).toEqual(testCase.post.expected.status)
        expect(response.body).toMatchObject(testCase.post.expected.result)

        if (response.status == 201) {
          const model = app.get(getModelToken(ClientSecret))

          const secret = await model.findOne(response.body.id)
          expect(secret.encryptedValue).not.toEqual(testCase.post.secret)
        }
      })

      it('should pass get', async () => {
        // Act
        const response = await server.get(
          `/v2/me/tenants/${encodeURIComponent(
            testCase.tenant,
          )}/clients/${encodeURIComponent(testCase.client)}/secrets`,
        )

        // Assert
        expect(response.status).toEqual(testCase.get.expected.status)
        expect(response.body).toMatchObject(testCase.get.expected.result)

        if (response.body.length > 0) testCase.delete.id = response.body[0].id
      })

      it('should pass delete', async () => {
        // Act
        const response = await server.delete(
          `/v2/me/tenants/${encodeURIComponent(
            testCase.tenant,
          )}/clients/${encodeURIComponent(testCase.client)}/secrets/${
            testCase.delete.id
          }`,
        )

        // Assert
        expect(response.status).toEqual(testCase.delete.expected.status)
      })

      it('should pass get after delete', async () => {
        // Act
        const response = await server.get(
          `/v2/me/tenants/${encodeURIComponent(
            testCase.tenant,
          )}/clients/${encodeURIComponent(testCase.client)}/secrets`,
        )

        // Assert
        expect(response.status).toEqual(testCase.getAfterDelete.expected.status)
        expect(response.body).toMatchObject(
          testCase.getAfterDelete.expected.result,
        )
      })
    })
  })
})
