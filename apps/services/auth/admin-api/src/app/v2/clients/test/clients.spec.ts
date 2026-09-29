import request from 'supertest'

import { SequelizeConfigService } from '@island.is/auth-api-lib'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { FixtureFactory } from '@island.is/services/auth/testing'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { setupApp, TestApp } from '@island.is/testing/nest'

import { AppModule } from '../../../app.module'

const tenantA = '@tenant-a.is'
const tenantB = '@tenant-b.is'
const clientA = '@tenant-a.is/client-a'
const clientB = '@tenant-b.is/client-b'

const createTestData = async (app: TestApp) => {
  const fixtureFactory = new FixtureFactory(app)
  await fixtureFactory.createDomain({
    name: tenantA,
    nationalId: '1111111111',
  })
  await fixtureFactory.createDomain({
    name: tenantB,
    nationalId: '2222222222',
  })
  await fixtureFactory.createClient({
    clientId: clientA,
    domainName: tenantA,
  })
  await fixtureFactory.createClient({
    clientId: clientB,
    domainName: tenantB,
  })
  // Archived client should not appear in results
  const archived = await fixtureFactory.createClient({
    clientId: '@tenant-a.is/archived-client',
    domainName: tenantA,
  })
  await archived.update({ archived: new Date() })
}

describe('ClientsController', () => {
  const user = createCurrentUser({
    scope: [AdminPortalScope.idsAdmin],
  })

  it('GET /v2/clients returns all clients across tenants with minimal fields', async () => {
    // Arrange
    const app = await setupApp({
      AppModule,
      SequelizeConfigService,
      user,
      dbType: 'postgres',
    })
    const server = request(app.getHttpServer())
    await createTestData(app)

    // Act
    const res = await server.get('/v2/clients')

    // Assert
    expect(res.status).toEqual(200)

    const ids = res.body.map((c: { clientId: string }) => c.clientId).sort()
    expect(ids).toEqual([clientA, clientB])

    const a = res.body.find((c: { clientId: string }) => c.clientId === clientA)
    expect(a).toMatchObject({
      clientId: clientA,
      tenantId: tenantA,
      clientType: expect.any(String),
      displayName: expect.any(Array),
    })

    // The minimal DTO must NOT leak fields like secrets, redirect URIs, etc.
    expect(a).not.toHaveProperty('redirectUris')
    expect(a).not.toHaveProperty('allowedScopes')
    expect(a).not.toHaveProperty('customClaims')
    expect(a).not.toHaveProperty('clientSecrets')

    // CleanUp
    app.cleanUp()
  })
})
