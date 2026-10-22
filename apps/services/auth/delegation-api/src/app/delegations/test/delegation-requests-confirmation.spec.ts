import { getModelToken } from '@nestjs/sequelize'
import addYears from 'date-fns/addYears'
import faker from 'faker'
import request from 'supertest'

import {
  DelegationConfirmation,
  DelegationConfirmationStatus,
  DelegationRequest,
  DelegationRequestScope,
  DelegationRequestService,
  DelegationRequestStatus,
  DelegationScope,
  DelegationsIndexService,
  NamesService,
  NotificationsApi,
  UserIdentitiesService,
} from '@island.is/auth-api-lib'
import { delegationScopes } from '@island.is/auth/scopes'
import { CibaClient } from '@island.is/auth/step-up'
import { FixtureFactory } from '@island.is/services/auth/testing'
import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'
import { TestApp } from '@island.is/testing/nest'

import { setupWithAuth } from '../../../../test/setup'

const SENSITIVE_SCOPE = '@island.is/health/records'
const ORDINARY_SCOPE = '@island.is/finances/schedule'

const grantorNationalId = createNationalId('person')

const grantor = createCurrentUser({
  nationalId: grantorNationalId,
  scope: [...delegationScopes],
  authorization: 'Bearer grantor-access-token',
})

const ciba = { start: jest.fn(), poll: jest.fn() }
let startedContextHash: string | undefined

