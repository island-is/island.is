import { setupApp, TestApp } from '@island.is/testing/nest'
import request from 'supertest'
import { FixtureFactory } from '@island.is/services/auth/testing'
import {
  DelegationProviderDto,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'
import { AppModule } from '../../../app.module'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { AdminPortalScope } from '@island.is/auth/scopes'

const path = '/v2/providers'

const delegationProviderTypesData = [
  {
    id: 'custom',
    delegationTypes: [
      {
        id: 'custom:1',
        name: 'custom:1',
      },
    ],
  },
  {
    id: 'procuration',
    delegationTypes: [
      {
        id: 'procuration:1',
        name: 'procuration:1',
      },
      {
        id: 'procuration:2',
        name: 'procuration:2',
      },
    ],
  },
]

describe('ProverController', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>
  let factory: FixtureFactory

  describe('authentication and authorization', () => {
    it('user with no scopes should not have access to /providers', async () => {
      app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser(),
        dbType: 'postgres',
      })
      server = request(app.getHttpServer())
      factory = new FixtureFactory(app)

      const response = await server.get(path)

      expect(response.status).toBe(403)
    })
  })

  describe('getDelegationProviders', () => {
    beforeAll(async () => {
      const user = createCurrentUser({
        scope: [AdminPortalScope.idsAdmin],
      })

      app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user,
        dbType: 'postgres',
      })
      server = request(app.getHttpServer())
      factory = new FixtureFactory(app)

      for (const { id: dpId, delegationTypes } of delegationProviderTypesData) {
        for (const _ of delegationTypes) {
          await factory.createDelegationType({ providerId: dpId })
        }
      }
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    it('should return all delegation providers and their delegation types', async () => {
      // Act
      const response = await server.get(path)

      // Assert
      expect(response.status).toBe(200)
      expect(response.body.totalCount).toBe(delegationProviderTypesData.length)
      expect(response.body.data.length).toBe(delegationProviderTypesData.length)

      response.body.data.forEach((dp: DelegationProviderDto) => {
        const expectedDp = delegationProviderTypesData.find(
          ({ id }) => id === dp.id,
        )

        expect(expectedDp).toBeDefined()
        expect(dp.delegationTypes.length).toBe(
          expectedDp?.delegationTypes.length,
        )
      })
    })
  })

  afterAll(async () => {
    await app?.cleanUp()
  })
})
