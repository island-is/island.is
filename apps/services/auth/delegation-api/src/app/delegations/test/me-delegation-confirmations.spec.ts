import {
  BadRequestException,
  ForbiddenException,
  ServiceUnavailableException,
  Type,
} from '@nestjs/common'
import { getConnectionToken, getModelToken } from '@nestjs/sequelize'
import addYears from 'date-fns/addYears'
import subMinutes from 'date-fns/subMinutes'
import faker from 'faker'
import { Sequelize } from 'sequelize-typescript'
import request from 'supertest'

import {
  Delegation,
  DelegationConfirmation,
  DelegationConfirmationService,
  DelegationConfirmationStatus,
  DelegationResourcesService,
  DelegationScope,
  DelegationScopeService,
  DelegationsIndexService,
  DelegationsOutgoingService,
  Domain,
  hashConfirmationGroup,
  NamesService,
  UserIdentitiesService,
} from '@island.is/auth-api-lib'
import { delegationScopes } from '@island.is/auth/scopes'
import {
  CibaClient,
  SessionCannotStepUpError,
  StepUpTokenRejectedError,
  StepUpUnavailableError,
} from '@island.is/auth/step-up'
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
const secondRecipientNationalId = createNationalId('person')

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
    let started = 0
    ciba.start
      .mockReset()
      .mockImplementation(async (request: { contextHash?: string }) => {
        startedContextHash = request.contextHash
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

  const grant = (scopes: string[], validTo = addYears(new Date(), 1)) =>
    server.post('/v1/me/delegations').send({
      toNationalId: recipientNationalId,
      domainName: domain.name,
      scopes: scopes.map((name) => ({ name, validTo })),
    })

  const status = (confirmationId: string) =>
    server.get(
      `/v1/me/delegation-confirmations/${confirmationId}/authentication`,
    )

  const scopeNamesInDb = async (): Promise<string[]> => {
    const scopes = await app
      .get<typeof DelegationScope>(getModelToken(DelegationScope))
      .findAll()

    return scopes.map((scope) => scope.scopeName).sort()
  }

  const delegationsInDb = () =>
    app.get<typeof Delegation>(getModelToken(Delegation)).findAll()

  const confirmations = () =>
    app.get<typeof DelegationConfirmation>(
      getModelToken(DelegationConfirmation),
    )

  /** Starts a step-up the way a save does: inside a transaction. */
  const startAs = async (
    user: ReturnType<typeof createCurrentUser>,
    confirmationId: string,
  ) => {
    const sequelize = await app.resolve(getConnectionToken() as Type<Sequelize>)
    const row = await confirmations().findByPk(confirmationId)
    return sequelize.transaction((transaction) =>
      app
        .get(DelegationConfirmationService)
        .startAuthentication(
          user,
          [row as DelegationConfirmation],
          transaction,
        ),
    )
  }

  afterEach(async () => {
    // Some spies sit on shared mocks (the feature flag service), so they must
    // not outlive their test.
    jest.restoreAllMocks()
    await app?.cleanUp()
  })

  describe('saving a grant', () => {
    beforeEach(() => setup())

    it('grants an ordinary scope immediately, with no step-up', async () => {
      // Act
      const res = await grant([ORDINARY_SCOPE])

      // Assert
      expect(res.status).toEqual(201)
      expect(res.body.pendingConfirmations).toBeUndefined()
      expect(await scopeNamesInDb()).toEqual([ORDINARY_SCOPE])
      expect(ciba.start).not.toHaveBeenCalled()
    })

    it('holds a sensitive scope and starts the step-up as part of the save', async () => {
      // Act
      const res = await grant([SENSITIVE_SCOPE])

      // Assert — held, with the step-up already on its way to the phone.
      expect(res.status).toEqual(201)
      expect(res.body.pendingConfirmations).toHaveLength(1)
      expect(res.body.pendingConfirmations[0]).toMatchObject({
        toNationalId: recipientNationalId,
        scopeNames: [SENSITIVE_SCOPE],
        authentication: {
          method: 'sim',
          verificationCode: '4821',
          interval: 5,
        },
      })
      // The whole point of reserve-don't-write: no row exists to leak.
      expect(await scopeNamesInDb()).toEqual([])

      const row = await confirmations().findByPk(
        res.body.pendingConfirmations[0].id,
      )
      // Only who and what. Who is the grantor's own token — the identity server
      // authenticates the person behind it — and how they are reached is its
      // decision, from the way they logged in.
      expect(ciba.start).toHaveBeenCalledTimes(1)
      expect(ciba.start).toHaveBeenCalledWith({
        userToken: grantorToken,
        bindingMessage: row?.contentSnapshot.bindingMessage,
        // Bound into what the grantor's key signs.
        contextHash: row?.contentHash,
      })
      expect(row?.contentSnapshot.bindingMessage).toMatch(
        /^Umboð til .+ · 1 heimild$/,
      )
      expect(row).toMatchObject({ authReqId: 'auth-req-1', authMethod: 'sim' })
      expect(row?.authStartedAt).toBeInstanceOf(Date)
    })

    it.each([
      [
        'the session can never be stepped up',
        new SessionCannotStepUpError(),
        403,
      ],
      ['step-up is not available', new StepUpUnavailableError(), 403],
      [
        'the identity server refuses for now',
        new BadRequestException('access_denied (too many pending)'),
        400,
      ],
      [
        'the identity server is down',
        new ServiceUnavailableException('unreachable'),
        503,
      ],
    ])('undoes the whole save when %s', async (_, refusal, expectedStatus) => {
      // Arrange
      ciba.start.mockRejectedValue(refusal)

      // Act
      const res = await grant([ORDINARY_SCOPE, SENSITIVE_SCOPE])

      // Assert — nothing written, nothing held, nothing left to expire.
      expect(res.status).toEqual(expectedStatus)
      expect(await scopeNamesInDb()).toEqual([])
      expect(await confirmations().count()).toEqual(0)
      expect(await delegationsInDb()).toHaveLength(0)
    })

    it('refuses a sensitive scope when the grantor does not have the feature', async () => {
      // Arrange — the flag off for this grantor; the scope is still marked.
      jest
        .spyOn(app.get(FeatureFlagService), 'getValue')
        .mockImplementation(async (feature) =>
          feature === Features.isDelegationConfirmationEnabled ? false : '*',
        )

      // Act
      const res = await grant([SENSITIVE_SCOPE])

      // Assert — never granted without a confirmation, and none can be had.
      expect(res.status).toEqual(403)
      expect(await scopeNamesInDb()).toEqual([])
      expect(await confirmations().count()).toEqual(0)
      expect(ciba.start).not.toHaveBeenCalled()
    })

    it('still grants ordinary scopes when the grantor does not have the feature', async () => {
      // Arrange
      jest
        .spyOn(app.get(FeatureFlagService), 'getValue')
        .mockImplementation(async (feature) =>
          feature === Features.isDelegationConfirmationEnabled ? false : '*',
        )

      // Act
      const res = await grant([ORDINARY_SCOPE])

      // Assert
      expect(res.status).toEqual(201)
      expect(await scopeNamesInDb()).toEqual([ORDINARY_SCOPE])
    })

    it('refuses a sensitive scope when the flag cannot be read', async () => {
      // Arrange — ConfigCat unreachable: the client answers with the default.
      jest
        .spyOn(app.get(FeatureFlagService), 'getValue')
        .mockImplementation(async (_feature, defaultValue) => defaultValue)

      // Act
      const res = await grant([SENSITIVE_SCOPE])

      // Assert — an outage must not hand out sensitive scopes in one click.
      expect(res.status).toEqual(403)
      expect(await scopeNamesInDb()).toEqual([])
    })

    it('refuses to write a sensitive scope without a confirmation', async () => {
      // Arrange — a write path with no confirmation to show for it.
      const { body: delegation } = await grant([ORDINARY_SCOPE])

      // Act
      const write = app.get(DelegationScopeService).createOrUpdate(
        delegation.id,
        [
          { name: ORDINARY_SCOPE, validTo: addYears(new Date(), 2) },
          { name: SENSITIVE_SCOPE, validTo: addYears(new Date(), 1) },
        ],
        undefined,
      )

      // Assert — refused as forbidden, not a crash, and without a transaction
      // the scope it would have replaced is still there.
      await expect(write).rejects.toBeInstanceOf(ForbiddenException)
      await expect(write).rejects.toThrow(/without a redeemed confirmation/)
      expect(await scopeNamesInDb()).toEqual([ORDINARY_SCOPE])
    })

    it('refuses sensitive scopes from a session logged in with an ID card', async () => {
      // Arrange — a card login: the step-up can't be done with a card.
      await app.cleanUp()
      await setup({ amr: ['hwk', 'sc', 'pin'] })

      // Act
      const res = await grant([ORDINARY_SCOPE, SENSITIVE_SCOPE])

      // Assert — nothing written, nothing held, no phone asked.
      expect(res.status).toEqual(403)
      expect(await scopeNamesInDb()).toEqual([])
      expect(await confirmations().count()).toEqual(0)
      expect(ciba.start).not.toHaveBeenCalled()
    })

    it('still grants ordinary scopes from a card session', async () => {
      // Arrange
      await app.cleanUp()
      await setup({ amr: ['hwk', 'sc', 'pin'] })

      // Act
      const res = await grant([ORDINARY_SCOPE])

      // Assert
      expect(res.status).toEqual(201)
      expect(await scopeNamesInDb()).toEqual([ORDINARY_SCOPE])
    })

    it('holds the whole grant when any of it is sensitive, and writes it all at once when confirmed', async () => {
      // Act — one ordinary and one sensitive scope in the same grant.
      const res = await grant([ORDINARY_SCOPE, SENSITIVE_SCOPE])

      // Assert — nothing takes effect yet, not even the ordinary scope, so a
      // grantor who stops at the step-up hasn't half-granted anything.
      expect(res.status).toEqual(201)
      expect(res.body.pendingConfirmations[0].scopeNames).toEqual(
        [SENSITIVE_SCOPE, ORDINARY_SCOPE].sort(),
      )
      expect(await scopeNamesInDb()).toEqual([])

      // Act — the grantor confirms.
      approvedBy(grantorNationalId)
      const confirmed = await status(res.body.pendingConfirmations[0].id)

      // Assert — all of it, together.
      expect(confirmed.body.status).toEqual('confirmed')
      expect(await scopeNamesInDb()).toEqual(
        [ORDINARY_SCOPE, SENSITIVE_SCOPE].sort(),
      )
    })

    it('holds a sensitive scope added by a patch, starting its step-up', async () => {
      // Arrange — a delegation that already gives an ordinary scope.
      const { body: delegation } = await grant([ORDINARY_SCOPE])

      // Act
      const res = await server
        .patch(`/v1/me/delegations/${delegation.id}`)
        .send({
          updateScopes: [
            { name: SENSITIVE_SCOPE, validTo: addYears(new Date(), 1) },
          ],
        })

      // Assert — the ordinary scope stays, the sensitive one waits.
      expect(res.status).toEqual(200)
      expect(res.body.pendingConfirmations[0]).toMatchObject({
        scopeNames: [SENSITIVE_SCOPE],
        authentication: { method: 'sim', verificationCode: '4821' },
      })
      expect(ciba.start).toHaveBeenCalledTimes(1)
      expect(await scopeNamesInDb()).toEqual([ORDINARY_SCOPE])
    })

    it('undoes a patch whose step-up cannot start', async () => {
      // Arrange
      const { body: delegation } = await grant([ORDINARY_SCOPE])
      ciba.start.mockRejectedValue(new SessionCannotStepUpError())

      // Act — remove the ordinary scope and add a sensitive one in one patch.
      const res = await server
        .patch(`/v1/me/delegations/${delegation.id}`)
        .send({
          deleteScopes: [ORDINARY_SCOPE],
          updateScopes: [
            { name: SENSITIVE_SCOPE, validTo: addYears(new Date(), 1) },
          ],
        })

      // Assert — none of the patch applied.
      expect(res.status).toEqual(403)
      expect(await scopeNamesInDb()).toEqual([ORDINARY_SCOPE])
      expect(await confirmations().count()).toEqual(0)
    })

    describe('editing a delegation that already has a sensitive scope', () => {
      const confirmGrant = async (scopes: string[], validTo: Date) => {
        const res = await grant(scopes, validTo)
        approvedBy(grantorNationalId)
        await status(res.body.pendingConfirmations[0].id)
      }

      it('does not hold the edit for the sensitive scope sent back unchanged', async () => {
        // Arrange — granted and confirmed earlier.
        const validTo = addYears(new Date(), 1)
        await confirmGrant([SENSITIVE_SCOPE], validTo)
        ciba.start.mockClear()

        // Act — the edit form sends every selected scope back, the confirmed
        // sensitive one included, with the same date.
        const res = await grant([ORDINARY_SCOPE, SENSITIVE_SCOPE], validTo)

        // Assert — the new ordinary scope takes effect, nothing waits.
        expect(res.status).toEqual(201)
        expect(res.body.pendingConfirmations).toBeUndefined()
        expect(ciba.start).not.toHaveBeenCalled()
        expect(await scopeNamesInDb()).toEqual(
          [ORDINARY_SCOPE, SENSITIVE_SCOPE].sort(),
        )
      })

      it('still holds it when its date changes', async () => {
        // Arrange
        await confirmGrant([SENSITIVE_SCOPE], addYears(new Date(), 1))

        // Act
        const res = await grant([SENSITIVE_SCOPE], addYears(new Date(), 2))

        // Assert
        expect(res.status).toEqual(201)
        expect(res.body.pendingConfirmations).toHaveLength(1)
      })
    })

    it('leaves no empty delegation behind when a first grant expires unconfirmed', async () => {
      // Arrange — a first grant to this recipient, held for confirmation.
      const res = await grant([SENSITIVE_SCOPE])
      await confirmations().update(
        { expiresAt: subMinutes(new Date(), 1) },
        { where: { id: res.body.pendingConfirmations[0].id } },
      )

      // Act — the cleanup worker runs.
      await app.get(DelegationConfirmationService).expirePending()

      // Assert
      expect(await delegationsInDb()).toHaveLength(0)
    })

    it('supersedes an earlier pending confirmation when the grant is saved again', async () => {
      // Arrange
      await grant([SENSITIVE_SCOPE])

      // Act — a retry is simply saving again.
      await grant([SENSITIVE_SCOPE])

      // Assert — one waiting, with its own step-up; the earlier one is over.
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
      expect(ciba.start).toHaveBeenCalledTimes(2)
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

    it('keeps the delegation envelope while a confirmation is pending', async () => {
      // Act
      await grant([SENSITIVE_SCOPE])

      // Assert — the envelope the held scopes attach to on redemption.
      const delegations = await delegationsInDb()
      expect(delegations).toHaveLength(1)
      expect(delegations[0].toNationalId).toEqual(recipientNationalId)
    })
  })

  describe('following the step-up', () => {
    let confirmationId: string

    beforeEach(async () => {
      await setup()
      const res = await grant([SENSITIVE_SCOPE])
      confirmationId = res.body.pendingConfirmations[0].id
    })

    const rowStatus = async () =>
      (await confirmations().findByPk(confirmationId))?.status

    it('refuses an id that is not a confirmation id', async () => {
      // Act
      const res = await server.get(
        '/v1/me/delegation-confirmations/not-a-uuid/authentication',
      )

      // Assert — a bad request, not a database error.
      expect(res.status).toEqual(400)
    })

    it('stays pending, with nothing granted, until the grantor approves', async () => {
      // Act
      const res = await status(confirmationId)

      // Assert
      expect(res.body.status).toEqual('pending')
      expect(await scopeNamesInDb()).toEqual([])
    })

    it('grants the held scopes once the grantor approves', async () => {
      // Arrange
      approvedBy(grantorNationalId)

      // Act
      const res = await status(confirmationId)

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toEqual({ status: 'confirmed' })
      expect(await scopeNamesInDb()).toEqual([SENSITIVE_SCOPE])
    })

    it('records the authentication as evidence, and forgets the request handle', async () => {
      // Arrange
      approvedBy(grantorNationalId)

      // Act
      await status(confirmationId)

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

    it('completes and notifies once, however often the client polls', async () => {
      // Arrange — request-scoped, so spy on the prototype.
      const notify = jest
        .spyOn(DelegationsOutgoingService.prototype, 'notifyConfirmed')
        .mockResolvedValue(undefined)
      approvedBy(grantorNationalId)

      // Act
      await status(confirmationId)
      const again = await status(confirmationId)

      // Assert — a new delegation, as far as the recipient is concerned.
      expect(again.body.status).toEqual('confirmed')
      expect(ciba.poll).toHaveBeenCalledTimes(1)
      expect(notify).toHaveBeenCalledTimes(1)
      expect(notify.mock.calls[0][1]).toEqual([
        { delegationId: expect.any(String), hadExistingScopes: false },
      ])
    })

    it('tells the recipient about an update when the delegation already gave access', async () => {
      // Arrange — the delegation gives an ordinary scope; then a sensitive one
      // is added, which supersedes the earlier held grant.
      await grant([ORDINARY_SCOPE])
      const res = await grant([SENSITIVE_SCOPE])
      const notify = jest
        .spyOn(DelegationsOutgoingService.prototype, 'notifyConfirmed')
        .mockResolvedValue(undefined)
      approvedBy(grantorNationalId)

      // Act
      await status(res.body.pendingConfirmations[0].id)

      // Assert
      expect(notify.mock.calls[0][1]).toEqual([
        { delegationId: expect.any(String), hadExistingScopes: true },
      ])
    })

    it.each([
      ['someone other than the grantor approved', { nationalId: 'other' }],
      ['the approval was for other content', { contextHash: 'f'.repeat(64) }],
      [
        'the authentication is weaker than required',
        { acr: 'islandis-passkey' },
      ],
      [
        'the authentication predates the step-up',
        { authTime: subMinutes(new Date(), 5) },
      ],
    ])('refuses and ends it when %s', async (_, override) => {
      // Arrange
      const { nationalId, ...claims } = override as {
        nationalId?: string
        contextHash?: string
        acr?: string
        authTime?: Date
      }
      approvedBy(
        nationalId ? createNationalId('person') : grantorNationalId,
        claims,
      )

      // Act
      const res = await status(confirmationId)

      // Assert — refused, nothing granted, and over: retrying means saving
      // again, and the empty first grant is gone.
      expect(res.status).toEqual(403)
      expect(await scopeNamesInDb()).toEqual([])
      expect(await rowStatus()).toEqual(DelegationConfirmationStatus.Expired)
      expect(await delegationsInDb()).toHaveLength(0)
      expect((await status(confirmationId)).body.status).toEqual('expired')
    })

    it('refuses to grant what the grantor can no longer give', async () => {
      // Arrange — access lost between saving and approving.
      approvedBy(grantorNationalId)
      jest
        .spyOn(app.get(DelegationResourcesService), 'validateScopeAccess')
        .mockResolvedValue(false)

      // Act
      const res = await status(confirmationId)

      // Assert
      expect(res.status).toEqual(403)
      expect(await scopeNamesInDb()).toEqual([])
      expect(await rowStatus()).toEqual(DelegationConfirmationStatus.Expired)
    })

    it('ends it when the token the identity server handed out is rejected', async () => {
      // Arrange — the token can't be collected again.
      ciba.poll.mockRejectedValue(new StepUpTokenRejectedError('bad issuer'))

      // Act
      const res = await status(confirmationId)

      // Assert
      expect(res.status).toEqual(400)
      expect(await rowStatus()).toEqual(DelegationConfirmationStatus.Expired)
    })

    it('keeps it waiting through an identity server outage', async () => {
      // Arrange
      ciba.poll.mockRejectedValue(new ServiceUnavailableException('down'))

      // Act
      const res = await status(confirmationId)

      // Assert — the client polls again, and the approval can still come.
      expect(res.status).toEqual(503)
      const row = await confirmations().findByPk(confirmationId)
      expect(row).toMatchObject({
        status: DelegationConfirmationStatus.Pending,
        authReqId: 'auth-req-1',
      })
    })

    it('ends it when the grantor declines, and a new save starts over', async () => {
      // Arrange
      ciba.poll.mockResolvedValue({ status: 'denied' })

      // Act
      const declined = await status(confirmationId)
      const retried = await grant([SENSITIVE_SCOPE])

      // Assert
      expect(declined.body.status).toEqual('denied')
      expect(await rowStatus()).toEqual(DelegationConfirmationStatus.Expired)
      expect(retried.status).toEqual(201)
      expect(retried.body.pendingConfirmations[0].authentication).toBeDefined()
      expect(ciba.start).toHaveBeenCalledTimes(2)
    })

    it('reports a step-up that ran out of time without ending the confirmation', async () => {
      // Arrange — the identity server answers the same when another poll has
      // just collected the token, so this must not undo that poll's work.
      ciba.poll.mockResolvedValue({ status: 'expired' })

      // Act
      const res = await status(confirmationId)

      // Assert
      expect(res.body.status).toEqual('timed_out')
      const row = await confirmations().findByPk(confirmationId)
      expect(row?.status).toEqual(DelegationConfirmationStatus.Pending)
    })

    it('reports an expired confirmation without asking the identity server', async () => {
      // Arrange
      await confirmations().update(
        { expiresAt: subMinutes(new Date(), 1) },
        { where: { id: confirmationId } },
      )

      // Act
      const res = await status(confirmationId)

      // Assert
      expect(res.body.status).toEqual('expired')
      expect(ciba.poll).not.toHaveBeenCalled()
      expect(await rowStatus()).toEqual(DelegationConfirmationStatus.Expired)
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
      ciba.start.mockClear()

      // Act
      await startAs(procurationHolder, confirmationId)
      approvedBy(actorNationalId)
      const result = await app
        .get(DelegationConfirmationService)
        .getAuthenticationStatus(procurationHolder, confirmationId)

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
      ciba.start.mockClear()

      // Act / Assert — neither start nor follow it.
      await expect(startAs(customActor, confirmationId)).rejects.toThrow(
        ForbiddenException,
      )
      await expect(
        app
          .get(DelegationConfirmationService)
          .getAuthenticationStatus(customActor, confirmationId),
      ).rejects.toThrow(ForbiddenException)
      expect(ciba.start).not.toHaveBeenCalled()
    })

    it('is invisible to anyone but the grantor', async () => {
      // Arrange
      const otherUser = createCurrentUser({
        nationalId: createNationalId('person'),
        scope: [...delegationScopes],
      })

      // Act / Assert — no oracle: the same answer as for an id that doesn't exist.
      await expect(
        app
          .get(DelegationConfirmationService)
          .getAuthenticationStatus(otherUser, confirmationId),
      ).rejects.toThrow()
      expect(ciba.poll).not.toHaveBeenCalled()
    })
  })

  describe('one authentication for a whole grant', () => {
    const grantToBoth = () =>
      server.post('/v1/me/delegations/batch').send({
        delegations: [recipientNationalId, secondRecipientNationalId].map(
          (toNationalId) => ({
            toNationalId,
            domainName: domain.name,
            scopes: [
              { name: SENSITIVE_SCOPE, validTo: addYears(new Date(), 1) },
            ],
          }),
        ),
      })

    const pendingIds = (res: request.Response): string[] =>
      res.body.flatMap(
        (delegation: { pendingConfirmations?: { id: string }[] }) =>
          (delegation.pendingConfirmations ?? []).map(
            (confirmation) => confirmation.id,
          ),
      )

    beforeEach(() => setup())

    it('groups what one save holds under one step-up, with one message for the phone', async () => {
      // Act
      const res = await grantToBoth()

      // Assert
      expect(res.status).toEqual(201)
      const ids = pendingIds(res)
      expect(ids).toHaveLength(2)

      const rows = await confirmations().findAll({ where: { id: ids } })
      expect(rows[0].groupId).toBeTruthy()
      expect(rows[1].groupId).toEqual(rows[0].groupId)
      for (const row of rows) {
        expect(row.contentSnapshot.bindingMessage).toEqual(
          'Umboð til 2 aðila · 2 heimildir',
        )
        expect(row.authReqId).toEqual('auth-req-1')
      }

      // One step-up, bound to both confirmations together.
      expect(ciba.start).toHaveBeenCalledTimes(1)
      expect(ciba.start.mock.calls[0][0].contextHash).toEqual(
        hashConfirmationGroup(rows.map((row) => row.contentHash)),
      )
    })

    it('confirms all of it with one authentication, and notifies once per recipient', async () => {
      // Arrange
      const ids = pendingIds(await grantToBoth())
      const notify = jest
        .spyOn(DelegationsOutgoingService.prototype, 'notifyConfirmed')
        .mockResolvedValue(undefined)
      approvedBy(grantorNationalId)

      // Act
      const res = await status(ids[0])

      // Assert
      expect(res.body.status).toEqual('confirmed')
      const rows = await confirmations().findAll({ where: { id: ids } })
      for (const row of rows) {
        expect(row.status).toEqual(DelegationConfirmationStatus.Confirmed)
      }
      expect(await scopeNamesInDb()).toEqual([SENSITIVE_SCOPE, SENSITIVE_SCOPE])
      expect(notify).toHaveBeenCalledTimes(1)
      expect(notify.mock.calls[0][1]).toHaveLength(2)

      // Asking about the other one answers the same, without another step-up.
      expect((await status(ids[1])).body.status).toEqual('confirmed')
      expect(ciba.start).toHaveBeenCalledTimes(1)
    })

    it('confirms none of it if part of the grant changed after saving', async () => {
      // Arrange — the grant to the first recipient is saved again while the
      // step-up runs, superseding its confirmation.
      const ids = pendingIds(await grantToBoth())
      await grant([SENSITIVE_SCOPE])
      approvedBy(grantorNationalId)

      // Act
      const res = await status(ids[1])

      // Assert — the approval was for both; it confirms neither.
      expect(res.status).toEqual(403)
      expect(await scopeNamesInDb()).toEqual([])
      expect((await status(ids[0])).body.status).toEqual('expired')
      expect((await confirmations().findByPk(ids[1]))?.status).toEqual(
        DelegationConfirmationStatus.Expired,
      )
    })

    it('confirms none of it if any of it can no longer be given', async () => {
      // Arrange
      const ids = pendingIds(await grantToBoth())
      approvedBy(grantorNationalId)
      jest
        .spyOn(app.get(DelegationResourcesService), 'validateScopeAccess')
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false)

      // Act
      const res = await status(ids[0])

      // Assert
      expect(res.status).toEqual(403)
      expect(await scopeNamesInDb()).toEqual([])
      const rows = await confirmations().findAll({ where: { id: ids } })
      for (const row of rows) {
        expect(row.status).toEqual(DelegationConfirmationStatus.Expired)
      }
    })
  })
})
