import { getModelToken } from '@nestjs/sequelize'
import faker from 'faker'
import request from 'supertest'

import {
  ApiScope,
  DelegationRequest,
  DelegationRequestError,
  DelegationRequestScope,
  DelegationRequestStatus,
  Domain,
  NamesService,
  NotificationsApi,
} from '@island.is/auth-api-lib'
import { AuthScope } from '@island.is/auth/scopes'
import { createCurrentUser, createNationalId } from '@island.is/testing/fixtures'
import { FixtureFactory } from '@island.is/services/auth/testing'
import { TestApp } from '@island.is/testing/nest'
import { User } from '@island.is/auth-nest-tools'

import { setupWithAuth } from '../../../../test/setup'

const path = '/v1/me/delegation-requests'

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

  beforeAll(async () => {
    app = await setupWithAuth({ user: requester })
    server = request(app.getHttpServer())
    factory = new FixtureFactory(app)

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

    // Avoid real notification network calls (feature flag mock returns truthy).
    // NotificationsApi is a scoped provider, so spy on the prototype rather
    // than a container instance.
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

  const validBody = () => ({
    toGranterNationalId: granterNationalId,
    domainName: domain.name,
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
    expect(notifySpy).toHaveBeenCalledTimes(1)
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

  it('lets the requester cancel their own pending request', async () => {
    const created = await server.post(path).send(validBody())
    const { id } = created.body

    const res = await server.post(`${path}/${id}/cancel`)

    expect(res.status).toEqual(200)
    expect(res.body.status).toEqual(DelegationRequestStatus.Cancelled)
  })
})
