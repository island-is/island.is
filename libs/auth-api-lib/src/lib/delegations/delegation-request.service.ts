import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { uuid } from 'uuidv4'
import kennitala from 'kennitala'

import { User } from '@island.is/auth-nest-tools'
import { RskRelationshipsClient } from '@island.is/clients-rsk-relationships'
import { Features } from '@island.is/feature-flags'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'
import { FeatureFlagService } from '@island.is/nest/feature-flags'

import { ApiScope } from '../resources/models/api-scope.model'
import { Domain } from '../resources/models/domain.model'
import { NotificationsApi } from '../user-notification'
import { DelegationRequestError } from './constants/delegation-request-errors'
import {
  DELEGATION_REQUEST_APPROVED_TEMPLATE_ID,
  DELEGATION_REQUEST_REJECTED_TEMPLATE_ID,
  DELEGATION_REQUEST_TEMPLATE_ID,
} from './constants/hnipp'
import { DelegationConfig } from './DelegationConfig'
import {
  CreateDelegationRequestDTO,
  DelegationRequestDTO,
} from './dto/delegation-request.dto'
import { DelegationRequestScope } from './models/delegation-request-scope.model'
import { DelegationRequest } from './models/delegation-request.model'
import { NamesService } from './names.service'
import { DelegationRequestStatus } from './types/delegationRequestStatus'

/** How long a pending request stays actionable before it auto-expires. */
const REQUEST_TTL_DAYS = 30

@Injectable()
export class DelegationRequestService {
  constructor(
    @InjectModel(DelegationRequest)
    private delegationRequestModel: typeof DelegationRequest,
    @InjectModel(DelegationRequestScope)
    private delegationRequestScopeModel: typeof DelegationRequestScope,
    @InjectModel(ApiScope)
    private apiScopeModel: typeof ApiScope,
    private namesService: NamesService,
    private rskRelationshipsClient: RskRelationshipsClient,
    private notificationsApi: NotificationsApi,
    private featureFlagService: FeatureFlagService,
    private sequelize: Sequelize,
    @Inject(DelegationConfig.KEY)
    private delegationConfig: ConfigType<typeof DelegationConfig>,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  /**
   * Create a delegation request. Only available when acting as yourself (the
   * individual view) — you request a delegation *from* another individual or a
   * company (whose procuration holders decide).
   */
  async createRequest(
    user: User,
    dto: CreateDelegationRequestDTO,
  ): Promise<DelegationRequestDTO> {
    // Requesting is only available in the individual view (§7.2.5).
    if (user.actor) {
      throw new ForbiddenException(
        'Delegation requests can only be made when acting as yourself.',
      )
    }

    const requesterNationalId = user.nationalId
    const granterNationalId = dto.toGranterNationalId

    if (!kennitala.isValid(granterNationalId)) {
      throw new BadRequestException('Invalid national id for the grantor.')
    }
    if (granterNationalId === requesterNationalId) {
      throw new BadRequestException('Cannot request a delegation from yourself.')
    }

    const isCompany = kennitala.isCompany(granterNationalId)

    // Validate the requested scopes exist and are explicitly delegatable.
    const scopeNames = [...new Set(dto.scopes.map((s) => s.scopeName))]
    const grantableScopes = await this.apiScopeModel.findAll({
      where: {
        name: { [Op.in]: scopeNames },
        enabled: true,
        allowExplicitDelegationGrant: true,
      },
    })
    if (grantableScopes.length !== scopeNames.length) {
      throw new BadRequestException(
        'One or more requested scopes do not exist or cannot be delegated.',
      )
    }

    // Guardrails against abuse, checked before the registry lookups: a
    // rejection-based lock, duplicate live requests, and a cap on how many
    // requests a single requester can have open at once.
    await this.assertNotRejectionBlocked(requesterNationalId)
    await this.assertNoDuplicatePending(
      granterNationalId,
      requesterNationalId,
      dto.domainName ?? null,
    )
    await this.assertUnderPendingCap(requesterNationalId)

    // Confirm the grantor exists (and, for individuals, is not deceased) and
    // resolve who should be notified.
    let recipients: string[]
    if (isCompany) {
      const legalEntity =
        await this.rskRelationshipsClient.getLegalEntityRelationships(
          user,
          granterNationalId,
        )
      if (!legalEntity) {
        throw new BadRequestException(
          'The requested company could not be found.',
        )
      }
      recipients = (legalEntity.relationships ?? [])
        .map((r) => r.nationalId)
        .filter((id): id is string => Boolean(id))
      if (recipients.length === 0) {
        throw new BadRequestException(
          'The requested company has no registered procuration holders to receive the request.',
        )
      }
    } else {
      await this.namesService.validateRecipientNotDeceased(granterNationalId)
      recipients = [granterNationalId]
    }

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + REQUEST_TTL_DAYS)

    const request = await this.sequelize.transaction(async (transaction) => {
      const created = await this.delegationRequestModel.create(
        {
          id: uuid(),
          fromNationalId: granterNationalId,
          toNationalId: requesterNationalId,
          domainName: dto.domainName ?? null,
          relationship: dto.relationship,
          reason: dto.reason,
          status: DelegationRequestStatus.Pending,
          createdByNationalId: requesterNationalId,
          expiresAt,
        },
        { transaction },
      )

      await this.delegationRequestScopeModel.bulkCreate(
        dto.scopes.map((scope) => ({
          id: uuid(),
          delegationRequestId: created.id,
          scopeName: scope.scopeName,
          validTo: scope.validTo ?? null,
        })),
        { transaction },
      )

      return created
    })

    const requesterName = await this.namesService.getUserName(user)
    void this.notifyNewRequest(user, recipients, requesterName, dto.relationship)

    return this.findById(user, request.id)
  }

