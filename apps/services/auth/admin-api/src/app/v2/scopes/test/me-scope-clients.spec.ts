import { getModelToken } from '@nestjs/sequelize'
import request from 'supertest'

import {
  ClientAllowedScope,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { FixtureFactory } from '@island.is/services/auth/testing'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { setupApp, TestApp } from '@island.is/testing/nest'

import { AppModule } from '../../../app.module'

const ownerTenant = '@owner.is'
const otherTenant = '@other.is'
const scopeName = '@owner.is/scope'
const ownClientId = '@owner.is/client-a'
const foreignClientId = '@other.is/client-b'
const unknownClientId = '@nowhere.is/missing'

const createTestData = async (app: TestApp, ownerNationalId: string) => {
  const fixtureFactory = new FixtureFactory(app)
  await fixtureFactory.createDomain({
    name: ownerTenant,
    nationalId: ownerNationalId,
  })
  await fixtureFactory.createDomain({
    name: otherTenant,
    nationalId: '2222222222',
  })
  await fixtureFactory.createApiScope({
    name: scopeName,
    domainName: ownerTenant,
  })
  await fixtureFactory.createClient({
    clientId: ownClientId,
    domainName: ownerTenant,
  })
  await fixtureFactory.createClient({
    clientId: foreignClientId,
    domainName: otherTenant,
  })
}

const getAllowedScopeRow = (app: TestApp, clientId: string) =>
  app
    .get<typeof ClientAllowedScope>(getModelToken(ClientAllowedScope))
    .findOne({ where: { clientId, scopeName } })

describe('MeScopeClientsController', () => {
  const ownerNationalId = '1111111111'
  const ownerUser = createCurrentUser({
    nationalId: ownerNationalId,
    scope: [AdminPortalScope.idsAdmin],
  })

  const path = `/v2/me/tenants/${encodeURIComponent(
    ownerTenant,
  )}/scopes/${encodeURIComponent(scopeName)}/clients`

  it('PATCH adds a same-tenant client and a cross-tenant client to the scope', async () => {
    const app = await setupApp({
      AppModule,
      SequelizeConfigService,
      user: ownerUser,
      dbType: 'postgres',
    })
    const server = request(app.getHttpServer())
    await createTestData(app, ownerNationalId)

    const res = await server.patch(path).send({
      addedClientIds: [ownClientId, foreignClientId],
      removedClientIds: [],
    })

    expect(res.status).toEqual(200)
    expect(await getAllowedScopeRow(app, ownClientId)).not.toBeNull()
    expect(await getAllowedScopeRow(app, foreignClientId)).not.toBeNull()

    app.cleanUp()
  })

  it('PATCH removes a previously-granted client', async () => {
    const app = await setupApp({
      AppModule,
      SequelizeConfigService,
      user: ownerUser,
      dbType: 'postgres',
    })
    const server = request(app.getHttpServer())
    await createTestData(app, ownerNationalId)

    // Seed the grant first
    await app
      .get<typeof ClientAllowedScope>(getModelToken(ClientAllowedScope))
      .create({ clientId: foreignClientId, scopeName })

    const res = await server.patch(path).send({
      addedClientIds: [],
      removedClientIds: [foreignClientId],
    })

    expect(res.status).toEqual(200)
    expect(await getAllowedScopeRow(app, foreignClientId)).toBeNull()

    app.cleanUp()
  })

  it('PATCH rejects unknown clientIds with 400', async () => {
    const app = await setupApp({
      AppModule,
      SequelizeConfigService,
      user: ownerUser,
      dbType: 'postgres',
    })
    const server = request(app.getHttpServer())
    await createTestData(app, ownerNationalId)

    const res = await server.patch(path).send({
      addedClientIds: [unknownClientId],
      removedClientIds: [],
    })

    expect(res.status).toEqual(400)
    expect(await getAllowedScopeRow(app, unknownClientId)).toBeNull()

    app.cleanUp()
  })

  it('PATCH returns 204 (no content) when the scope does not belong to the path tenant', async () => {
    const nonOwnerNationalId = '3333333333'
    const nonOwner = createCurrentUser({
      nationalId: nonOwnerNationalId,
      scope: [AdminPortalScope.idsAdmin],
    })
    const app = await setupApp({
      AppModule,
      SequelizeConfigService,
      user: nonOwner,
      dbType: 'postgres',
    })
    const server = request(app.getHttpServer())
    await createTestData(app, ownerNationalId)

    // The non-owner owns @other.is; try to write through that tenant's path
    // pretending @owner.is/scope belongs to them.
    const wrongPath = `/v2/me/tenants/${encodeURIComponent(
      otherTenant,
    )}/scopes/${encodeURIComponent(scopeName)}/clients`

    const res = await server.patch(wrongPath).send({
      addedClientIds: [ownClientId],
      removedClientIds: [],
    })

    expect(res.status).toEqual(204)
    expect(await getAllowedScopeRow(app, ownClientId)).toBeNull()

    app.cleanUp()
  })

  it('GET returns clients granted to the scope, including cross-tenant ones', async () => {
    const app = await setupApp({
      AppModule,
      SequelizeConfigService,
      user: ownerUser,
      dbType: 'postgres',
    })
    const server = request(app.getHttpServer())
    await createTestData(app, ownerNationalId)

    const clientAllowedScopeModel = app.get<typeof ClientAllowedScope>(
      getModelToken(ClientAllowedScope),
    )
    await clientAllowedScopeModel.create({
      clientId: ownClientId,
      scopeName,
    })
    await clientAllowedScopeModel.create({
      clientId: foreignClientId,
      scopeName,
    })

    const res = await server.get(path)

    expect(res.status).toEqual(200)
    const ids = res.body.map((c: { clientId: string }) => c.clientId).sort()
    expect(ids).toEqual([foreignClientId, ownClientId].sort())

    app.cleanUp()
  })
})
