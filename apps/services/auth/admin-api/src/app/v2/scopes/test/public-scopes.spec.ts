import request from 'supertest'

import { SequelizeConfigService } from '@island.is/auth-api-lib'
import { FixtureFactory } from '@island.is/services/auth/testing'
import { createNationalId } from '@island.is/testing/fixtures'
import { setupApp, TestApp } from '@island.is/testing/nest'

import { AppModule } from '../../../app.module'

const TENANT_ID = '@public.tenant'

describe('PublicScopesController', () => {
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
    await fixtureFactory.createDomain({
      name: TENANT_ID,
      nationalId: createNationalId('company'),
    })
    await fixtureFactory.createDomain({
      name: '@admin.island.is',
      nationalId: createNationalId('company'),
    })

    const [firstScope, secondScope] = await Promise.all([
      fixtureFactory.createApiScope({
        domainName: TENANT_ID,
        name: '@public.tenant/a-scope',
        displayName: 'A scope',
        description: 'A scope description',
        allowExplicitDelegationGrant: true,
      }),
      fixtureFactory.createApiScope({
        domainName: TENANT_ID,
        name: '@public.tenant/z-scope',
        displayName: 'Z scope',
        description: 'Z scope description',
        allowExplicitDelegationGrant: true,
      }),
      fixtureFactory.createApiScope({
        domainName: TENANT_ID,
        name: '@public.tenant/private-scope',
        displayName: 'Private scope',
        description: 'Private scope description',
        allowExplicitDelegationGrant: false,
      }),
      fixtureFactory.createApiScope({
        domainName: '@admin.island.is',
        name: '@admin.island.is/scope',
        displayName: 'Admin scope',
        description: 'Admin scope description',
        allowExplicitDelegationGrant: true,
      }),
    ])

    await Promise.all([
      fixtureFactory.createTranslations(firstScope, 'en', {
        displayName: 'A scope EN',
        description: 'A scope description EN',
      }),
      fixtureFactory.createTranslations(secondScope, 'en', {
        displayName: 'Z scope EN',
        description: 'Z scope description EN',
      }),
    ])
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  it('returns eligible scopes with translations ordered by name', async () => {
    const response = await server.get(`/v2/public/tenants/${TENANT_ID}/scopes`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual([
      {
        name: '@public.tenant/a-scope',
        displayName: [
          { locale: 'is', value: 'A scope' },
          { locale: 'en', value: 'A scope EN' },
        ],
        description: [
          { locale: 'is', value: 'A scope description' },
          { locale: 'en', value: 'A scope description EN' },
        ],
      },
      {
        name: '@public.tenant/z-scope',
        displayName: [
          { locale: 'is', value: 'Z scope' },
          { locale: 'en', value: 'Z scope EN' },
        ],
        description: [
          { locale: 'is', value: 'Z scope description' },
          { locale: 'en', value: 'Z scope description EN' },
        ],
      },
    ])
  })

  it('does not expose scopes for the admin tenant', async () => {
    const response = await server.get(
      '/v2/public/tenants/%40admin.island.is/scopes',
    )

    expect(response.status).toBe(200)
    expect(response.body).toEqual([])
  })
})
