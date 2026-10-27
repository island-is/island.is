import { getModelToken } from '@nestjs/sequelize'
import addYears from 'date-fns/addYears'
import faker from 'faker'
import request from 'supertest'

import {
  Delegation,
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
const OTHER_DOMAIN = 'other-domain'
const OTHER_DOMAIN_SCOPE = 'other-domain/ordinary'

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
    await new FixtureFactory(app).createDomain({
      name: OTHER_DOMAIN,
      apiScopes: [
        {
          name: OTHER_DOMAIN_SCOPE,
          allowExplicitDelegationGrant: true,
          grantToAuthenticatedUser: true,
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

  const createRequest = async (
    scopeNames = [ORDINARY_SCOPE, SENSITIVE_SCOPE],
  ) => {
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
      scopeNames.map((scopeName) => ({
        id: faker.datatype.uuid(),
        delegationRequestId: created.id,
        scopeName,
      })),
    )
    return created.id as string
  }

  const approveScopes = (id: string, scopeNames: string[]) =>
    svc.approve(grantor, id, {
      scopes: scopeNames.map((name) => ({
        name,
        validTo: addYears(new Date(), 1),
      })),
    })

  const approveBoth = (id: string) =>
    approveScopes(id, [ORDINARY_SCOPE, SENSITIVE_SCOPE])

  const requesterOf = async (id: string) =>
    createCurrentUser({
      nationalId: (await app.get(getModelToken(DelegationRequest)).findByPk(id))
        .toNationalId,
      scope: [...delegationScopes],
    })

  const delegationExists = async (delegationId: string) =>
    Boolean(await app.get(getModelToken(Delegation)).findByPk(delegationId))

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
      await delegationExists(approved.resolvedDelegationId as string),
    ).toBe(false)
    const rejected = await svc.findById(grantor, id)
    expect(rejected.status).toEqual(DelegationRequestStatus.Rejected)
    expect(rejected.resolvedDelegationId).toBeNull()
  })

  it('removes the held delegation when the requester cancels', async () => {
    const id = await createRequest()
    const approved = await approveBoth(id)

    await svc.cancel(await requesterOf(id), id)

    expect(
      await delegationExists(approved.resolvedDelegationId as string),
    ).toBe(false)
    expect((await svc.findById(grantor, id)).status).toEqual(
      DelegationRequestStatus.Cancelled,
    )
  })

  it('does not let a cancel override a grant the grantor already confirmed', async () => {
    const id = await createRequest()
    const approved = await approveBoth(id)
    await confirmedOnPhone(approved.pendingConfirmations?.[0].id as string)

    await expect(svc.cancel(await requesterOf(id), id)).rejects.toThrow(
      'not pending',
    )

    const result = await svc.findById(grantor, id)
    expect(result.status).toEqual(DelegationRequestStatus.Approved)
    expect(await scopeNamesFor(result.resolvedDelegationId as string)).toEqual(
      [SENSITIVE_SCOPE, ORDINARY_SCOPE].sort(),
    )
  })

  it('does not let a reject override a grant the grantor already confirmed', async () => {
    const id = await createRequest()
    const approved = await approveBoth(id)
    await confirmedOnPhone(approved.pendingConfirmations?.[0].id as string)

    await expect(svc.reject(grantor, id)).rejects.toThrow('not pending')

    expect((await svc.findById(grantor, id)).status).toEqual(
      DelegationRequestStatus.Approved,
    )
  })

  it('approves a confirmed request even once it is past its expiry', async () => {
    const id = await createRequest()
    const approved = await approveBoth(id)
    await confirmedOnPhone(approved.pendingConfirmations?.[0].id as string)
    await app
      .get(getModelToken(DelegationRequest))
      .update({ expiresAt: new Date(Date.now() - 1000) }, { where: { id } })

    expect((await svc.findById(grantor, id)).status).toEqual(
      DelegationRequestStatus.Approved,
    )
  })

  it('holds every domain of the request until the sensitive scopes are confirmed', async () => {
    const id = await createRequest([SENSITIVE_SCOPE, OTHER_DOMAIN_SCOPE])

    const approved = await approveScopes(id, [
      SENSITIVE_SCOPE,
      OTHER_DOMAIN_SCOPE,
    ])

    expect(ciba.start).toHaveBeenCalledTimes(1)
    expect(approved.status).toEqual(DelegationRequestStatus.Pending)
    expect(approved.pendingConfirmations).toHaveLength(2)
    const otherDomainDelegation = await app
      .get(getModelToken(Delegation))
      .findOne({
        where: {
          fromNationalId: grantorNationalId,
          toNationalId: approved.toNationalId,
          domainName: OTHER_DOMAIN,
        },
      })
    expect(await scopeNamesFor(otherDomainDelegation.id)).toEqual([])

    await confirmedOnPhone(approved.pendingConfirmations?.[0].id as string)

    expect((await svc.findById(grantor, id)).status).toEqual(
      DelegationRequestStatus.Approved,
    )
    expect(await scopeNamesFor(otherDomainDelegation.id)).toEqual([
      OTHER_DOMAIN_SCOPE,
    ])
  })

  it('grants a request without sensitive scopes straight away', async () => {
    const id = await createRequest([ORDINARY_SCOPE, OTHER_DOMAIN_SCOPE])

    const approved = await approveScopes(id, [
      ORDINARY_SCOPE,
      OTHER_DOMAIN_SCOPE,
    ])

    expect(ciba.start).not.toHaveBeenCalled()
    expect(approved.status).toEqual(DelegationRequestStatus.Approved)
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
