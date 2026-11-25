import request from 'supertest'

import { SequelizeConfigService } from '@island.is/auth-api-lib'
import { FixtureFactory } from '@island.is/services/auth/testing'
import { createNationalId } from '@island.is/testing/fixtures'
import { setupApp, TestApp } from '@island.is/testing/nest'

import { AppModule } from '../../../app.module'

describe('PublicTenantsController', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>

  beforeAll(async () => {
    app = await setupApp({
      AppModule,
      SequelizeConfigService,
      dbType: 'postgres',
    })
    server = request(app.getHttpServer())

    const fixtureFactory = new FixtureFactory(app)
    const eligibleScope = {
      allowExplicitDelegationGrant: true,
      displayName: 'Mandate scope',
      description: 'Mandate scope description',
    }

    await Promise.all([
      fixtureFactory.createDomain({
        name: '@public.tenant',
        nationalId: createNationalId('company'),
        apiScopes: [{ ...eligibleScope, name: '@public.tenant/mandate' }],
      }),
      fixtureFactory.createDomain({
        name: '@admin.island.is',
        nationalId: createNationalId('company'),
        apiScopes: [{ ...eligibleScope, name: '@admin.island.is/mandate' }],
      }),
      fixtureFactory.createDomain({
        name: '@missing-national-id.tenant',
        nationalId: '',
        apiScopes: [
          { ...eligibleScope, name: '@missing-national-id.tenant/mandate' },
        ],
      }),
      fixtureFactory.createDomain({
        name: '@not-delegable.tenant',
        nationalId: createNationalId('company'),
        apiScopes: [
          {
            ...eligibleScope,
            name: '@not-delegable.tenant/mandate',
            allowExplicitDelegationGrant: false,
          },
        ],
      }),
    ])
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  it('returns only publicly eligible tenants', async () => {
    const response = await server.get('/v2/public/tenants')

    expect(response.status).toBe(200)
    expect(response.body).toEqual([
      expect.objectContaining({
        name: '@public.tenant',
        nationalId: expect.any(String),
        displayName: [
          {
            locale: 'is',
            value: 'Mínar síður Ísland.is',
          },
        ],
      }),
    ])
  })
})
