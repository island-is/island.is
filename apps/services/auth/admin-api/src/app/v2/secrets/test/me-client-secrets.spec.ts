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

const secrets = [
  {
    clientId: 'client-1',
    encryptedValue:
      'U2FsdGVkX18CfF8ReTFiO97OYKfFs/TEIFpVFLedKawf2WHnc/uXMjMhR4A1zsja',
    type: 'SharedSecret',
    value: 'DY5f1A0iSam7QpraBhn6/O9bRVo1j/l08L44d9D6LQk=',
    decryptedValue: 'existing-secret-1',
    // Controlling the created date to make this the newer secret
    created: new Date('2023-05-01T13:37:01.000Z'),
  },
  {
    clientId: 'client-1',
    encryptedValue:
      'U2FsdGVkX19WWRmJPXjqSTxe7nt1YAE7Z+mvZqIREiw5XOKhHYudeI6IFCG4wkNg',
    type: 'SharedSecret',
    value: '/MRMQaBOT7xRlRJMw7AkjkKhhTPwxTqjDQkJngtHloo=',
    decryptedValue: 'existing-secret-2',
    // This is the older secret
    created: new Date('2023-05-01T13:37:00.000Z'),
  },
]

interface TestCase {
  user: User
  tenant: string
  client: string
  post: {
    expected: {
      status: number
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
      deleted: boolean
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
      expected: {
        status: 201,
      },
    },
    get: {
      expected: {
        status: 200,
        result: [
          { decryptedValue: secrets[0].decryptedValue },
          { decryptedValue: secrets[1].decryptedValue },
        ],
      },
    },
    delete: {
      expected: {
        status: 204,
        deleted: true,
      },
    },
  },
  '2': {
    // user does not have access to tenant
    user: currentUser,
    tenant: tenants[1].name,
    client: clients[1].clientId,
    post: {
      expected: {
        status: 204,
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
        deleted: false,
      },
    },
  },
  '3': {
    // superuser does not belong to tenant, but has access
    user: superUser,
    tenant: tenants[0].name,
    client: clients[0].clientId,
    post: {
      expected: {
        status: 201,
      },
    },
    get: {
      expected: {
        status: 200,
        result: [
          { decryptedValue: secrets[0].decryptedValue },
          { decryptedValue: secrets[1].decryptedValue },
        ],
      },
    },
    delete: {
      expected: {
        status: 204,
        deleted: true,
      },
    },
  },
  '4': {
    // client does not belong to tenant
    user: currentUser,
    tenant: tenants[0].name,
    client: clients[1].clientId,
    post: {
      expected: {
        status: 204,
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
        deleted: false,
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
      let fixtureFactory: FixtureFactory

      beforeAll(async () => {
        app = await setupApp({
          AppModule,
          SequelizeConfigService,
          user: testCase.user,
        })
        server = request(app.getHttpServer())

        fixtureFactory = new FixtureFactory(app)

        await Promise.all(
          tenants.map(async (tenant) => fixtureFactory.createDomain(tenant)),
        )

        await Promise.all(
          clients.map(async (client) => fixtureFactory.createClient(client)),
        )
      })

      beforeEach(async () => {
        // Make secret creation sequential to have deterministic order in tests
        for (const secret of secrets) {
          await fixtureFactory.createSecret(secret)
        }
      })

      afterEach(async () => {
        await app.get(getModelToken(ClientSecret)).destroy({ truncate: true })
      })

      afterAll(async () => {
        await app.cleanUp()
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
      })

      it('should pass post', async () => {
        // Act
        const response = await server
          .post(
            `/v2/me/tenants/${encodeURIComponent(
              testCase.tenant,
            )}/clients/${encodeURIComponent(testCase.client)}/secrets`,
          )
          .send()

        // Assert
        expect(response.status).toEqual(testCase.post.expected.status)

        const secret = await app
          .get(getModelToken(ClientSecret))
          .findByPk(response.body.secretId)

        if (response.status == 201) {
          expect(secret).not.toBeNull()
        } else {
          expect(secret).toBeNull()
        }
      })

      it('should pass delete', async () => {
        // Arrange
        const secretToDelete = await app
          .get(getModelToken(ClientSecret))
          .findOne()

        // Act
        const response = await server.delete(
          `/v2/me/tenants/${encodeURIComponent(
            testCase.tenant,
          )}/clients/${encodeURIComponent(testCase.client)}/secrets/${
            secretToDelete.id
          }`,
        )

        // Assert
        expect(response.status).toEqual(testCase.delete.expected.status)
        const deleted = await app
          .get(getModelToken(ClientSecret))
          .findByPk(secretToDelete.id)
        if (testCase.delete.expected.deleted) {
          expect(deleted).toBeNull()
        } else {
          expect(deleted).toEqual(secretToDelete)
        }
      })
    })
  })
})
