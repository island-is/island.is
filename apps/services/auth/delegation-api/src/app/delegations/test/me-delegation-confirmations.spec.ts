import { ForbiddenException } from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'
import addYears from 'date-fns/addYears'
import subMinutes from 'date-fns/subMinutes'
import faker from 'faker'
import request from 'supertest'

import {
  Delegation,
  DelegationConfirmation,
  DelegationConfirmationService,
  DelegationConfirmationStatus,
  DelegationResourcesService,
  DelegationScope,
  DelegationsIndexService,
  DelegationsOutgoingService,
  Domain,
  NamesService,
  UserIdentitiesService,
} from '@island.is/auth-api-lib'
import { delegationScopes } from '@island.is/auth/scopes'
import { CibaClient } from '@island.is/auth/step-up'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import { AuthDelegationType } from '@island.is/shared/types'
import { FixtureFactory } from '@island.is/services/auth/testing'
import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'
import { TestApp } from '@island.is/testing/nest'

import { setupWithAuth } from '../../../../test/setup'

const SENSITIVE_SCOPE = '@island.is/health/records'
const ORDINARY_SCOPE = '@island.is/finances/schedule'
const REQUIRED_ACR = 'eidas-loa-high'

const grantorNationalId = createNationalId('person')
const recipientNationalId = createNationalId('person')

/**
 * Stands in for the identity server's CIBA endpoints. Each test decides what
 * the identity server answers when delegation-api polls.
 */
const ciba = {
  start: jest.fn(),
  poll: jest.fn(),
}

/** The context hash the last step-up was started with, as the identity server keeps it. */
let startedContextHash: string | undefined

/** What the identity server vouches for once someone approves on their phone. */
const approvedBy = (
  nationalId: string,
  overrides: Partial<{ acr: string; authTime: Date; contextHash: string }> = {},
) =>
  ciba.poll.mockImplementation(async () => ({
    status: 'authenticated',
    claims: {
      sub: faker.datatype.uuid(),
      nationalId,
      acr: REQUIRED_ACR,
      amr: ['swk', 'pin'],
      authTime: new Date(),
      certificateThumbprint: 'AB12CD',
      contextHash: startedContextHash,
      ...overrides,
    },
  }))

const grantorToken = 'Bearer grantor-access-token'