  /** Requests the current user has sent (as prospective delegate). */
  async findAllOutgoing(user: User): Promise<DelegationRequestDTO[]> {
    await this.expireStale({ toNationalId: user.nationalId })
    const requests = await this.delegationRequestModel.findAll({
      where: { toNationalId: user.nationalId },
      include: [
        {
          model: DelegationRequestScope,
          include: [{ model: ApiScope, include: [Domain] }],
        },
      ],
      order: [['created', 'DESC']],
    })
    return requests.map((r) => r.toDTO())
  }

  /**
   * Requests addressed to the current subject as prospective grantor. When a
   * procuration holder is in company view, `user.nationalId` is the company id,
   * so this naturally returns that company's incoming requests.
   */
  async findAllIncoming(user: User): Promise<DelegationRequestDTO[]> {
    await this.expireStale({ fromNationalId: user.nationalId })
    const requests = await this.delegationRequestModel.findAll({
      where: { fromNationalId: user.nationalId },
      include: [
        {
          model: DelegationRequestScope,
          include: [{ model: ApiScope, include: [Domain] }],
        },
      ],
      order: [['created', 'DESC']],
    })
    return requests.map((r) => r.toDTO())
  }

  async findById(user: User, id: string): Promise<DelegationRequestDTO> {
    const request = await this.getParticipantRequest(user, id)
    return request.toDTO()
  }

  /** Grantor declines the request. */
  async reject(user: User, id: string): Promise<DelegationRequestDTO> {
    const request = await this.getGranterRequest(user, id)
    this.assertPending(request)

    await request.update({
      status: DelegationRequestStatus.Rejected,
      resolvedByNationalId: user.actor?.nationalId ?? user.nationalId,
    })

    const granterName = await this.namesService.getUserName(user)
    void this.notifyRequester(
      user,
      request.toNationalId,
      DELEGATION_REQUEST_REJECTED_TEMPLATE_ID,
      granterName,
    )

    return this.findById(user, id)
  }

  /** Requester withdraws their own request. */
  async cancel(user: User, id: string): Promise<DelegationRequestDTO> {
    const request = await this.delegationRequestModel.findByPk(id)
    if (!request || request.toNationalId !== user.nationalId) {
      throw new NotFoundException('Delegation request not found.')
    }
    this.assertPending(request)

    await request.update({ status: DelegationRequestStatus.Cancelled })
    return this.findById(user, id)
  }

  /**
   * Mark a request approved and link the delegation that fulfilled it. Called
   * after the grantor confirms the (pre-filled, editable) grant flow.
   */
  async markFulfilled(
    user: User,
    id: string,
    delegationId: string,
  ): Promise<DelegationRequestDTO> {
    const request = await this.getGranterRequest(user, id)
    this.assertPending(request)

    await request.update({
      status: DelegationRequestStatus.Approved,
      resolvedByNationalId: user.actor?.nationalId ?? user.nationalId,
      resolvedDelegationId: delegationId,
    })

    const granterName = await this.namesService.getUserName(user)
    void this.notifyRequester(
      user,
      request.toNationalId,
      DELEGATION_REQUEST_APPROVED_TEMPLATE_ID,
      granterName,
    )

    return this.findById(user, id)
  }

  private async getParticipantRequest(
    user: User,
    id: string,
  ): Promise<DelegationRequest> {
    const request = await this.delegationRequestModel.findByPk(id, {
      include: [
        {
          model: DelegationRequestScope,
          include: [{ model: ApiScope, include: [Domain] }],
        },
      ],
    })
    if (
      !request ||
      (request.fromNationalId !== user.nationalId &&
        request.toNationalId !== user.nationalId)
    ) {
      throw new NotFoundException('Delegation request not found.')
    }
    return request
  }

