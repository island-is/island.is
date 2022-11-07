import addDays from 'date-fns/addDays'
import request from 'supertest'

import {
  CreateDelegationDTO,
  Delegation,
  DelegationValidity,
  PatchDelegationDTO,
} from '@island.is/auth-api-lib'
import {
  expectMatchingDelegations,
  findExpectedDelegationModels,
} from '@island.is/services/auth/testing'
import { createNationalId } from '@island.is/testing/fixtures'
import { TestApp } from '@island.is/testing/nest'

import { FixtureFactory } from '../../../../test/fixtures/fixture-factory'
import { setupWithAuth } from '../../../../test/setup'
import {
  testCompanyActorNationalId,
  testCompanyDelegations,
  testCompanyUser,
  testDelegations,
  testDomains,
  testScopes,
  testUser,
} from './test-data'

describe('MeDelegationsController filters', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>
  let factory: FixtureFactory
  let delegations: Record<keyof typeof testDelegations, Delegation>

  beforeAll(async () => {
    app = await setupWithAuth({
      user: testUser,
    })
    server = request(app.getHttpServer())
    factory = new FixtureFactory(app)

    await Object.values(testDomains).map((domain) =>
      factory.createDomain(domain),
    )

    delegations = Object.fromEntries(
      await Promise.all(
        Object.entries(testDelegations).map(([key, delegation]) =>
          factory
            .createCustomDelegation(delegation)
            .then((delegation) => [key, delegation]),
        ),
      ),
    )
  })

  it('GET /v1/me/delegations returns all outgoing delegations across domains with all scopes', async () => {
    // Arrange
    const expectedModels = await findExpectedDelegationModels(
      factory.get(Delegation),
      [
        delegations.validOutgoing.id,
        delegations.futureValidOutgoing.id,
        delegations.expiredOutgoing.id,
        delegations.variedValidity.id,
        delegations.withOneNotAllowedOutgoing.id,
        delegations.validOutgoingInOtherDomain.id,
      ],
      [
        testScopes.mainValid,
        testScopes.mainFuture,
        testScopes.mainExpired,
        testScopes.otherValid,
      ],
    )

    // Act
    const res = await server.get(`/v1/me/delegations`)

    // Assert
    expect(res.status).toEqual(200)
    expectMatchingDelegations(res.body, expectedModels)
  })

  it('GET /v1/me/delegations?validity=now returns valid outgoing delegations across domains with filtered scopes', async () => {
    // Arrange
    const expectedModels = await findExpectedDelegationModels(
      factory.get(Delegation),
      [
        delegations.validOutgoing.id,
        delegations.variedValidity.id,
        delegations.withOneNotAllowedOutgoing.id,
        delegations.validOutgoingInOtherDomain.id,
      ],
      [testScopes.mainValid, testScopes.otherValid],
    )

    // Act
    const res = await server.get(
      `/v1/me/delegations?validity=${DelegationValidity.NOW}`,
    )

    // Assert
    expect(res.status).toEqual(200)
    expectMatchingDelegations(res.body, expectedModels)
  })

  it('GET /v1/me/delegations?validity=includeFuture returns future valid outgoing delegations across domains with filtered scopes', async () => {
    // Arrange
    const expectedModels = await findExpectedDelegationModels(
      factory.get(Delegation),
      [
        delegations.validOutgoing.id,
        delegations.futureValidOutgoing.id,
        delegations.variedValidity.id,
        delegations.withOneNotAllowedOutgoing.id,
        delegations.validOutgoingInOtherDomain.id,
      ],
      [testScopes.mainValid, testScopes.mainFuture, testScopes.otherValid],
    )

    // Act
    const res = await server.get(
      `/v1/me/delegations?validity=${DelegationValidity.INCLUDE_FUTURE}`,
    )

    // Assert
    expect(res.status).toEqual(200)
    expectMatchingDelegations(res.body, expectedModels)
  })

  it('GET /v1/me/delegations?validity=past returns expired delegations across domains', async () => {
    // Arrange
    const expectedModels = await findExpectedDelegationModels(
      factory.get(Delegation),
      [delegations.expiredOutgoing.id, delegations.variedValidity.id],
      [testScopes.mainExpired],
    )

    // Act
    const res = await server.get(
      `/v1/me/delegations?validity=${DelegationValidity.PAST}`,
    )

    // Assert
    expect(res.status).toEqual(200)
    expectMatchingDelegations(res.body, expectedModels)
  })

  it('GET /v1/me/delegations?domain=domainName returns delegation for a specific domain', async () => {
    // Arrange
    const expectedModels = await findExpectedDelegationModels(
      factory.get(Delegation),
      [delegations.validOutgoingInOtherDomain.id],
      [testScopes.otherValid],
    )

    // Act
    const res = await server.get(
      `/v1/me/delegations?domain=${delegations.validOutgoingInOtherDomain.domainName}`,
    )

    // Assert
    expect(res.status).toEqual(200)
    expectMatchingDelegations(res.body, expectedModels)
  })

  it('GET /v1/me/delegations?domain=domainName with X-Query-OtherUser returns delegation for a specific individual', async () => {
    // Arrange
    const expectedModels = await findExpectedDelegationModels(
      factory.get(Delegation),
      [delegations.validOutgoing.id],
      [testScopes.mainValid],
    )

    // Act
    const res = await server
      .get(`/v1/me/delegations?domain=${delegations.validOutgoing.domainName}`)
      .set('X-Query-OtherUser', delegations.validOutgoing.toNationalId)

    // Assert
    expect(res.status).toEqual(200)
    expectMatchingDelegations(res.body, expectedModels)
  })

  it('GET /v1/me/delegations?domain=domainName with X-Query-OtherUser returns empty array if no delegation exists for a specific individual', async () => {
    // Act
    const res = await server
      .get(`/v1/me/delegations?domain=${delegations.validOutgoing.domainName}`)
      .set('X-Query-OtherUser', createNationalId('person'))

    // Assert
    expect(res.status).toEqual(200)
    expect(res.body).toEqual([])
  })

  it('GET /v1/me/delegations with X-Query-OtherUser fails without domainName', async () => {
    // Act
    const res = await server
      .get(`/v1/me/delegations`)
      .set('X-Query-OtherUser', delegations.validOutgoing.toNationalId)

    // Assert
    expect(res.status).toEqual(400)
    expect(res.body).toMatchInlineSnapshot(`
      Object {
        "detail": "Domain name is required when fetching delegation by other user.",
        "status": 400,
        "title": "Bad Request",
        "type": "https://httpstatuses.org/400",
      }
    `)
  })

  it('GET /v1/me/delegations should return 400 Bad Request when direction has invalid value', async () => {
    // Act
    const res = await server.get(`/v1/me/delegations?direction=asdf`)

    // Assert
    expect(res.status).toEqual(400)
    expect(res.body).toMatchInlineSnapshot(`
      Object {
        "detail": "direction=outgoing is currently the only supported value",
        "status": 400,
        "title": "Bad Request",
        "type": "https://httpstatuses.org/400",
      }
    `)
  })

  it('GET /v1/me/delegations/:id should not filter expired scopes', async () => {
    // Arrange
    const expectedModel = await findExpectedDelegationModels(
      factory.get(Delegation),
      delegations.variedValidity.id,
    )

    // Act
    const res = await server.get(
      `/v1/me/delegations/${delegations.variedValidity.id}`,
    )

    // Assert
    expect(res.status).toEqual(200)
    expectMatchingDelegations(res.body, expectedModel)
  })

  it('GET /v1/me/delegations/:id should return 204 if delegation belongs to another user', async () => {
    // Act
    const res = await server.get(
      `/v1/me/delegations/${delegations.otherUsers.id}`,
    )

    // Assert
    expect(res.status).toEqual(204)
  })

  it('POST /v1/me/delegations should return 400 when scopes have a validTo in the past', async () => {
    // Arrange
    const dto: CreateDelegationDTO = {
      domainName: testDomains.main.name,
      toNationalId: createNationalId('person'),
      scopes: [
        { name: testScopes.mainValid, validTo: addDays(new Date(), -3) },
      ],
    }
    // Act
    const res = await server.post(`/v1/me/delegations`).send(dto)

    // Assert
    expect(res.status).toEqual(400)
    expect(res.body).toMatchInlineSnapshot(`
      Object {
        "detail": "When scope validTo property is provided it must be in the future",
        "status": 400,
        "title": "Bad Request",
        "type": "https://httpstatuses.org/400",
      }
    `)
  })

  it("POST /v1/me/delegations should return 400 when scopes don't have validTo set", async () => {
    // Arrange
    const dto: CreateDelegationDTO = {
      domainName: testDomains.main.name,
      toNationalId: createNationalId('person'),
      scopes: [{ name: testScopes.mainValid } as never],
    }
    // Act
    const res = await server.post(`/v1/me/delegations`).send(dto)

    // Assert
    expect(res.status).toEqual(400)
    expect(res.body).toMatchInlineSnapshot(`
      Object {
        "detail": Array [
          "scopes.0.validTo must be a Date instance",
        ],
        "status": 400,
        "title": "Bad Request",
        "type": "https://httpstatuses.org/400",
      }
    `)
  })

  it('PATCH /v1/me/delegations/:id should return 400 when scopes have a validTo in the past', async () => {
    // Arrange
    const dto: PatchDelegationDTO = {
      updateScopes: [
        { name: testScopes.mainValid, validTo: addDays(new Date(), -3) },
      ],
    }

    // Act
    const res = await server
      .patch(`/v1/me/delegations/${delegations.validOutgoing.id}`)
      .send(dto)

    // Assert
    expect(res.status).toEqual(400)
    expect(res.body).toMatchInlineSnapshot(`
      Object {
        "detail": "If scope validTo property is provided it must be in the future",
        "status": 400,
        "title": "Bad Request",
        "type": "https://httpstatuses.org/400",
      }
    `)
  })

  it("PATCH /v1/me/delegations/:id should return 400 when scopes don't have validTo set", async () => {
    // Arrange
    const dto: PatchDelegationDTO = {
      updateScopes: [{ name: testScopes.mainValid } as never],
    }

    // Act
    const res = await server
      .patch(`/v1/me/delegations/${delegations.validOutgoing.id}`)
      .send(dto)

    // Assert
    expect(res.status).toEqual(400)
    expect(res.body).toMatchInlineSnapshot(`
      Object {
        "detail": Array [
          "updateScopes.0.validTo must be a Date instance",
        ],
        "status": 400,
        "title": "Bad Request",
        "type": "https://httpstatuses.org/400",
      }
    `)
  })

  it('PATCH /v1/me/delegations/:id should return 204 if delegation belongs to another user', async () => {
    // Arrange
    const dto: PatchDelegationDTO = {
      updateScopes: [
        { name: testScopes.mainValid, validTo: addDays(new Date(), 30) },
      ],
    }

    // Act
    const res = await server
      .patch(`/v1/me/delegations/${delegations.otherUsers.id}`)
      .send(dto)

    // Assert
    expect(res.status).toEqual(204)
  })

  it('PATCH /v1/me/delegations/:id should return 204 for incoming delegations', async () => {
    // Arrange
    const dto: PatchDelegationDTO = {
      updateScopes: [
        { name: testScopes.mainValid, validTo: addDays(new Date(), 30) },
      ],
    }

    // Act
    const res = await server
      .patch(`/v1/me/delegations/${delegations.incomingValid.id}`)
      .send(dto)

    // Assert
    expect(res.status).toEqual(204)
  })

  it('DELETE /v1/me/delegations/:id should return 204 if delegation belongs to another user', async () => {
    // Act
    const res = await server.delete(
      `/v1/me/delegations/${delegations.otherUsers.id}`,
    )

    // Assert
    expect(res.status).toEqual(204)
  })
})

