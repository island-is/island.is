import {
  BadRequestException,
  ForbiddenException,
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
  StepUpTokenRejectedError,
  type CibaPollResult,
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

/** The acr the IDS gives a step-up completed by a fake login. */
const FAKE_LOGIN_ACR = '0'

export interface RequestConfirmationOptions {
  user: User
  delegation: Delegation
  scopes: UpdateDelegationScopeDTO[]
  scopeDisplayNames: Map<string, string>
  toName: string
  domainDisplayName?: string | null
  locale?: string
  transaction?: Transaction
}

export interface StartAuthenticationResult {
  method: StepUpMethod
  verificationCode?: string
  interval: number
  expiresIn: number
}

export type AuthenticationStatus =
  | 'pending'
  | 'confirmed'
  | 'denied'
  | 'timed_out'
  | 'expired'

export interface CompletedConfirmation {
  confirmation: DelegationConfirmation
  hadExistingScopes: boolean
}

export interface AuthenticationStatusResult {
  status: AuthenticationStatus
  confirmation: DelegationConfirmation
  completedNow?: CompletedConfirmation[]
}

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
      // Sorted so the hash doesn't depend on the order the client sent.
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
      // The partial unique index allows one pending row per grantor/recipient/domain.
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

  private async end(authReqId: string): Promise<void> {
    await this.sequelize.transaction(async (transaction) => {
      const ended = await this.delegationConfirmationModel.findAll({
        attributes: ['id', 'delegationId'],
        where: { authReqId, status: DelegationConfirmationStatus.Pending },
        transaction,
      })
      if (ended.length === 0) {
        return
      }

      await this.delegationConfirmationModel.update(
        { status: DelegationConfirmationStatus.Expired, authReqId: null },
        {
          where: {
            id: ended.map((confirmation) => confirmation.id),
            status: DelegationConfirmationStatus.Pending,
          },
          transaction,
        },
      )

      await this.removeEmptyDelegations(
        ended.map((confirmation) => confirmation.delegationId),
        transaction,
      )
    })
  }

  private async removeEmptyDelegations(
    delegationIds: Array<string | null | undefined>,
    transaction?: Transaction,
  ): Promise<void> {
    const ids = new Set(delegationIds.filter((id): id is string => Boolean(id)))
    for (const id of ids) {
      const [scopes, waiting] = await Promise.all([
        this.delegationScopeService.findByDelegationId(id, transaction),
        this.delegationConfirmationModel.count({
          where: {
            delegationId: id,
            status: DelegationConfirmationStatus.Pending,
          },
          transaction,
        }),
      ])
      if (scopes.length === 0 && waiting === 0) {
        await this.delegationModel.destroy({ where: { id }, transaction })
      }
    }
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

  /** Runs inside the save's transaction, so a step-up that can't start rolls the save back. */
  async startAuthentication(
    user: User,
    confirmations: DelegationConfirmation[],
    transaction: Transaction,
  ): Promise<StartAuthenticationResult | undefined> {
    if (confirmations.length === 0) {
      return undefined
    }

    for (const confirmation of confirmations) {
      if (!this.isConfirmingUser(user, confirmation)) {
        throw new ForbiddenException(
          'This grant can only be confirmed by the grantor themselves.',
        )
      }
    }

    // Before the request goes out, so auth_time can be required to be newer.
    const startedAt = new Date()

    const started = await this.cibaClient.start({
      userToken: user.authorization,
      bindingMessage: confirmations[0].contentSnapshot.bindingMessage,
      contextHash: hashConfirmationGroup(
        confirmations.map((confirmation) => confirmation.contentHash),
      ),
    })

    await this.delegationConfirmationModel.update(
      {
        authReqId: started.authReqId,
        authMethod: started.method,
        authStartedAt: startedAt,
      },
      {
        where: { id: confirmations.map((confirmation) => confirmation.id) },
        transaction,
      },
    )

    const expiresAt = Math.min(
      ...confirmations.map((confirmation) => confirmation.expiresAt.getTime()),
    )
    const secondsLeft = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))

    return {
      method: started.method,
      verificationCode: started.verificationCode,
      interval: started.interval,
      expiresIn: Math.min(started.expiresIn, secondsLeft),
    }
  }

  async getAuthenticationStatus(
    user: User,
    id: string,
  ): Promise<AuthenticationStatusResult> {
    const confirmation = await this.findByIdForUser(user, id)

    if (!this.isConfirmingUser(user, confirmation)) {
      throw new ForbiddenException(
        'This confirmation can only be followed by the delegation grantor.',
      )
    }

    if (confirmation.status === DelegationConfirmationStatus.Confirmed) {
      return { status: 'confirmed', confirmation }
    }

    const authReqId = confirmation.authReqId
    if (
      confirmation.status !== DelegationConfirmationStatus.Pending ||
      !authReqId
    ) {
      return { status: 'expired', confirmation }
    }

    if (confirmation.expiresAt.getTime() <= Date.now()) {
      await this.end(authReqId)
      return { status: 'expired', confirmation }
    }

    let result: CibaPollResult
    try {
      result = await this.cibaClient.poll(authReqId)
    } catch (error) {
      // The token can't be collected twice, so a rejected one ends it; an outage doesn't.
      if (error instanceof StepUpTokenRejectedError) {
        await this.end(authReqId)
      }
      throw error
    }

    switch (result.status) {
      case 'pending':
        return { status: 'pending', confirmation }
      case 'denied':
        await this.end(authReqId)
        return { status: 'denied', confirmation }
      case 'expired':
        // Not ended: a concurrent poll that just collected the token gets the same answer and may be completing it.
        return { status: 'timed_out', confirmation }
    }

    const members = (await this.findPendingGroup(confirmation)).filter(
      (member) => member.authReqId === authReqId,
    )

    let completedNow: CompletedConfirmation[]
    try {
      this.assertStepUp(confirmation, members, result.claims)
      completedNow = await this.complete(user, members, result.claims)
    } catch (error) {
      await this.end(authReqId)
      throw error
    }
    await confirmation.reload()

    return { status: 'confirmed', confirmation, completedNow }
  }

  private async complete(
    user: User,
    confirmations: DelegationConfirmation[],
    claims: StepUpClaims,
  ): Promise<CompletedConfirmation[]> {
    const delegations = await Promise.all(
      confirmations.map(async (confirmation) => {
        // Recomputed rather than trusted, so a tampered snapshot can't pass.
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

        // Access may have changed since the grant was saved.
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

    const completed = await this.sequelize.transaction(async (transaction) => {
      const results: CompletedConfirmation[] = []
      for (const [index, confirmation] of confirmations.entries()) {
        // Conditional update, so a concurrent poll can't complete it twice.
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

        const hadExistingScopes =
          (
            await this.delegationScopeService.findByDelegationId(
              delegations[index].id,
              transaction,
            )
          ).length > 0

        await this.delegationScopeService.createOrUpdate(
          delegations[index].id,
          confirmation.scopes.map((scope) => ({
            name: scope.name,
            validTo: new Date(scope.validTo),
          })),
          transaction,
          { confirmationId: confirmation.id },
        )

        results.push({ confirmation, hadExistingScopes })
      }
      return results
    })

    // After commit, so the index never advertises a scope that rolled back.
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

    return completed
  }

  /** For a company grant, the IDS re-verifies procuration when issuing the token. */
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

  private assertStepUp(
    confirmation: DelegationConfirmation,
    members: DelegationConfirmation[],
    claims: StepUpClaims,
  ): void {
    const expectedNationalId =
      confirmation.actorNationalId ?? confirmation.fromNationalId

    if (claims.nationalId !== expectedNationalId) {
      throw new ForbiddenException(
        'This confirmation can only be completed by the delegation grantor.',
      )
    }

    const acrSatisfied =
      claims.acr === confirmation.requestedAcr ||
      (this.delegationConfig.confirmationAllowFakeLogin &&
        claims.acr === FAKE_LOGIN_ACR)

    if (!acrSatisfied) {
      throw new ForbiddenException(
        `Insufficient authentication: ${confirmation.requestedAcr} is required.`,
      )
    }

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

  async expirePending(): Promise<number> {
    const elapsed = await this.delegationConfirmationModel.findAll({
      attributes: ['id', 'delegationId'],
      where: {
        status: DelegationConfirmationStatus.Pending,
        expiresAt: { [Op.lt]: new Date() },
      },
    })
    if (elapsed.length === 0) {
      return 0
    }

    const [affected] = await this.delegationConfirmationModel.update(
      { status: DelegationConfirmationStatus.Expired },
      {
        where: {
          id: elapsed.map((confirmation) => confirmation.id),
          status: DelegationConfirmationStatus.Pending,
        },
      },
    )
    await this.removeEmptyDelegations(
      elapsed.map((confirmation) => confirmation.delegationId),
    )

    return affected
  }
}

/** SIM sends it as an SMS and the IDS refuses over 120 characters. */
export const createBindingMessage = (toName: string, scopeCount: number) => {
  const permissions = scopeCount === 1 ? '1 heimild' : `${scopeCount} heimildir`
  const suffix = ` · ${permissions}`
  const prefix = 'Umboð til '
  const maxName = 100 - prefix.length - suffix.length
  const name =
    toName.length > maxName ? `${toName.slice(0, maxName - 1)}…` : toName

  return `${prefix}${name}${suffix}`
}

/** Counted by national id, since two people may share a name. */
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
