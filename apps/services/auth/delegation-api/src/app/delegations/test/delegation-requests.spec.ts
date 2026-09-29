import { getModelToken } from '@nestjs/sequelize'
import faker from 'faker'
import request from 'supertest'

import {
  ApiScope,
  DelegationRequest,
  DelegationRequestError,
  DelegationRequestScope,
  DelegationRequestService,
  DelegationRequestStatus,
  Delegation,
  Domain,
  NamesService,
  NotificationsApi,
} from '@island.is/auth-api-lib'
import { AuthScope } from '@island.is/auth/scopes'
import { AuthDelegationType } from '@island.is/shared/types'
import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'
import { FixtureFactory } from '@island.is/services/auth/testing'
import { TestApp } from '@island.is/testing/nest'
import { User } from '@island.is/auth-nest-tools'

import { setupWithAuth } from '../../../../test/setup'

const path = '/v1/me/delegation-requests'

const waitForCall = async (spy: jest.SpyInstance, times = 1) => {
  for (let i = 0; i < 50 && spy.mock.calls.length < times; i++) {
    await new Promise((resolve) => setTimeout(resolve, 10))
  }
}

describe('DelegationRequestsController', () => {
  const requester: User = createCurrentUser({
    scope: [AuthScope.delegations],
  })
  const granterNationalId = createNationalId('person')

  let app: TestApp
  let server: request.SuperTest<request.Test>
  let factory: FixtureFactory
  let domain: Domain
  let scope: ApiScope
  let notifySpy: jest.SpyInstance
  let svc: DelegationRequestService

  beforeAll(async () => {
    app = await setupWithAuth({ user: requester })
    server = request(app.getHttpServer())
    factory = new FixtureFactory(app)
    svc = await app.resolve(DelegationRequestService)

    domain = await factory.createDomain({ name: faker.random.word() })
    scope = await factory.createApiScope({
      domainName: domain.name,
      allowExplicitDelegationGrant: true,
    })

    const namesService = app.get(NamesService)
    jest
      .spyOn(namesService, 'getUserName')
      .mockResolvedValue(faker.name.findName())
    jest
      .spyOn(namesService, 'validateRecipientNotDeceased')
      .mockResolvedValue(faker.name.findName())

    // NotificationsApi is a scoped provider, so spy on the prototype.
    notifySpy = jest
      .spyOn(
        NotificationsApi.prototype,
        'notificationsControllerCreateHnippNotification',
      )
      .mockResolvedValue(undefined as never)
  })

  afterEach(async () => {
    await app.get(getModelToken(DelegationRequestScope)).destroy({
      where: {},
      truncate: true,
      cascade: true,
      force: true,
    })
    await app
      .get(getModelToken(DelegationRequest))
      .destroy({ where: {}, truncate: true, cascade: true, force: true })
    notifySpy.mockClear()
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  const inOneYear = () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)

  const expireRequest = (id: string) =>
    app
      .get(getModelToken(DelegationRequest))
      .update({ expiresAt: new Date(Date.now() - 1000) }, { where: { id } })

  const validBody = () => ({
    toGranterNationalId: granterNationalId,
    relationship: 'Ættingi',
    reason: 'Þarf að sinna málum',
    scopes: [{ scopeName: scope.name }],
  })

  it('creates a pending request and notifies the grantor', async () => {
    const res = await server.post(path).send(validBody())

    expect(res.status).toEqual(201)
    expect(res.body).toMatchObject({
      fromNationalId: granterNationalId,
      toNationalId: requester.nationalId,
      status: DelegationRequestStatus.Pending,
    })
    expect(res.body.scopes).toHaveLength(1)
    expect(res.body.scopes[0].scopeName).toEqual(scope.name)
    await waitForCall(notifySpy)
    expect(notifySpy).toHaveBeenCalledTimes(1)
  })

  it('stores a repeated scope only once', async () => {
    const res = await server.post(path).send({
      ...validBody(),
      scopes: [{ scopeName: scope.name }, { scopeName: scope.name }],
    })

    expect(res.status).toEqual(201)
    expect(res.body.scopes).toHaveLength(1)
  })

  it('accepts relationship and reason up to the validated length', async () => {
    const res = await server.post(path).send({
      ...validBody(),
      relationship: 'a'.repeat(1024),
      reason: 'b'.repeat(1024),
    })

    expect(res.status).toEqual(201)
  })

  it('still creates the request when the notification fails', async () => {
    jest
      .spyOn(app.get(NamesService), 'getUserName')
      .mockRejectedValueOnce(new Error('userinfo down'))

    const res = await server.post(path).send(validBody())

    expect(res.status).toEqual(201)
    expect(res.body.status).toEqual(DelegationRequestStatus.Pending)
  })

  it('lists outgoing requests for the requester', async () => {
    await server.post(path).send(validBody())

    const res = await server.get(path).query({ direction: 'outgoing' })

    expect(res.status).toEqual(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].toNationalId).toEqual(requester.nationalId)
  })

  it('rejects a request to self', async () => {
    const res = await server
      .post(path)
      .send({ ...validBody(), toGranterNationalId: requester.nationalId })

    expect(res.status).toEqual(400)
  })

  it('rejects a non-delegatable scope', async () => {
    const nonDelegatable = await factory.createApiScope({
      domainName: domain.name,
      allowExplicitDelegationGrant: false,
    })
    const res = await server.post(path).send({
      ...validBody(),
      scopes: [{ scopeName: nonDelegatable.name }],
    })

    expect(res.status).toEqual(400)
  })

  it('rejects a duplicate pending request', async () => {
    const first = await server.post(path).send(validBody())
    expect(first.status).toEqual(201)

    const second = await server.post(path).send(validBody())
    expect(second.status).toEqual(400)
  })

  it('caps the number of simultaneously pending requests', async () => {
    // Default cap is 2 pending requests per requester.
    const first = await server
      .post(path)
      .send({ ...validBody(), toGranterNationalId: createNationalId('person') })
    expect(first.status).toEqual(201)
    const second = await server
      .post(path)
      .send({ ...validBody(), toGranterNationalId: createNationalId('person') })
    expect(second.status).toEqual(201)

    const third = await server
      .post(path)
      .send({ ...validBody(), toGranterNationalId: createNationalId('person') })

    expect(third.status).toEqual(400)
    expect(third.body.detail).toEqual(DelegationRequestError.TooManyPending)
  })

  it('blocks a requester with too many recent rejections', async () => {
    // Default lock threshold is 2 rejections within the lock window.
    for (let i = 0; i < 2; i++) {
      const created = await server.post(path).send({
        ...validBody(),
        toGranterNationalId: createNationalId('person'),
      })
      expect(created.status).toEqual(201)
      await app
        .get(getModelToken(DelegationRequest))
        .update(
          { status: DelegationRequestStatus.Rejected },
          { where: { id: created.body.id } },
        )
    }

    const res = await server.post(path).send(validBody())

    expect(res.status).toEqual(403)
    expect(res.body.detail).toEqual(DelegationRequestError.Blocked)
  })

  it('limits requests to the same grantor per day, cancelled ones included', async () => {
    const created = await server.post(path).send(validBody())
    await server.post(`${path}/${created.body.id}/cancel`)

    const res = await server.post(path).send(validBody())

    expect(res.status).toEqual(400)
    expect(res.body.detail).toEqual(DelegationRequestError.RateLimited)
  })

  it('limits the number of requests created per day', async () => {
    // Default limit is 5 requests per requester per day.
    for (let i = 0; i < 5; i++) {
      const created = await server.post(path).send({
        ...validBody(),
        toGranterNationalId: createNationalId('person'),
      })
      expect(created.status).toEqual(201)
      await server.post(`${path}/${created.body.id}/cancel`)
    }

    const res = await server.post(path).send({
      ...validBody(),
      toGranterNationalId: createNationalId('person'),
    })

    expect(res.status).toEqual(400)
    expect(res.body.detail).toEqual(DelegationRequestError.RateLimited)
  })

  it('does not count expired requests towards the pending cap', async () => {
    for (let i = 0; i < 2; i++) {
      const created = await server.post(path).send({
        ...validBody(),
        toGranterNationalId: createNationalId('person'),
      })
      await expireRequest(created.body.id)
    }

    const res = await server.post(path).send({
      ...validBody(),
      toGranterNationalId: createNationalId('person'),
    })

    expect(res.status).toEqual(201)
  })

  it('rejects creating a request while acting on behalf of someone', async () => {
    const actingUser = createCurrentUser({
      nationalId: createNationalId('person'),
      actor: { nationalId: requester.nationalId },
    })

    await expect(
      svc.createRequest(actingUser, validBody()),
    ).rejects.toMatchObject({ status: 403 })
  })

  describe('as grantor', () => {
    const granter = createCurrentUser({ nationalId: granterNationalId })

    it('approves by creating the delegation and linking only it', async () => {
      const created = await server.post(path).send(validBody())
      const unrelated = await factory.createCustomDelegation({
        fromNationalId: granterNationalId,
        toNationalId: requester.nationalId,
        domainName: (await factory.createDomain({ name: faker.random.word() }))
          .name,
      })

      const result = await svc.approve(granter, created.body.id, {
        scopes: [{ name: scope.name, validTo: inOneYear() }],
      })

      expect(result.status).toEqual(DelegationRequestStatus.Approved)
      const delegation = await app
        .get(getModelToken(Delegation))
        .findByPk(result.resolvedDelegationId)
      expect(delegation).toMatchObject({
        fromNationalId: granterNationalId,
        toNationalId: requester.nationalId,
        domainName: domain.name,
      })
      expect(result.resolvedDelegationId).not.toEqual(unrelated.id)
    })

    it('cannot approve a request twice', async () => {
      const created = await server.post(path).send(validBody())
      const input = { scopes: [{ name: scope.name, validTo: inOneYear() }] }
      await svc.approve(granter, created.body.id, input)

      await expect(
        svc.approve(granter, created.body.id, input),
      ).rejects.toMatchObject({ status: 400 })
    })

    it('cannot act on an expired request', async () => {
      const created = await server.post(path).send(validBody())
      await expireRequest(created.body.id)

      await expect(
        svc.approve(granter, created.body.id, {
          scopes: [{ name: scope.name, validTo: inOneYear() }],
        }),
      ).rejects.toMatchObject({ status: 400 })
      await expect(svc.reject(granter, created.body.id)).rejects.toMatchObject({
        status: 400,
      })
    })

    it('cannot cancel a request addressed to them', async () => {
      const created = await server.post(path).send(validBody())

      await expect(svc.cancel(granter, created.body.id)).rejects.toMatchObject({
        status: 404,
      })
    })
  })

  describe('authorization', () => {
    const outsider = createCurrentUser({
      nationalId: createNationalId('person'),
    })

    it('hides the request from anyone who is not a party to it', async () => {
      const created = await server.post(path).send(validBody())
      const { id } = created.body

      for (const call of [
        () => svc.findById(outsider, id),
        () => svc.reject(outsider, id),
        () => svc.cancel(outsider, id),
        () =>
          svc.approve(outsider, id, {
            scopes: [{ name: scope.name, validTo: inOneYear() }],
          }),
      ]) {
        await expect(call()).rejects.toMatchObject({ status: 404 })
      }
    })

    it('does not let the requester approve or reject their own request', async () => {
      const created = await server.post(path).send(validBody())
      const { id } = created.body

      await expect(svc.reject(requester, id)).rejects.toMatchObject({
        status: 404,
      })
      await expect(
        svc.approve(requester, id, {
          scopes: [{ name: scope.name, validTo: inOneYear() }],
        }),
      ).rejects.toMatchObject({ status: 404 })
    })
  })

  describe('company grantor', () => {
    const companyNationalId = createNationalId('company')
    const procurationHolder = createCurrentUser({
      nationalId: companyNationalId,
      actor: { nationalId: createNationalId('person') },
      delegationType: [AuthDelegationType.ProcurationHolder],
      scope: [AuthScope.delegations],
    })

    const createCompanyRequest = async (scopeName: string) => {
      const created = await app.get(getModelToken(DelegationRequest)).create({
        id: faker.datatype.uuid(),
        fromNationalId: companyNationalId,
        toNationalId: requester.nationalId,
        relationship: 'Starfsmaður',
        reason: 'Þarf að sinna málum',
        status: DelegationRequestStatus.Pending,
        createdByNationalId: requester.nationalId,
        expiresAt: inOneYear(),
      })
      await app.get(getModelToken(DelegationRequestScope)).create({
        id: faker.datatype.uuid(),
        delegationRequestId: created.id,
        scopeName,
      })
      return created.id as string
    }

    it('lets a procuration holder who can grant the scopes reject', async () => {
      const companyScope = await factory.createApiScope({
        domainName: domain.name,
        allowExplicitDelegationGrant: true,
        grantToProcuringHolders: true,
      })
      const id = await createCompanyRequest(companyScope.name)

      const result = await svc.reject(procurationHolder, id)

      expect(result.status).toEqual(DelegationRequestStatus.Rejected)
    })

    it('does not let an actor reject scopes they could not grant', async () => {
      const personalScope = await factory.createApiScope({
        domainName: domain.name,
        allowExplicitDelegationGrant: true,
        grantToProcuringHolders: false,
      })
      const id = await createCompanyRequest(personalScope.name)

      await expect(svc.reject(procurationHolder, id)).rejects.toMatchObject({
        status: 403,
      })
    })
  })

  it('lets the requester cancel their own pending request', async () => {
    const created = await server.post(path).send(validBody())
    const { id } = created.body

    const res = await server.post(`${path}/${id}/cancel`)

    expect(res.status).toEqual(200)
    expect(res.body.status).toEqual(DelegationRequestStatus.Cancelled)
  })
})