describe('MeDelegationConfirmationsController', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>
  let factory: FixtureFactory
  let domain: Domain

  const setup = async (
    userOverrides: Parameters<typeof createCurrentUser>[0] = {},
  ) => {
    app = await setupWithAuth({
      user: createCurrentUser({
        nationalId: grantorNationalId,
        scope: [...delegationScopes],
        authorization: grantorToken,
        ...userOverrides,
      }),
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

    // Stub fire-and-forget indexing so stray queries don't outlive the suite.
    const delegationIndexService = app.get(DelegationsIndexService)
    jest.spyOn(delegationIndexService, 'indexDelegations').mockImplementation()
    jest
      .spyOn(delegationIndexService, 'indexCustomDelegations')
      .mockImplementation()

    startedContextHash = undefined
    ciba.start
      .mockReset()
      .mockImplementation(async (request: { contextHash?: string }) => {
        startedContextHash = request.contextHash
        return {
          authReqId: 'auth-req-1',
          method: 'sim',
          expiresIn: 300,
          interval: 5,
          verificationCode: '4821',
          availableMethods: ['app', 'sim'],
        }
      })
    ciba.poll.mockReset().mockResolvedValue({ status: 'pending' })

    factory = new FixtureFactory(app)

    domain = await factory.createDomain({
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
  }

  const grant = (scopes: string[]) =>
    server.post('/v1/me/delegations').send({
      toNationalId: recipientNationalId,
      domainName: domain.name,
      scopes: scopes.map((name) => ({
        name,
        validTo: addYears(new Date(), 1),
      })),
    })

  const scopeNamesInDb = async (): Promise<string[]> => {
    const scopes = await app
      .get<typeof DelegationScope>(getModelToken(DelegationScope))
      .findAll()

    return scopes.map((scope) => scope.scopeName).sort()
  }

  const confirmations = () =>
    app.get<typeof DelegationConfirmation>(
      getModelToken(DelegationConfirmation),
    )

  afterEach(async () => {
    // Some spies sit on shared mocks (the feature flag service), so they must
    // not outlive their test.
    jest.restoreAllMocks()
    await app?.cleanUp()
  })

  describe('holding sensitive scopes', () => {
    beforeEach(() => setup())

    it('grants an ordinary scope immediately', async () => {
      // Act
      const res = await grant([ORDINARY_SCOPE])

      // Assert
      expect(res.status).toEqual(201)
      expect(res.body.pendingConfirmations).toBeUndefined()
      expect(await scopeNamesInDb()).toEqual([ORDINARY_SCOPE])
    })

    it('does not write a sensitive scope, and returns a pending confirmation', async () => {
      // Act
      const res = await grant([SENSITIVE_SCOPE])

      // Assert
      expect(res.status).toEqual(201)
      expect(res.body.pendingConfirmations).toHaveLength(1)
      expect(res.body.pendingConfirmations[0]).toMatchObject({
        toNationalId: recipientNationalId,
        requestedAcr: REQUIRED_ACR,
        scopeNames: [SENSITIVE_SCOPE],
      })
      // The whole point of reserve-don't-write: no row exists to leak.
      expect(await scopeNamesInDb()).toEqual([])
    })

    it('grants a sensitive scope as before when the grantor does not have the feature', async () => {
      // Arrange — the flag off for this grantor; the scope is still marked.
      jest
        .spyOn(app.get(FeatureFlagService), 'getValue')
        .mockImplementation(async (feature) =>
          feature === Features.isDelegationConfirmationEnabled ? false : '*',
        )

      // Act
      const res = await grant([SENSITIVE_SCOPE])

      // Assert — no 500, no confirmation: exactly what happened before.
      expect(res.status).toEqual(201)
      expect(res.body.pendingConfirmations).toBeUndefined()
      expect(await scopeNamesInDb()).toEqual([SENSITIVE_SCOPE])
    })

    it('grants the ordinary scopes of a mixed grant and holds only the sensitive one', async () => {
      // Act
      const res = await grant([ORDINARY_SCOPE, SENSITIVE_SCOPE])

      // Assert
      expect(res.status).toEqual(201)
      expect(res.body.pendingConfirmations[0].scopeNames).toEqual([
        SENSITIVE_SCOPE,
      ])
      expect(await scopeNamesInDb()).toEqual([ORDINARY_SCOPE])
    })

    it('supersedes an earlier pending confirmation instead of duplicating it', async () => {
      // Arrange
      await grant([SENSITIVE_SCOPE])

      // Act
      await grant([SENSITIVE_SCOPE])

      // Assert
      const rows = await confirmations().findAll()
      expect(rows).toHaveLength(2)
      expect(
        rows.filter(
          (row) => row.status === DelegationConfirmationStatus.Pending,
        ),
      ).toHaveLength(1)
      expect(
        rows.filter(
          (row) => row.status === DelegationConfirmationStatus.Superseded,
        ),
      ).toHaveLength(1)
    })

    it('does not return a held scope to the recipient', async () => {
      // Arrange
      await grant([SENSITIVE_SCOPE])

      // Act
      const res = await server
        .get('/v1/me/delegations?direction=incoming')
        .set('X-Query-OtherUser', recipientNationalId)

      // Assert — nothing to filter, because nothing was written.
      expect(await scopeNamesInDb()).toEqual([])
      expect(res.status).toBeLessThan(500)
    })
  })

  describe('the confirming authentication', () => {
    let confirmationId: string

    const requestConfirmation = async () => {
      const res = await grant([SENSITIVE_SCOPE])
      confirmationId = res.body.pendingConfirmations[0].id
    }

    const start = () =>
      server.post(
        `/v1/me/delegation-confirmations/${confirmationId}/authentication`,
      )

    const status = () =>
      server.get(
        `/v1/me/delegation-confirmations/${confirmationId}/authentication`,
      )

    beforeEach(async () => {
      await setup()
      await requestConfirmation()
    })

    it('asks the identity server to authenticate the grantor, showing the binding message', async () => {
      // Act
      const res = await start()

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject({
        method: 'sim',
        verificationCode: '4821',
        interval: 5,
      })

      const row = await confirmations().findByPk(confirmationId)
      // Only who and what. Who is the grantor's own token — the identity server
      // authenticates the person behind it — and how they are reached is its
      // decision, from the way they last logged in.
      expect(ciba.start).toHaveBeenCalledWith({
        userToken: grantorToken,
        bindingMessage: row?.contentSnapshot.bindingMessage,
        // Bound into what the grantor's key signs.
        contextHash: row?.contentHash,
      })
      expect(row?.contentSnapshot.bindingMessage).toMatch(
        /^Umboð til .+ · 1 heimild$/,
      )
      expect(row).toMatchObject({
        authReqId: 'auth-req-1',
        authMethod: 'sim',
        authStartCount: 1,
      })
    })

    it('lets the grantor ask for the other method', async () => {
      // Act — e.g. the SIM isn't at hand.
      const res = await server
        .post(
          `/v1/me/delegation-confirmations/${confirmationId}/authentication`,
        )
        .send({ method: 'app' })

      // Assert — the choice reaches the identity server, which still decides
      // where "sim" goes.
      expect(res.status).toEqual(200)
      expect(ciba.start).toHaveBeenCalledWith(
        expect.objectContaining({ method: 'app' }),
      )
      expect(res.body.availableMethods).toEqual(['app', 'sim'])
    })

    it.each([
      [{ method: 'card' }],
      [{ phoneNumber: '699-1234' }],
      [{ method: 'sim', phoneNumber: '699-1234' }],
    ])('lets no one choose where the request goes (%j)', async (body) => {
      // Act — a client trying to name a number, or a method we don't offer.
      const res = await server
        .post(
          `/v1/me/delegation-confirmations/${confirmationId}/authentication`,
        )
        .send(body)

      // Assert — refused before anything reaches the identity server.
      expect(res.status).toEqual(400)
      expect(ciba.start).not.toHaveBeenCalled()
    })

    it('leaves the default method to the identity server', async () => {
      // Act — no choice made: the identity server goes by how the session
      // behind the grantor's token was logged in.
      const res = await start()

      // Assert
      expect(res.status).toEqual(200)
      expect(Object.keys(ciba.start.mock.calls[0][0]).sort()).toEqual([
        'bindingMessage',
        'contextHash',
        'userToken',
      ])
    })

    it('reports not_started before anything is started', async () => {
      // Act
      const res = await status()

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body.status).toEqual('not_started')
      expect(ciba.poll).not.toHaveBeenCalled()
    })

    it('stays pending, with nothing granted, until the grantor approves', async () => {
      // Arrange
      await start()

      // Act
      const res = await status()

      // Assert
      expect(res.body.status).toEqual('pending')
      expect(await scopeNamesInDb()).toEqual([])
    })

    it('grants the held scopes once the grantor approves', async () => {
      // Arrange
      await start()
      approvedBy(grantorNationalId)

      // Act
      const res = await status()

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body.status).toEqual('confirmed')
      expect(res.body.confirmation.status).toEqual(
        DelegationConfirmationStatus.Confirmed,
      )
      expect(await scopeNamesInDb()).toEqual([SENSITIVE_SCOPE])
    })

    it('records the authentication as evidence, and forgets the request handle', async () => {
      // Arrange
      await start()
      approvedBy(grantorNationalId)

      // Act
      await status()

      // Assert
      const row = await confirmations().findByPk(confirmationId)
      expect(row).toMatchObject({
        status: DelegationConfirmationStatus.Confirmed,
        confirmingNationalId: grantorNationalId,
        acr: REQUIRED_ACR,
        amr: ['swk', 'pin'],
        certificateThumbprint: 'AB12CD',
        authReqId: null,
      })
      expect(row?.authTime).toBeInstanceOf(Date)
      expect(row?.confirmedAt).toBeInstanceOf(Date)
    })

    it('completes once, however often the client polls', async () => {
      // Arrange
      // Request-scoped, so spy on the prototype rather than an instance.
      const notify = jest
        .spyOn(
          DelegationsOutgoingService.prototype,
          'notifyConfirmedDelegation',
        )
        .mockResolvedValue(undefined as never)
      await start()
      approvedBy(grantorNationalId)

      // Act
      await status()
      const again = await status()

      // Assert
      expect(again.body.status).toEqual('confirmed')
      expect(ciba.poll).toHaveBeenCalledTimes(1)
      expect(notify).toHaveBeenCalledTimes(1)
    })

    it('refuses an approval by someone other than the grantor', async () => {
      // Arrange
      await start()
      approvedBy(createNationalId('person'))

      // Act
      const res = await status()

      // Assert — refused, counted, and still open for the real grantor.
      expect(res.status).toEqual(403)
      const row = await confirmations().findByPk(confirmationId)
      expect(row).toMatchObject({
        status: DelegationConfirmationStatus.Pending,
        attemptCount: 1,
        authReqId: null,
      })
      expect(await scopeNamesInDb()).toEqual([])
    })

    it('refuses an approval made for other content', async () => {
      // Arrange — the person approved, but what their key signed was bound to
      // something else.
      await start()
      approvedBy(grantorNationalId, { contextHash: 'f'.repeat(64) })

      // Act
      const res = await status()

      // Assert
      expect(res.status).toEqual(403)
      expect(await scopeNamesInDb()).toEqual([])
    })

    it('refuses to grant what the grantor can no longer give', async () => {
      // Arrange — access lost between requesting and approving.
      await start()
      approvedBy(grantorNationalId)
      jest
        .spyOn(app.get(DelegationResourcesService), 'validateScopeAccess')
        .mockResolvedValue(false)

      // Act
      const res = await status()

      // Assert
      expect(res.status).toEqual(403)
      expect(await scopeNamesInDb()).toEqual([])
      expect((await confirmations().findByPk(confirmationId))?.status).toEqual(
        DelegationConfirmationStatus.Pending,
      )
    })

    it('lets the procuration holder who granted for a company confirm it', async () => {
      // Arrange — the grant was made by a procuration holder for the company.
      const actorNationalId = createNationalId('person')
      await confirmations().update(
        { actorNationalId },
        { where: { id: confirmationId } },
      )
      const procurationHolder = createCurrentUser({
        nationalId: grantorNationalId,
        scope: [...delegationScopes],
        authorization: 'Bearer procuration-holder-token',
        actor: { nationalId: actorNationalId, scope: [...delegationScopes] },
        delegationType: [AuthDelegationType.ProcurationHolder],
      })
      jest
        .spyOn(app.get(DelegationResourcesService), 'validateScopeAccess')
        .mockResolvedValue(true)
      const service = app.get(DelegationConfirmationService)

      // Act
      await service.startAuthentication(procurationHolder, confirmationId)
      approvedBy(actorNationalId)
      const result = await service.getAuthenticationStatus(
        procurationHolder,
        confirmationId,
      )

      // Assert — the holder's own token named the person to reach.
      expect(ciba.start).toHaveBeenCalledWith(
        expect.objectContaining({
          userToken: 'Bearer procuration-holder-token',
        }),
      )
      expect(result.status).toEqual('confirmed')
      expect(await scopeNamesInDb()).toEqual([SENSITIVE_SCOPE])
    })

    it('refuses someone acting for the grantor under a custom delegation', async () => {
      // Arrange
      const customActor = createCurrentUser({
        nationalId: grantorNationalId,
        scope: [...delegationScopes],
        actor: {
          nationalId: createNationalId('person'),
          scope: [...delegationScopes],
        },
        delegationType: [AuthDelegationType.Custom],
      })
      const service = app.get(DelegationConfirmationService)

      // Act / Assert — neither start nor follow it.
      await expect(
        service.startAuthentication(customActor, confirmationId),
      ).rejects.toThrow(ForbiddenException)
      await expect(
        service.getAuthenticationStatus(customActor, confirmationId),
      ).rejects.toThrow(ForbiddenException)
      expect(ciba.start).not.toHaveBeenCalled()
    })

    it('refuses a weaker authentication than required', async () => {
      // Arrange — e.g. a passkey. The dev override is off in tests.
      await start()
      approvedBy(grantorNationalId, { acr: 'islandis-passkey' })

      // Act
      const res = await status()

      // Assert
      expect(res.status).toEqual(403)
      expect(await scopeNamesInDb()).toEqual([])
    })

    it('refuses an authentication made before the step-up started', async () => {
      // Arrange
      await start()
      approvedBy(grantorNationalId, {
        authTime: subMinutes(new Date(), 5),
      })

      // Act
      const res = await status()

      // Assert
      expect(res.status).toEqual(403)
      expect(await scopeNamesInDb()).toEqual([])
    })

    it('lets the grantor try again after declining', async () => {
      // Arrange
      await start()
      ciba.poll.mockResolvedValue({ status: 'denied' })

      // Act
      const declined = await status()
      const restarted = await start()

      // Assert
      expect(declined.body.status).toEqual('denied')
      expect(restarted.status).toEqual(200)
      expect(
        (await confirmations().findByPk(confirmationId))?.authStartCount,
      ).toEqual(2)
    })

    it('reports a step-up that ran out of time', async () => {
      // Arrange
      await start()
      ciba.poll.mockResolvedValue({ status: 'expired' })

      // Act
      const res = await status()

      // Assert
      expect(res.body.status).toEqual('timed_out')
      const row = await confirmations().findByPk(confirmationId)
      expect(row?.status).toEqual(DelegationConfirmationStatus.Pending)
      expect(row?.authReqId).toBeNull()
    })

    it('caps how many step-ups can be started', async () => {
      // Arrange — the limit is 5 by default.
      for (let i = 0; i < 5; i++) {
        expect((await start()).status).toEqual(200)
      }

      // Act
      const res = await start()

      // Assert
      expect(res.status).toEqual(429)
      expect(ciba.start).toHaveBeenCalledTimes(5)
    })

    it('reports and refuses an expired confirmation', async () => {
      // Arrange
      await confirmations().update(
        { expiresAt: subMinutes(new Date(), 1) },
        { where: { id: confirmationId } },
      )

      // Act
      const startRes = await start()
      const statusRes = await status()

      // Assert
      expect(startRes.status).toEqual(410)
      expect(statusRes.body.status).toEqual('expired')
      expect(ciba.start).not.toHaveBeenCalled()
    })

    it('is invisible to anyone but the grantor', async () => {
      // Arrange
      const otherUser = createCurrentUser({
        nationalId: createNationalId('person'),
        scope: [...delegationScopes],
      })
      const service = app.get(DelegationConfirmationService)

      // Act / Assert — no oracle: the same answer as for an id that doesn't exist.
      await expect(
        service.startAuthentication(otherUser, confirmationId),
      ).rejects.toThrow()
      await expect(
        service.getAuthenticationStatus(otherUser, confirmationId),
      ).rejects.toThrow()
      expect(ciba.start).not.toHaveBeenCalled()
    })
  })

  describe('receipt', () => {
    it('is available once confirmed and not before', async () => {
      // Arrange
      await setup()
      const res = await grant([SENSITIVE_SCOPE])
      const { id, contentHash } = res.body.pendingConfirmations[0]

      // Act — before confirming
      const before = await server.get(
        `/v1/me/delegation-confirmations/${id}/receipt`,
      )

      // Assert
      expect(before.status).toEqual(204)

      // Act — after confirming
      await server.post(`/v1/me/delegation-confirmations/${id}/authentication`)
      approvedBy(grantorNationalId)
      await server.get(`/v1/me/delegation-confirmations/${id}/authentication`)
      const after = await server.get(
        `/v1/me/delegation-confirmations/${id}/receipt`,
      )

      // Assert
      expect(after.status).toEqual(200)
      expect(after.body).toMatchObject({
        confirmationId: id,
        fromNationalId: grantorNationalId,
        toNationalId: recipientNationalId,
        acr: REQUIRED_ACR,
        contentHash,
        contentHashAlg: 'sha256',
        certificateThumbprint: 'AB12CD',
      })
      expect(after.body.scopes).toHaveLength(1)
      // Names the identity provider that attested the login, not a userinfo URL.
      expect(after.body.receiptIssuer).toEqual('https://identity-server.test')
    })
  })

  describe('the delegation envelope', () => {
    it('is kept while a confirmation is pending', async () => {
      // Arrange
      await setup()

      // Act
      await grant([SENSITIVE_SCOPE])

      // Assert — the envelope the held scopes attach to on redemption.
      const delegations = await app
        .get<typeof Delegation>(getModelToken(Delegation))
        .findAll()
      expect(delegations).toHaveLength(1)
      expect(delegations[0].toNationalId).toEqual(recipientNationalId)
    })
  })
})