  private async getGranterRequest(
    user: User,
    id: string,
  ): Promise<DelegationRequest> {
    const request = await this.delegationRequestModel.findByPk(id, {
      include: [
        {
          model: DelegationRequestScope,
          include: [{ model: ApiScope, include: [Domain] }],
        },
      ],
    })
    // The grantor side is the current subject (an individual, or a company the
    // acting procuration holder is currently representing).
    if (!request || request.fromNationalId !== user.nationalId) {
      throw new NotFoundException('Delegation request not found.')
    }
    return request
  }

  private assertPending(request: DelegationRequest): void {
    if (request.status !== DelegationRequestStatus.Pending) {
      throw new BadRequestException(
        `Delegation request is not pending (status: ${request.status}).`,
      )
    }
  }

  private async assertNoDuplicatePending(
    fromNationalId: string,
    toNationalId: string,
    domainName: string | null,
  ): Promise<void> {
    const existing = await this.delegationRequestModel.findOne({
      where: {
        fromNationalId,
        toNationalId,
        domainName: domainName ?? { [Op.is]: null },
        status: DelegationRequestStatus.Pending,
      },
    })
    if (existing) {
      throw new BadRequestException(
        'A pending delegation request to this party already exists.',
      )
    }
  }

  private async assertUnderPendingCap(
    requesterNationalId: string,
  ): Promise<void> {
    const pendingCount = await this.delegationRequestModel.count({
      where: {
        toNationalId: requesterNationalId,
        status: DelegationRequestStatus.Pending,
      },
    })
    if (pendingCount >= this.delegationConfig.delegationRequestMaxPending) {
      throw new BadRequestException(DelegationRequestError.TooManyPending)
    }
  }

  /**
   * Requesters who collect too many rejections within the lock window are
   * blocked from creating new requests until rejections age out of it. A
   * rejection is the terminal write on its row, so `modified` is when it
   * happened.
   */
  private async assertNotRejectionBlocked(
    requesterNationalId: string,
  ): Promise<void> {
    const {
      delegationRequestRejectionLockThreshold: threshold,
      delegationRequestRejectionLockDays: lockDays,
    } = this.delegationConfig

    const windowStart = new Date()
    windowStart.setDate(windowStart.getDate() - lockDays)

    const rejectionCount = await this.delegationRequestModel.count({
      where: {
        toNationalId: requesterNationalId,
        status: DelegationRequestStatus.Rejected,
        modified: { [Op.gte]: windowStart },
      },
    })
    if (rejectionCount >= threshold) {
      throw new ForbiddenException(DelegationRequestError.Blocked)
    }
  }

  /** Flip any past-expiry pending requests to `expired` before listing. */
  private async expireStale(
    scope: { fromNationalId: string } | { toNationalId: string },
  ): Promise<void> {
    await this.delegationRequestModel.update(
      { status: DelegationRequestStatus.Expired },
      {
        where: {
          ...scope,
          status: DelegationRequestStatus.Pending,
          expiresAt: { [Op.lt]: new Date() },
        },
      },
    )
  }

  private async notifyNewRequest(
    user: User,
    recipients: string[],
    requesterName: string,
    relationship: string,
  ): Promise<void> {
    if (!(await this.notificationsEnabled(user))) {
      return
    }
    await Promise.all(
      recipients.map((recipient) =>
        this.sendNotification(recipient, DELEGATION_REQUEST_TEMPLATE_ID, [
          { key: 'name', value: requesterName },
          { key: 'relationship', value: relationship },
        ]),
      ),
    )
  }

  private async notifyRequester(
    user: User,
    recipient: string,
    templateId: string,
    granterName: string,
  ): Promise<void> {
    if (!(await this.notificationsEnabled(user))) {
      return
    }
    await this.sendNotification(recipient, templateId, [
      { key: 'name', value: granterName },
    ])
  }

  private async notificationsEnabled(user: User): Promise<boolean> {
    return this.featureFlagService.getValue(
      Features.isDelegationRequestNotificationEnabled,
      false,
      user,
    )
  }

  private async sendNotification(
    recipient: string,
    templateId: string,
    args: { key: string; value: string }[],
  ): Promise<void> {
    try {
      await this.notificationsApi.notificationsControllerCreateHnippNotification(
        {
          createHnippNotificationDto: { recipient, templateId, args },
        },
      )
    } catch (e) {
      // Do not log PII (recipient national id / names / reason).
      this.logger.error(
        `Failed to send delegation request notification (template: ${templateId})`,
      )
    }
  }
}
