import {
  BadRequestException,
  ForbiddenException,
  GoneException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { randomUUID } from 'crypto'
import addMinutes from 'date-fns/addMinutes'
import { Op, Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

import type { User } from '@island.is/auth-nest-tools'
import {
  CibaClient,
  type StepUpClaims,
  type StepUpMethod,
} from '@island.is/auth/step-up'
import type { ConfigType } from '@island.is/nest/config'
import { NoContentException } from '@island.is/nest/problem'
import { AuthDelegationType } from '@island.is/shared/types'

import { DelegationConfig } from '../delegations/DelegationConfig'
import { DelegationScopeService } from '../delegations/delegation-scope.service'
import { DelegationsIndexService } from '../delegations/delegations-index.service'
import { UpdateDelegationScopeDTO } from '../delegations/dto/delegation-scope.dto'
import { Delegation } from '../delegations/models/delegation.model'
import { DelegationDirection } from '../delegations/types/delegationDirection'
import { DelegationResourcesService } from '../resources/delegation-resources.service'
import { DelegationConfirmation } from './models/delegation-confirmation.model'
import type {
  ConfirmationContentSnapshot,
  ConfirmationScope,
} from './types/delegation-confirmation-content'
import { DelegationConfirmationStatus } from './types/delegation-confirmation-status'
import {
  CONTENT_HASH_ALG,
  hashConfirmationContent,
  hashConfirmationGroup,
} from './utils/content-hash'

export interface RequestConfirmationOptions {
  user: User
  delegation: Delegation
  scopes: UpdateDelegationScopeDTO[]
  /** Display names for the requested scopes, keyed by scope name. */
  scopeDisplayNames: Map<string, string>
  toName: string
  domainDisplayName?: string | null
  locale?: string
  /** Join an outer transaction so the request and the grant commit together. */
  transaction?: Transaction
}

export interface StartAuthenticationResult {
  method: StepUpMethod
  /** The code shown in the Auðkenni app, for the grantor to compare. */
  verificationCode?: string
  /** Seconds to wait between polls. */
  interval: number
  /** Seconds until the step-up gives up. */
  expiresIn: number
}

export type AuthenticationStatus =
  /** No step-up in progress: start one. */
  | 'not_started'
  /** Waiting for the grantor to approve on their phone. */
  | 'pending'
  /** Done: the scopes are granted. */
  | 'confirmed'
  /** The grantor declined, or someone else answered. Can be started again. */
  | 'denied'
  /** The step-up ran out of time. Can be started again. */
  | 'timed_out'
  /** The confirmation itself expired or was superseded. Grant again. */
  | 'expired'

export interface AuthenticationStatusResult {
  status: AuthenticationStatus
  confirmation: DelegationConfirmation
  /**
   * Set only on the call that completed it: every confirmation the one
   * authentication confirmed — this one, and the rest of its group — so the
   * caller can audit and notify exactly once however often the client polls.
   */
  completedNow?: DelegationConfirmation[]
}

/**
 * Owns the second half of "tvöfalt samþykki": the pending request for a
 * high-assurance confirmation, and the evidence record it becomes.
 *
 * Sensitive scopes are deliberately NOT written to `delegation_scope` while a
 * confirmation is pending. That is what makes an unconfirmed sensitive scope
 * unusable by construction — there is no row for a read path to leak.
 */
@Injectable()
export class DelegationConfirmationService {
  constructor(
    @InjectModel(DelegationConfirmation)
    private delegationConfirmationModel: typeof DelegationConfirmation,
    @InjectModel(Delegation)
    private delegationModel: typeof Delegation,
    private readonly delegationScopeService: DelegationScopeService,
    private readonly delegationsIndexService: DelegationsIndexService,
    private readonly sequelize: Sequelize,
    @Inject(DelegationConfig.KEY)
    private delegationConfig: ConfigType<typeof DelegationConfig>,
    private readonly cibaClient: CibaClient,
    private readonly delegationResourcesService: DelegationResourcesService,
  ) {}

  /**
   * Records a request to confirm a set of sensitive scopes, superseding any
   * pending request already covering the same grantor, recipient and domain.
   */
  async request({
    user,
    delegation,
    scopes,
    scopeDisplayNames,
    toName,
    domainDisplayName,
    locale = 'is',
    transaction: outerTransaction,
  }: RequestConfirmationOptions): Promise<DelegationConfirmation> {
    if (scopes.length === 0) {
      throw new BadRequestException(
        'Cannot request a confirmation without scopes.',
      )
    }

    const requestedAt = new Date()
    const confirmationScopes: ConfirmationScope[] = scopes
      .map((scope) => ({
        name: scope.name,
        displayName: scopeDisplayNames.get(scope.name) ?? scope.name,
        validTo: new Date(scope.validTo).toISOString(),
      }))
      // Sorted so the hash does not depend on the order the client sent.
      .sort((a, b) => a.name.localeCompare(b.name, 'en'))

    const contentSnapshot: ConfirmationContentSnapshot = {
      version: 1,
      fromNationalId: delegation.fromNationalId,
      toNationalId: delegation.toNationalId,
      toName,
      domainName: delegation.domainName ?? null,
      domainDisplayName: domainDisplayName ?? null,
      scopes: confirmationScopes,
      requestedAt: requestedAt.toISOString(),
      locale,
      bindingMessage: createBindingMessage(toName, confirmationScopes.length),
    }

    const run = async (transaction: Transaction) => {
      // Supersede rather than duplicate: the partial unique index allows only
      // one pending row per grantor/recipient/domain.
      await this.delegationConfirmationModel.update(
        { status: DelegationConfirmationStatus.Superseded },
        {
          where: {
            fromNationalId: delegation.fromNationalId,
            toNationalId: delegation.toNationalId,
            domainName: delegation.domainName ?? null,
            status: DelegationConfirmationStatus.Pending,
          },
          transaction,
        },
      )

      return this.delegationConfirmationModel.create(
        {
          delegationId: delegation.id,
          fromNationalId: delegation.fromNationalId,
          actorNationalId: user.actor?.nationalId ?? null,
          toNationalId: delegation.toNationalId,
          domainName: delegation.domainName ?? null,
          contentSnapshot,
          contentHash: hashConfirmationContent(contentSnapshot),
          contentHashAlg: CONTENT_HASH_ALG,
          requestedAcr: this.delegationConfig.confirmationRequiredAcr,
          expiresAt: addMinutes(
            requestedAt,
            this.delegationConfig.confirmationLifetimeInMinutes,
          ),
          receiptIssuer: this.delegationConfig.confirmationCibaIssuerUrl,
        },
        { transaction },
      )
    }

    return outerTransaction
      ? run(outerTransaction)
      : this.sequelize.transaction(run)
  }

  /**
   * Makes the confirmations one grant requested into a group that one
   * authentication confirms. Their phone message becomes one for the whole
   * group, and is re-hashed into each, so every row records what the phone
   * showed. Call in the grant's transaction, after requesting them all.
   */
  async group(
    confirmations: DelegationConfirmation[],
    transaction: Transaction,
  ): Promise<DelegationConfirmation[]> {
    if (confirmations.length < 2) {
      return confirmations
    }

    const groupId = randomUUID()
    const bindingMessage = createGroupBindingMessage(
      confirmations.map((confirmation) => ({
        nationalId: confirmation.toNationalId,
        name: confirmation.contentSnapshot.toName,
      })),
      confirmations.reduce(
        (count, confirmation) =>
          count + confirmation.contentSnapshot.scopes.length,
        0,
      ),
    )

    return Promise.all(
      confirmations.map((confirmation) => {
        const contentSnapshot = {
          ...confirmation.contentSnapshot,
          bindingMessage,
        }
        return confirmation.update(
          {
            groupId,
            contentSnapshot,
            contentHash: hashConfirmationContent(contentSnapshot),
          },
          { transaction },
        )
      }),
    )
  }

  /**
   * The confirmation and the rest of its group still waiting, in a fixed
   * order. One authentication confirms them all.
   */
  async findPendingGroup(
    confirmation: DelegationConfirmation,
  ): Promise<DelegationConfirmation[]> {
    if (!confirmation.groupId) {
      return [confirmation]
    }

    const now = Date.now()
    const members = await this.delegationConfirmationModel.findAll({
      where: {
        groupId: confirmation.groupId,
        fromNationalId: confirmation.fromNationalId,
        status: DelegationConfirmationStatus.Pending,
      },
      order: [['id', 'ASC']],
    })

    return members.filter((member) => member.expiresAt.getTime() > now)
  }

  /** Every confirmation in the group, whatever its status, for display. */
  async findGroupForUser(
    user: User,
    confirmation: DelegationConfirmation,
  ): Promise<DelegationConfirmation[]> {
    if (!confirmation.groupId) {
      return [confirmation]
    }

    return this.delegationConfirmationModel.findAll({
      where: {
        groupId: confirmation.groupId,
        fromNationalId: user.nationalId,
      },
      order: [['id', 'ASC']],
    })
  }

  /** Confirmations belonging to the current grantor. Never an oracle. */
  async findAllForUser(user: User): Promise<DelegationConfirmation[]> {
    return this.delegationConfirmationModel.findAll({
      where: { fromNationalId: user.nationalId },
      order: [['created', 'DESC']],
    })
  }

  async findByIdForUser(
    user: User,
    id: string,
  ): Promise<DelegationConfirmation> {
    const confirmation = await this.delegationConfirmationModel.findOne({
      where: { id, fromNationalId: user.nationalId },
    })

    if (!confirmation) {
      throw new NoContentException()
    }

    return confirmation
  }

  /**
   * The evidence record behind a completed confirmation, for the grantor's
   * receipt. Readable indefinitely — it deliberately outlives the delegation.
   */
  async findConfirmedForReceipt(
    user: User,
    id: string,
  ): Promise<DelegationConfirmation> {
    const confirmation = await this.findByIdForUser(user, id)

    if (confirmation.status !== DelegationConfirmationStatus.Confirmed) {
      throw new NoContentException()
    }

    return confirmation
  }

  /**
   * Starts the grantor's confirming authentication: a CIBA request to the
   * identity server, which asks Auðkenni to authenticate them on their phone
   * while they stay on the page.
   *
   * The person asked is taken from the confirmation row — the grantor, or for a
   * company the procuration holder who made the grant — never from the request.
   * How they are reached is the identity server's decision; we only tell it how
   * they logged in to this session. The message on the phone is the binding message in the
   * hashed snapshot.
   */
  async startAuthentication(
    user: User,
    id: string,
  ): Promise<StartAuthenticationResult> {
    const confirmation = await this.findByIdForUser(user, id)

    this.assertConfirmingUser(user, confirmation)
    await this.assertPending(confirmation)

    // The whole group is confirmed by this one authentication.
    const members = await this.findPendingGroup(confirmation)
    for (const member of members) {
      this.assertConfirmingUser(user, member)
    }
    const ids = members.map((member) => member.id)

    // Counted before anything goes out, with a conditional increment, so
    // concurrent starts can't slip past the cap.
    const [counted] = await this.delegationConfirmationModel.update(
      { authStartCount: Sequelize.literal('auth_start_count + 1') },
      {
        where: {
          id: ids,
          status: DelegationConfirmationStatus.Pending,
          authStartCount: {
            [Op.lt]: this.delegationConfig.confirmationMaxAuthStarts,
          },
        },
      },
    )
    if (counted !== ids.length) {
      throw new HttpException(
        'Too many authentication attempts for this confirmation.',
        HttpStatus.TOO_MANY_REQUESTS,
      )
    }

    // Recorded before the request goes out, so the authentication that comes
    // back can be required to be no older than this.
    const startedAt = new Date()

    // The identity server authenticates the person behind this token — the
    // actor when acting for a company — which assertConfirmingUser has just
    // checked is who this confirmation is for. It also reads from the token how
    // that session was logged in, which decides the method.
    const started = await this.cibaClient.start({
      userToken: user.authorization,
      bindingMessage: confirmation.contentSnapshot.bindingMessage,
      // Bound into what the grantor's key signs and echoed on the token, so the
      // approval can only complete this exact content — every confirmation in
      // the group, and no other.
      contextHash: hashConfirmationGroup(
        members.map((member) => member.contentHash),
      ),
    })

    await this.delegationConfirmationModel.update(
      {
        authReqId: started.authReqId,
        authMethod: started.method,
        authStartedAt: startedAt,
      },
      { where: { id: ids } },
    )

    const expiresAt = Math.min(
      ...members.map((member) => member.expiresAt.getTime()),
    )
    const secondsLeft = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))

    return {
      method: started.method,
      verificationCode: started.verificationCode,
      interval: started.interval,
      expiresIn: Math.min(started.expiresIn, secondsLeft),
    }
  }

  /**
   * Where the confirming authentication stands, moving it forward if the
   * grantor has answered. Polled by the client while the grantor approves on
   * their phone.
   *
   * Every assertion on the way to `confirmed` is deliberate. In particular the
   * person who authenticated must be the one the row names, and their
   * authentication must not predate the step-up, so an authentication made for
   * some other purpose can't be passed off as this one.
   */
  async getAuthenticationStatus(
    user: User,
    id: string,
  ): Promise<AuthenticationStatusResult> {
    const confirmation = await this.findByIdForUser(user, id)

    // Only the person who confirms may follow it. Not counted as an attempt:
    // reading is not trying.
    if (!this.isConfirmingUser(user, confirmation)) {
      throw new ForbiddenException(
        'This confirmation can only be followed by the delegation grantor.',
      )
    }

    if (confirmation.status === DelegationConfirmationStatus.Confirmed) {
      return { status: 'confirmed', confirmation }
    }

    if (
      confirmation.status !== DelegationConfirmationStatus.Pending ||
      confirmation.expiresAt.getTime() <= Date.now()
    ) {
      if (confirmation.status === DelegationConfirmationStatus.Pending) {
        await confirmation.update({
          status: DelegationConfirmationStatus.Expired,
          authReqId: null,
        })
      }
      return { status: 'expired', confirmation }
    }

    if (!confirmation.authReqId) {
      return { status: 'not_started', confirmation }
    }

    this.assertConfirmingUser(user, confirmation)

    const result = await this.cibaClient.poll(confirmation.authReqId)

    const authReqId = confirmation.authReqId
    const endStepUp = () =>
      this.delegationConfirmationModel.update(
        { authReqId: null },
        { where: { authReqId } },
      )

    switch (result.status) {
      case 'pending':
        return { status: 'pending', confirmation }
      case 'denied':
        // The grantor declined, or the identity server refused the person who
        // answered. The confirmations stay pending so they can try again.
        await endStepUp()
        return { status: 'denied', confirmation }
      case 'expired':
        await endStepUp()
        return { status: 'timed_out', confirmation }
    }

    // What this authentication was started for: the group as it stood then.
    // If any of it has since been superseded or expired, the hash won't match
    // and nothing is confirmed.
    const members = (await this.findPendingGroup(confirmation)).filter(
      (member) => member.authReqId === authReqId,
    )

    try {
      await this.assertStepUp(confirmation, members, result.claims)
    } catch (error) {
      await endStepUp()
      throw error
    }
    await this.complete(user, members, result.claims)
    await confirmation.reload()

    return { status: 'confirmed', confirmation, completedNow: members }
  }

  /**
   * Grants the held scopes and turns the rows into the evidence records, all in
   * one transaction: the whole group is confirmed, or none of it.
   */
  private async complete(
    user: User,
    confirmations: DelegationConfirmation[],
    claims: StepUpClaims,
  ): Promise<void> {
    const delegations = await Promise.all(
      confirmations.map(async (confirmation) => {
        // The content hash is recomputed rather than trusted, so a tampered
        // snapshot cannot pass.
        if (
          hashConfirmationContent(confirmation.contentSnapshot) !==
          confirmation.contentHash
        ) {
          throw new BadRequestException(
            'The stored confirmation content does not match its hash.',
          )
        }

        const delegation = confirmation.delegationId
          ? await this.delegationModel.findByPk(confirmation.delegationId)
          : null

        if (!delegation) {
          throw new BadRequestException(
            'The delegation this confirmation belongs to no longer exists.',
          )
        }

        // The one place a held scope becomes real, up to the confirmation's
        // lifetime after it was requested: check again that the grantor may
        // still give it.
        if (
          !(await this.delegationResourcesService.validateScopeAccess(
            user,
            delegation.domainName ?? null,
            DelegationDirection.OUTGOING,
            confirmation.scopes.map((scope) => scope.name),
          ))
        ) {
          throw new ForbiddenException(
            'The grantor no longer has access to the scopes being confirmed.',
          )
        }

        return delegation
      }),
    )

    await this.sequelize.transaction(async (transaction) => {
      for (const [index, confirmation] of confirmations.entries()) {
        // Single-use: a conditional update that either claims the row or loses
        // the race. No locking and no read-then-write window.
        const [affected] = await this.delegationConfirmationModel.update(
          {
            status: DelegationConfirmationStatus.Confirmed,
            confirmedAt: new Date(),
            confirmingNationalId: claims.nationalId,
            acr: claims.acr ?? null,
            amr: claims.amr,
            authTime: claims.authTime,
            confirmedSub: claims.sub,
            confirmedSid: null,
            confirmedClientId: user.client,
            confirmedIp: user.ip ?? null,
            confirmedUserAgent: user.userAgent ?? null,
            certificateThumbprint: claims.certificateThumbprint ?? null,
            authReqId: null,
          },
          {
            where: {
              id: confirmation.id,
              status: DelegationConfirmationStatus.Pending,
            },
            transaction,
          },
        )

        if (affected !== 1) {
          throw new BadRequestException(
            'Confirmation has already been completed.',
          )
        }

        await this.delegationScopeService.createOrUpdate(
          delegations[index].id,
          confirmation.scopes.map((scope) => ({
            name: scope.name,
            validTo: new Date(scope.validTo),
          })),
          transaction,
          { confirmationId: confirmation.id },
        )
      }
    })

    // Indexed after commit so the index never advertises a scope that rolled
    // back, matching the existing pattern in DelegationsOutgoingService.patch.
    for (const toNationalId of new Set(
      confirmations.map((confirmation) => confirmation.toNationalId),
    )) {
      void this.delegationsIndexService.indexCustomDelegations(
        toNationalId,
        user,
      )
    }

    await Promise.all(
      confirmations.map((confirmation) => confirmation.reload()),
    )
  }

  private async assertPending(
    confirmation: DelegationConfirmation,
  ): Promise<void> {
    if (confirmation.status !== DelegationConfirmationStatus.Pending) {
      throw new BadRequestException(
        `Confirmation is not pending (status: ${confirmation.status}).`,
      )
    }

    if (confirmation.expiresAt.getTime() <= Date.now()) {
      await confirmation.update({
        status: DelegationConfirmationStatus.Expired,
      })
      throw new GoneException('Confirmation has expired.')
    }
  }

  /**
   * The confirming person must be the grantor themselves. For a company grant
   * that means the recorded procuration holder acting for the company — the
   * identity server re-verifies procuration whenever it issues a token in
   * company context, so a token in that shape is itself the proof.
   */
  private isConfirmingUser(
    user: User,
    confirmation: DelegationConfirmation,
  ): boolean {
    return !(
      user.nationalId !== confirmation.fromNationalId ||
      (confirmation.actorNationalId
        ? user.actor?.nationalId !== confirmation.actorNationalId ||
          !user.delegationType?.includes(AuthDelegationType.ProcurationHolder)
        : // A personal grant must not be confirmed while acting for someone else.
          user.actor != null)
    )
  }

  private assertConfirmingUser(
    user: User,
    confirmation: DelegationConfirmation,
  ): void {
    if (!this.isConfirmingUser(user, confirmation)) {
      void this.delegationConfirmationModel.increment('attemptCount', {
        where: { id: confirmation.id },
      })

      if (
        confirmation.attemptCount + 1 >=
        this.delegationConfig.confirmationMaxAttempts
      ) {
        void this.delegationConfirmationModel.update(
          { status: DelegationConfirmationStatus.Expired },
          {
            where: {
              id: confirmation.id,
              status: DelegationConfirmationStatus.Pending,
            },
          },
        )
      }

      throw new ForbiddenException(
        'This confirmation can only be completed by the delegation grantor.',
      )
    }
  }

  /**
   * What must be true of the authentication the identity server vouches for.
   */
  private async assertStepUp(
    confirmation: DelegationConfirmation,
    members: DelegationConfirmation[],
    claims: StepUpClaims,
  ): Promise<void> {
    const expectedNationalId =
      confirmation.actorNationalId ?? confirmation.fromNationalId

    if (claims.nationalId !== expectedNationalId) {
      // The identity server already refuses an approval by the wrong person;
      // this is the same rule checked again on the token, where it matters.
      await confirmation.update({
        attemptCount: confirmation.attemptCount + 1,
      })
      throw new ForbiddenException(
        'This confirmation can only be completed by the delegation grantor.',
      )
    }

    // Development escape hatch: local fake login cannot assert a real assurance
    // level. Guarded on NODE_ENV in DelegationConfig, so it cannot be turned on
    // in a deployed environment.
    const acrSatisfied =
      claims.acr === confirmation.requestedAcr ||
      this.delegationConfig.confirmationAllowAnyAcrInDev

    if (!acrSatisfied) {
      throw new ForbiddenException(
        `Insufficient authentication: ${confirmation.requestedAcr} is required.`,
      )
    }

    // What the grantor's key signed was bound to this content — every
    // confirmation in the group — and the token says so. Anything else was
    // approved for something else.
    if (
      members.length === 0 ||
      claims.contextHash !==
        hashConfirmationGroup(members.map((member) => member.contentHash))
    ) {
      throw new ForbiddenException(
        'The authentication was not made for this confirmation.',
      )
    }

    // auth_time has one-second resolution, so compare whole seconds.
    const startedAtSeconds = Math.floor(
      (confirmation.authStartedAt?.getTime() ?? Infinity) / 1000,
    )
    if (claims.authTime.getTime() / 1000 < startedAtSeconds) {
      throw new ForbiddenException(
        'Insufficient authentication: the authentication predates this confirmation.',
      )
    }
  }

  /**
   * Marks elapsed pending confirmations as expired. Never touches confirmed
   * rows — those are evidence and outlive the delegation.
   */
  async expirePending(): Promise<number> {
    const [affected] = await this.delegationConfirmationModel.update(
      { status: DelegationConfirmationStatus.Expired },
      {
        where: {
          status: DelegationConfirmationStatus.Pending,
          expiresAt: { [Op.lt]: new Date() },
        },
      },
    )

    return affected
  }
}

/**
 * The text shown in the Auðkenni app. Kept short — SIM sends it as an SMS, and
 * the identity server refuses anything over 120 characters — and in a fixed
 * form, since it is part of the hashed snapshot.
 */
export const createBindingMessage = (toName: string, scopeCount: number) => {
  const permissions = scopeCount === 1 ? '1 heimild' : `${scopeCount} heimildir`
  const suffix = ` · ${permissions}`
  const prefix = 'Umboð til '
  const maxName = 100 - prefix.length - suffix.length
  const name =
    toName.length > maxName ? `${toName.slice(0, maxName - 1)}…` : toName

  return `${prefix}${name}${suffix}`
}

/**
 * The text shown when one authentication confirms a whole grant: the
 * recipient's name if there is one, else how many there are. Counted by
 * national id: two people may share a name.
 */
export const createGroupBindingMessage = (
  recipients: { nationalId: string; name: string }[],
  scopeCount: number,
) => {
  const nationalIds = new Set(recipients.map((r) => r.nationalId))
  return createBindingMessage(
    nationalIds.size === 1 ? recipients[0].name : `${nationalIds.size} aðila`,
    scopeCount,
  )
}