describe('Delegation requests with sensitive scopes', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>
  let svc: DelegationRequestService

  beforeAll(async () => {
    app = await setupWithAuth({
      user: grantor,
      override: (builder) =>
        builder
          .overrideProvider(UserIdentitiesService)
          .useValue({
            findOrCreateSubjectId: jest
              .fn()
              .mockResolvedValue(faker.datatype.uuid()),
          })
          .overrideProvider(CibaClient)
          .useValue(ciba),
    })
    server = request(app.getHttpServer())
    svc = await app.resolve(DelegationRequestService)

    const namesService = app.get(NamesService)
    jest
      .spyOn(namesService, 'getUserName')
      .mockResolvedValue(faker.name.findName())
    jest
      .spyOn(namesService, 'getPersonName')
      .mockResolvedValue(faker.name.findName())
    jest
      .spyOn(namesService, 'validateRecipientNotDeceased')
      .mockResolvedValue(faker.name.findName())
    const index = app.get(DelegationsIndexService)
    jest.spyOn(index, 'indexDelegations').mockImplementation()
    jest.spyOn(index, 'indexCustomDelegations').mockImplementation()
    jest
      .spyOn(
        NotificationsApi.prototype,
        'notificationsControllerCreateHnippNotification',
      )
      .mockResolvedValue(undefined as never)

    await new FixtureFactory(app).createDomain({
      name: '@island.is',
      apiScopes: [
        {
          name: ORDINARY_SCOPE,
          allowExplicitDelegationGrant: true,
          grantToAuthenticatedUser: true,
        },
        {
          name: SENSITIVE_SCOPE,
          allowExplicitDelegationGrant: true,
          grantToAuthenticatedUser: true,
          requiresConfirmation: true,
        },
      ],
    })
  })

  beforeEach(() => {
    let started = 0
    startedContextHash = undefined
    ciba.start
      .mockReset()
      .mockImplementation(async (start: { contextHash?: string }) => {
        startedContextHash = start.contextHash
        started += 1
        return {
          authReqId: `auth-req-${started}`,
          method: 'sim',
          expiresIn: 300,
          interval: 5,
          verificationCode: '4821',
        }
      })
    ciba.poll.mockReset().mockResolvedValue({ status: 'pending' })
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  const createRequest = async () => {
    const requesterNationalId = createNationalId('person')
    const created = await app.get(getModelToken(DelegationRequest)).create({
      id: faker.datatype.uuid(),
      fromNationalId: grantorNationalId,
      toNationalId: requesterNationalId,
      relationship: 'Ættingi',
      reason: 'Þarf að sinna málum',
      status: DelegationRequestStatus.Pending,
      createdByNationalId: requesterNationalId,
      expiresAt: addYears(new Date(), 1),
    })
    await app.get(getModelToken(DelegationRequestScope)).bulkCreate(
      [ORDINARY_SCOPE, SENSITIVE_SCOPE].map((scopeName) => ({
        id: faker.datatype.uuid(),
        delegationRequestId: created.id,
        scopeName,
      })),
    )
    return created.id as string
  }

  const approveBoth = (id: string) =>
    svc.approve(grantor, id, {
      scopes: [ORDINARY_SCOPE, SENSITIVE_SCOPE].map((name) => ({
        name,
        validTo: addYears(new Date(), 1),
      })),
    })

  const scopeNamesFor = async (delegationId: string) =>
    (
      await app
        .get(getModelToken(DelegationScope))
        .findAll({ where: { delegationId } })
    )
      .map((scope: DelegationScope) => scope.scopeName)
      .sort()

  const confirmedOnPhone = (confirmationId: string) => {
    ciba.poll.mockResolvedValue({
      status: 'authenticated',
      claims: {
        sub: faker.datatype.uuid(),
        nationalId: grantorNationalId,
        acr: 'eidas-loa-high',
        amr: ['swk', 'pin'],
        authTime: new Date(),
        certificateThumbprint: 'AB12CD',
        contextHash: startedContextHash,
      },
    })
    return server.get(
      `/v1/me/delegation-confirmations/${confirmationId}/authentication`,
    )
  }

  it('holds the grant and keeps the request pending until confirmed', async () => {
    const id = await createRequest()

    const result = await approveBoth(id)

    expect(ciba.start).toHaveBeenCalledTimes(1)
    expect(result.status).toEqual(DelegationRequestStatus.Pending)
    expect(result.awaitingConfirmation).toBe(true)
    expect(result.pendingConfirmations).toHaveLength(1)
    expect(result.pendingConfirmations?.[0].scopeNames).toEqual(
      [ORDINARY_SCOPE, SENSITIVE_SCOPE].sort(),
    )
    expect(await scopeNamesFor(result.resolvedDelegationId as string)).toEqual(
      [],
    )
  })

  it('approves the request once the grantor confirms with electronic ID', async () => {
    const id = await createRequest()
    const approved = await approveBoth(id)
    const confirmationId = approved.pendingConfirmations?.[0].id as string

    const res = await confirmedOnPhone(confirmationId)
    const result = await svc.findById(grantor, id)

    expect(res.status).toEqual(200)
    expect(result.status).toEqual(DelegationRequestStatus.Approved)
    expect(result.awaitingConfirmation).toBe(false)
    expect(await scopeNamesFor(result.resolvedDelegationId as string)).toEqual(
      [SENSITIVE_SCOPE, ORDINARY_SCOPE].sort(),
    )
  })

  it('supersedes the confirmation when the request is rejected meanwhile', async () => {
    const id = await createRequest()
    const approved = await approveBoth(id)
    const confirmationId = approved.pendingConfirmations?.[0].id as string

    await svc.reject(grantor, id)
    await confirmedOnPhone(confirmationId)

    const confirmation = await app
      .get(getModelToken(DelegationConfirmation))
      .findByPk(confirmationId)
    expect(confirmation.status).toEqual(DelegationConfirmationStatus.Superseded)
    expect(
      await scopeNamesFor(approved.resolvedDelegationId as string),
    ).toEqual([])
    expect((await svc.findById(grantor, id)).status).toEqual(
      DelegationRequestStatus.Rejected,
    )
  })

  it('supersedes an earlier confirmation when approving again', async () => {
    const id = await createRequest()
    const first = await approveBoth(id)

    const second = await approveBoth(id)

    const firstConfirmation = await app
      .get(getModelToken(DelegationConfirmation))
      .findByPk(first.pendingConfirmations?.[0].id)
    expect(firstConfirmation.status).toEqual(
      DelegationConfirmationStatus.Superseded,
    )
    expect(second.awaitingConfirmation).toBe(true)
  })
})