describe('MeDelegationController company filters', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>
  let factory: FixtureFactory
  let delegations: Record<keyof typeof testCompanyDelegations, Delegation>

  beforeAll(async () => {
    app = await setupWithAuth({
      user: testCompanyUser,
    })
    server = request(app.getHttpServer())
    factory = new FixtureFactory(app)

    await Object.values(testDomains).map((domain) =>
      factory.createDomain(domain),
    )

    delegations = Object.fromEntries(
      await Promise.all(
        Object.entries(testCompanyDelegations).map(([key, delegation]) =>
          factory
            .createCustomDelegation(delegation)
            .then((delegation) => [key, delegation]),
        ),
      ),
    )
  })

  it('GET /v1/me/delegations should not return delegations to the actor', async () => {
    // Arrange
    const expectedModels = await findExpectedDelegationModels(
      factory.get(Delegation),
      [delegations.validOutgoing.id],
    )

    // Act
    const res = await server.get(`/v1/me/delegations`)

    // Assert
    expect(res.status).toEqual(200)
    expectMatchingDelegations(res.body, expectedModels)
  })

  it('GET /v1/me/delegations?domain=domainName with X-Query-OtherUser returns empty delegation array if user has access to domain but no delegation scopes', async () => {
    // Arrange
    const expectedModels = await findExpectedDelegationModels(
      factory.get(Delegation),
      [delegations.otherScope.id],
      [],
    )

    // Act
    const res = await server
      .get(`/v1/me/delegations?domain=${delegations.otherScope.domainName}`)
      .set('X-Query-OtherUser', delegations.otherScope.toNationalId)

    // Assert
    expect(res.status).toEqual(200)
    expectMatchingDelegations(res.body, expectedModels)
  })

  it('GET /v1/me/delegations?domain=domainName with X-Query-OtherUser returns empty array if user has no access in domain', async () => {
    // Act
    const res = await server
      .get(`/v1/me/delegations?domain=${delegations.otherDomain.domainName}`)
      .set('X-Query-OtherUser', delegations.otherDomain.toNationalId)

    // Assert
    expect(res.status).toEqual(200)
    expect(res.body).toEqual([])
  })

  it('POST /v1/me/delegations should return 400 when creating delegation to actor', async () => {
    // Arrange
    const dto: CreateDelegationDTO = {
      domainName: testDomains.main.name,
      toNationalId: testCompanyActorNationalId,
      scopes: [
        { name: testScopes.mainValid, validTo: addDays(new Date(), 30) },
      ],
    }
    // Act
    const res = await server.post(`/v1/me/delegations`).send(dto)

    // Assert
    expect(res.status).toEqual(400)
    expect(res.body).toMatchInlineSnapshot(`
      Object {
        "detail": "Cannot create delegation to self or actor.",
        "status": 400,
        "title": "Bad Request",
        "type": "https://httpstatuses.org/400",
      }
    `)
  })

  it('GET /v1/me/delegations/:id should return empty delegation if user has access to domain but no delegation scopes', async () => {
    // Arrange
    const expectedModel = await findExpectedDelegationModels(
      factory.get(Delegation),
      delegations.otherScope.id,
      [],
    )

    // Act
    const res = await server.get(
      `/v1/me/delegations/${delegations.otherScope.id}`,
    )

    // Assert
    expect(res.status).toEqual(200)
    expectMatchingDelegations(res.body, expectedModel)
  })

  it('PATCH /v1/me/delegations/:id should return 204 when updating delegation to actor', async () => {
    // Arrange
    const dto: PatchDelegationDTO = {
      updateScopes: [
        { name: testScopes.mainValid, validTo: addDays(new Date(), 30) },
      ],
    }

    // Act
    const res = await server
      .patch(`/v1/me/delegations/${delegations.actorDelegation.id}`)
      .send(dto)

    // Assert
    expect(res.status).toEqual(204)
  })
})
