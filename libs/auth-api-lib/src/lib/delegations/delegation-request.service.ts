import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import {
  and,
  Op,
  Transaction,
  UniqueConstraintError,
  WhereOptions,
} from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { uuid } from 'uuidv4'
import kennitala from 'kennitala'

import { User } from '@island.is/auth-nest-tools'
import { Features } from '@island.is/feature-flags'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'
import { FeatureFlagService } from '@island.is/nest/feature-flags'
import { AuthDelegationType } from '@island.is/shared/types'

import { ApiScope } from '../resources/models/api-scope.model'
import { Domain } from '../resources/models/domain.model'
import { DelegationResourcesService } from '../resources/delegation-resources.service'
import { DelegationDirection } from './types/delegationDirection'
import { DelegationsOutgoingService } from './delegations-outgoing.service'
import { NotificationsApi } from '../user-notification'
import { DelegationRequestError } from './constants/delegation-request-errors'
import {
  DELEGATION_REQUEST_REJECTED_TEMPLATE_ID,
  DELEGATION_REQUEST_TEMPLATE_ID,
} from './constants/hnipp'
import { DelegationConfig } from './DelegationConfig'
import {
  ApproveDelegationRequestDTO,
  CreateDelegationRequestDTO,
  DelegationRequestDTO,
  DelegationRequestEligibilityDTO,
} from './dto/delegation-request.dto'
import { DelegationRequestDelegation } from './models/delegation-request-delegation.model'
import { DelegationRequestScope } from './models/delegation-request-scope.model'
import { DelegationRequestConfirmation } from './models/delegation-request-confirmation.model'
import { DelegationConfirmation } from '../delegation-confirmation/models/delegation-confirmation.model'
import { DelegationConfirmationService } from '../delegation-confirmation/delegation-confirmation.service'
import { DelegationConfirmationStatus } from '../delegation-confirmation/types/delegation-confirmation-status'
import { DelegationRequest } from './models/delegation-request.model'
import { NamesService } from './names.service'
import { DelegationRequestStatus } from './types/delegationRequestStatus'

const REQUEST_TTL_DAYS = 30
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000

@Injectable()
export class DelegationRequestService {
  constructor(
    @InjectModel(DelegationRequest)
    private delegationRequestModel: typeof DelegationRequest,
    @InjectModel(DelegationRequestScope)
    private delegationRequestScopeModel: typeof DelegationRequestScope,
    @InjectModel(ApiScope)
    private apiScopeModel: typeof ApiScope,
    @InjectModel(DelegationRequestDelegation)
    private delegationRequestDelegationModel: typeof DelegationRequestDelegation,
    @InjectModel(DelegationRequestConfirmation)
    private delegationRequestConfirmationModel: typeof DelegationRequestConfirmation,
    @InjectModel(DelegationConfirmation)
    private delegationConfirmationModel: typeof DelegationConfirmation,
    private namesService: NamesService,
    private delegationResourceService: DelegationResourcesService,
    private delegationsOutgoingService: DelegationsOutgoingService,
    private delegationConfirmationService: DelegationConfirmationService,
    private notificationsApi: NotificationsApi,
    private featureFlagService: FeatureFlagService,
    private sequelize: Sequelize,
    @Inject(DelegationConfig.KEY)
    private delegationConfig: ConfigType<typeof DelegationConfig>,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  private readonly confirmationsInclude = {
    model: DelegationRequestConfirmation,
    include: [
      {
        model: DelegationConfirmation,
        attributes: ['id', 'status', 'expiresAt', 'confirmingNationalId'],
      },
    ],
  }

  private readonly requestIncludes = [
    {
      model: DelegationRequestScope,
      include: [{ model: ApiScope, include: [Domain] }],
    },
    { model: DelegationRequestDelegation },
    this.confirmationsInclude,
  ]

  async createRequest(
    user: User,
    dto: CreateDelegationRequestDTO,
  ): Promise<DelegationRequestDTO> {
    this.assertActingAsSelf(user)

    const requesterNationalId = user.nationalId
    const granterNationalId = this.toGranterNationalId(dto.toGranterNationalId)

    if (granterNationalId === requesterNationalId) {
      throw new BadRequestException(
        'Cannot request a delegation from yourself.',
      )
    }

    const isCompany = kennitala.isCompany(granterNationalId)

    const requestedScopes = [
      ...new Map(dto.scopes.map((s) => [s.scopeName, s])).values(),
    ]
    const scopeNames = requestedScopes.map((s) => s.scopeName)
    const grantableScopes = await this.apiScopeModel.findAll({
      where: and(
        { name: { [Op.in]: scopeNames } },
        ...(await this.delegationResourceService.apiScopeFilter({
          user,
          direction: DelegationDirection.REQUEST,
          requestGrantorType: isCompany ? 'company' : 'individual',
        })),
      ),
    })
    if (grantableScopes.length !== scopeNames.length) {
      throw new BadRequestException(
        'One or more requested scopes do not exist or cannot be granted by this grantor.',
      )
    }

    if (!isCompany) {
      await this.namesService.validateRecipientNotDeceased(granterNationalId)
    }

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + REQUEST_TTL_DAYS)

    const request = await this.sequelize
      .transaction(async (transaction) => {
        // Serializes a requester's submissions so concurrent ones can't slip past the limits.
        await this.sequelize.query(
          'SELECT pg_advisory_xact_lock(hashtext(:key))',
          {
            replacements: { key: `delegation-request:${requesterNationalId}` },
            transaction,
          },
        )

        await this.refreshStatuses(
          await this.findPendingSent(requesterNationalId, transaction),
          transaction,
        )
        const limit = await this.findLimitReached(
          requesterNationalId,
          granterNationalId,
          transaction,
        )
        if (limit === DelegationRequestError.Blocked) {
          throw new ForbiddenException(limit)
        }
        if (limit) {
          throw new BadRequestException(limit)
        }

        const created = await this.delegationRequestModel.create(
          {
            id: uuid(),
            fromNationalId: granterNationalId,
            toNationalId: requesterNationalId,
            relationship: dto.relationship,
            reason: dto.reason,
            status: DelegationRequestStatus.Pending,
            createdByNationalId: requesterNationalId,
            expiresAt,
          },
          { transaction },
        )

        await this.delegationRequestScopeModel.bulkCreate(
          requestedScopes.map((scope) => ({
            id: uuid(),
            delegationRequestId: created.id,
            scopeName: scope.scopeName,
            validTo: scope.validTo ?? null,
          })),
          { transaction },
        )

        return created
      })
      .catch((error) => {
        if (error instanceof UniqueConstraintError) {
          throw new BadRequestException(DelegationRequestError.DuplicatePending)
        }
        throw error
      })

    void this.notifyNewRequest(
      user,
      granterNationalId,
      dto.relationship,
      grantableScopes.map((s) => s.domainName),
    )

    return this.findById(user, request.id)
  }

  async checkEligibility(
    user: User,
    granterNationalId?: string,
  ): Promise<DelegationRequestEligibilityDTO> {
    this.assertActingAsSelf(user)
    await this.refreshStatuses(await this.findPendingSent(user.nationalId))
    const reason = await this.findLimitReached(
      user.nationalId,
      granterNationalId
        ? this.toGranterNationalId(granterNationalId)
        : undefined,
    )
    return { canRequest: !reason, reason }
  }

  // Requests are sent and managed by the requester themselves, never by someone acting for them.
  async findAllOutgoing(user: User): Promise<DelegationRequestDTO[]> {
    if (user.actor) {
      return []
    }
    return this.findAllWhere({ toNationalId: user.nationalId })
  }

  async findAllIncoming(user: User): Promise<DelegationRequestDTO[]> {
    if (!this.canHandleAsGrantor(user)) {
      return []
    }
    return this.findAllWhere({ fromNationalId: user.nationalId })
  }

  async findById(user: User, id: string): Promise<DelegationRequestDTO> {
    const request = await this.findRequest(
      id,
      (r) =>
        this.isGrantorOf(user, r) ||
        (!user.actor && r.toNationalId === user.nationalId),
    )
    return request.toDTO()
  }

  async reject(user: User, id: string): Promise<DelegationRequestDTO> {
    const request = await this.getGranterRequest(user, id)
    this.assertPending(request)
    await this.assertCanGrantRequestedScopes(user, request)

    await this.resolvePending(
      id,
      (r) => this.isGrantorOf(user, r),
      (locked, transaction) =>
        locked.update(
          {
            status: DelegationRequestStatus.Rejected,
            resolvedByNationalId: user.actor?.nationalId ?? user.nationalId,
          },
          { transaction },
        ),
    )

    void this.notifyRequester(
      user,
      request.toNationalId,
      DELEGATION_REQUEST_REJECTED_TEMPLATE_ID,
      request.requestScopes?.map((s) => s.apiScope?.domainName) ?? [],
    )

    return this.findById(user, id)
  }

  async cancel(user: User, id: string): Promise<DelegationRequestDTO> {
    this.assertActingAsSelf(user)
    await this.resolvePending(
      id,
      (r) => r.toNationalId === user.nationalId,
      (locked, transaction) =>
        locked.update(
          { status: DelegationRequestStatus.Cancelled },
          { transaction },
        ),
    )
    return this.findById(user, id)
  }

  async approve(
    user: User,
    id: string,
    dto: ApproveDelegationRequestDTO,
  ): Promise<DelegationRequestDTO> {
    const request = await this.getGranterRequest(user, id)
    this.assertPending(request)

    const requestedDomains = new Map(
      (request.requestScopes ?? []).map((scope) => [
        scope.scopeName,
        scope.apiScope?.domainName,
      ]),
    )
    const scopes = [
      ...new Map(dto.scopes.map((scope) => [scope.name, scope])).values(),
    ]
    if (scopes.some((scope) => !requestedDomains.get(scope.name))) {
      throw new BadRequestException('Only requested scopes can be approved.')
    }

    const scopesByDomain = new Map<string, typeof scopes>()
    for (const scope of scopes) {
      const domainName = requestedDomains.get(scope.name) as string
      scopesByDomain.set(domainName, [
        ...(scopesByDomain.get(domainName) ?? []),
        scope,
      ])
    }
    const batch = await this.delegationsOutgoingService.prepareBatch(
      user,
      [...scopesByDomain].map(([domainName, scopes]) => ({
        toNationalId: request.toNationalId,
        domainName,
        scopes,
      })),
    )

    const pendingConfirmations = await this.resolvePending(
      id,
      (r) => this.isGrantorOf(user, r),
      async (locked, transaction) => {
        const { delegationIds, pendingConfirmations } =
          await this.delegationsOutgoingService.createBatchInTransaction(
            user,
            batch,
            transaction,
          )

        if (pendingConfirmations.length > 0) {
          await this.delegationRequestConfirmationModel.bulkCreate(
            pendingConfirmations.map((confirmation) => ({
              id: uuid(),
              delegationRequestId: id,
              delegationConfirmationId: confirmation.id,
            })),
            { transaction },
          )
        } else {
          await locked.update(
            {
              status: DelegationRequestStatus.Approved,
              resolvedByNationalId: user.actor?.nationalId ?? user.nationalId,
            },
            { transaction },
          )
        }
        await this.delegationRequestDelegationModel.bulkCreate(
          delegationIds.map((delegationId) => ({
            id: uuid(),
            delegationRequestId: id,
            delegationId,
          })),
          { transaction, ignoreDuplicates: true },
        )

        return pendingConfirmations
      },
    )

    const result = await this.findById(user, id)
    return pendingConfirmations.length > 0
      ? { ...result, pendingConfirmations }
      : result
  }

  private async findAllWhere(
    where: WhereOptions<DelegationRequest>,
  ): Promise<DelegationRequestDTO[]> {
    const requests = await this.delegationRequestModel.findAll({
      where,
      include: this.requestIncludes,
      order: [['created', 'DESC']],
    })
    await this.refreshStatuses(requests)
    return requests.map((r) => r.toDTO())
  }

  private async findRequest(
    id: string,
    isAllowed: (request: DelegationRequest) => boolean,
  ): Promise<DelegationRequest> {
    const request = await this.delegationRequestModel.findByPk(id, {
      include: this.requestIncludes,
    })
    if (!request || !isAllowed(request)) {
      throw new NotFoundException('Delegation request not found.')
    }
    await this.refreshStatuses([request])
    return request
  }

  // In company view user.nationalId is the company.
  private getGranterRequest(
    user: User,
    id: string,
  ): Promise<DelegationRequest> {
    return this.findRequest(id, (r) => this.isGrantorOf(user, r))
  }

  private isGrantorOf(user: User, request: DelegationRequest): boolean {
    return (
      request.fromNationalId === user.nationalId &&
      this.canHandleAsGrantor(user)
    )
  }

  // Same rule as managing delegations: someone acting for a person may only do so as their legal representative.
  private canHandleAsGrantor(user: User): boolean {
    return (
      !user.actor ||
      kennitala.isCompany(user.nationalId) ||
      Boolean(
        user.delegationType?.includes(AuthDelegationType.LegalRepresentative),
      )
    )
  }

  /**
   * Runs `resolve` on the locked request once its held grant is released.
   * If the grantor confirmed the held grant meanwhile, the request is approved instead.
   */
  private async resolvePending<T>(
    id: string,
    isAllowed: (request: DelegationRequest) => boolean,
    resolve: (
      locked: DelegationRequest,
      transaction: Transaction,
    ) => Promise<T>,
  ): Promise<T> {
    const outcome = await this.sequelize.transaction(async (transaction) => {
      const locked = await this.delegationRequestModel.findByPk(id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      })
      if (!locked || !isAllowed(locked)) {
        throw new NotFoundException('Delegation request not found.')
      }
      const links =
        locked.status === DelegationRequestStatus.Pending
          ? await this.delegationRequestConfirmationModel.findAll({
              attributes: ['delegationConfirmationId'],
              where: { delegationRequestId: id },
              transaction,
            })
          : []
      // Locked so a confirmation completing right now either finishes first or is superseded.
      const confirmations = links.length
        ? await this.delegationConfirmationModel.findAll({
            attributes: ['id', 'status', 'confirmingNationalId'],
            where: { id: links.map((link) => link.delegationConfirmationId) },
            transaction,
            lock: transaction.LOCK.UPDATE,
          })
        : []
      const confirmed = confirmations.find(
        (c) => c.status === DelegationConfirmationStatus.Confirmed,
      )
      if (confirmed) {
        await this.markApproved(locked, confirmed, transaction)
        return { settled: true as const }
      }
      this.assertPending(locked)

      await this.delegationConfirmationService.supersede(
        confirmations.map((c) => c.id),
        transaction,
      )

      return {
        settled: false as const,
        result: await resolve(locked, transaction),
      }
    })

    if (outcome.settled) {
      throw new BadRequestException(
        `Delegation request is not pending (status: ${DelegationRequestStatus.Approved}).`,
      )
    }
    return outcome.result
  }

  private toGranterNationalId(value: string): string {
    const nationalId = kennitala.sanitize(value)
    if (!nationalId || !kennitala.isValid(nationalId)) {
      throw new BadRequestException('Invalid national id for the grantor.')
    }
    return nationalId
  }

  private assertActingAsSelf(user: User): void {
    if (user.actor) {
      throw new ForbiddenException(
        'Delegation requests can only be made when acting as yourself.',
      )
    }
  }

  private assertPending(request: DelegationRequest): void {
    if (request.status !== DelegationRequestStatus.Pending) {
      throw new BadRequestException(
        `Delegation request is not pending (status: ${request.status}).`,
      )
    }
    if (request.expiresAt < new Date()) {
      throw new BadRequestException('Delegation request has expired.')
    }
  }

  private async assertCanGrantRequestedScopes(
    user: User,
    request: DelegationRequest,
  ): Promise<void> {
    // Someone acting for the grantor can only decline what they could have granted.
    if (!user.actor) {
      return
    }
    const scopesByDomain = new Map<string, string[]>()
    for (const scope of request.requestScopes ?? []) {
      const domainName = scope.apiScope?.domainName
      if (domainName) {
        scopesByDomain.set(domainName, [
          ...(scopesByDomain.get(domainName) ?? []),
          scope.scopeName,
        ])
      }
    }
    for (const [domainName, scopeNames] of scopesByDomain) {
      const canGrant = await this.delegationResourceService.validateScopeAccess(
        user,
        domainName,
        DelegationDirection.OUTGOING,
        scopeNames,
      )
      if (!canGrant) {
        throw new ForbiddenException(
          'You do not have access to the requested scopes.',
        )
      }
    }
  }

  private findPendingSent(
    requesterNationalId: string,
    transaction?: Transaction,
  ): Promise<DelegationRequest[]> {
    return this.delegationRequestModel.findAll({
      where: {
        toNationalId: requesterNationalId,
        status: DelegationRequestStatus.Pending,
      },
      include: [this.confirmationsInclude],
      transaction,
    })
  }

  /** The first limit that stops a new request, checking the grantor-specific ones only when a grantor is given. */
  private async findLimitReached(
    requesterNationalId: string,
    granterNationalId: string | undefined,
    transaction?: Transaction,
  ): Promise<DelegationRequestError | undefined> {
    const {
      delegationRequestRejectionLockThreshold,
      delegationRequestRejectionLockDays,
      delegationRequestMaxPerDay,
      delegationRequestMaxPerGrantorPerDay,
      delegationRequestMaxPending,
    } = this.delegationConfig
    const sentBy = { toNationalId: requesterNationalId }
    const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS)

    const lockWindowStart = new Date()
    lockWindowStart.setDate(
      lockWindowStart.getDate() - delegationRequestRejectionLockDays,
    )
    // A rejection is the terminal write on its row, so `modified` is when it happened.
    const rejections = await this.delegationRequestModel.count({
      where: {
        ...sentBy,
        status: DelegationRequestStatus.Rejected,
        modified: { [Op.gte]: lockWindowStart },
      },
      transaction,
    })
    if (rejections >= delegationRequestRejectionLockThreshold) {
      return DelegationRequestError.Blocked
    }

    if (granterNationalId) {
      const toGranter = { ...sentBy, fromNationalId: granterNationalId }
      const pendingToGranter = await this.delegationRequestModel.findOne({
        attributes: ['id'],
        where: { ...toGranter, status: DelegationRequestStatus.Pending },
        transaction,
      })
      if (pendingToGranter) {
        return DelegationRequestError.DuplicatePending
      }
      // A cancelled request may be corrected and resent; the daily total still counts it.
      const sentToGranter = await this.delegationRequestModel.count({
        where: {
          ...toGranter,
          created: { [Op.gte]: since },
          status: { [Op.ne]: DelegationRequestStatus.Cancelled },
        },
        transaction,
      })
      if (sentToGranter >= delegationRequestMaxPerGrantorPerDay) {
        return DelegationRequestError.GrantorRateLimited
      }
    }

    const [sentToday, pending] = await Promise.all([
      this.delegationRequestModel.count({
        where: { ...sentBy, created: { [Op.gte]: since } },
        transaction,
      }),
      this.delegationRequestModel.count({
        where: { ...sentBy, status: DelegationRequestStatus.Pending },
        transaction,
      }),
    ])
    if (sentToday >= delegationRequestMaxPerDay) {
      return DelegationRequestError.RateLimited
    }
    if (pending >= delegationRequestMaxPending) {
      return DelegationRequestError.TooManyPending
    }
    return undefined
  }

  /**
   * Approves pending requests whose held grant the grantor has since confirmed,
   * and expires the rest that are past their time. Updates the loaded rows too.
   */
  private async refreshStatuses(
    requests: DelegationRequest[],
    transaction?: Transaction,
  ): Promise<void> {
    const now = new Date()
    const expired: DelegationRequest[] = []
    for (const request of requests) {
      if (request.status !== DelegationRequestStatus.Pending) {
        continue
      }
      const confirmed = request.requestConfirmations?.find(
        ({ delegationConfirmation }) =>
          delegationConfirmation?.status ===
          DelegationConfirmationStatus.Confirmed,
      )?.delegationConfirmation
      if (confirmed) {
        await this.markApproved(request, confirmed, transaction)
      } else if (request.expiresAt < now) {
        expired.push(request)
      }
    }
    if (expired.length === 0) {
      return
    }

    await this.delegationRequestModel.update(
      { status: DelegationRequestStatus.Expired },
      {
        where: {
          id: expired.map((request) => request.id),
          status: DelegationRequestStatus.Pending,
        },
        transaction,
      },
    )
    for (const request of expired) {
      request.status = DelegationRequestStatus.Expired
    }
  }

  private async markApproved(
    request: DelegationRequest,
    confirmation: DelegationConfirmation,
    transaction?: Transaction,
  ): Promise<void> {
    const resolvedByNationalId =
      confirmation.confirmingNationalId ?? request.fromNationalId
    const [updated] = await this.delegationRequestModel.update(
      { status: DelegationRequestStatus.Approved, resolvedByNationalId },
      {
        where: { id: request.id, status: DelegationRequestStatus.Pending },
        transaction,
      },
    )
    if (updated === 1) {
      request.status = DelegationRequestStatus.Approved
      request.resolvedByNationalId = resolvedByNationalId
    }
  }

  private async notifyNewRequest(
    user: User,
    recipient: string,
    relationship: string,
    domainNames: Array<string | null | undefined>,
  ): Promise<void> {
    try {
      if (!(await this.notificationsEnabled(user))) {
        return
      }
      const requesterName = await this.namesService.getUserName(user)
      const { domainNameIs, domainNameEn } = await this.resolveDomainNames(
        user,
        domainNames,
      )
      await this.sendNotification(recipient, DELEGATION_REQUEST_TEMPLATE_ID, [
        { key: 'name', value: requesterName },
        { key: 'relationship', value: relationship },
        { key: 'domainNameIs', value: domainNameIs },
        { key: 'domainNameEn', value: domainNameEn },
      ])
    } catch {
      this.logger.error(
        `Failed to send delegation request notification (template: ${DELEGATION_REQUEST_TEMPLATE_ID})`,
      )
    }
  }

  private async notifyRequester(
    user: User,
    recipient: string,
    templateId: string,
    domainNames: Array<string | null | undefined>,
  ): Promise<void> {
    try {
      if (!(await this.notificationsEnabled(user))) {
        return
      }
      const granterName = await this.namesService.getUserName(user)
      const { domainNameIs, domainNameEn } = await this.resolveDomainNames(
        user,
        domainNames,
      )
      await this.sendNotification(recipient, templateId, [
        { key: 'name', value: granterName },
        { key: 'domainNameIs', value: domainNameIs },
        { key: 'domainNameEn', value: domainNameEn },
      ])
    } catch {
      this.logger.error(
        `Failed to send delegation request notification (template: ${templateId})`,
      )
    }
  }

  private async resolveDomainNames(
    user: User,
    domainNames: Array<string | null | undefined>,
  ): Promise<{ domainNameIs: string; domainNameEn: string }> {
    const distinct = [
      ...new Set(domainNames.filter((name): name is string => Boolean(name))),
    ]
    const join = async (language: string): Promise<string> => {
      const names = await Promise.all(
        distinct.map(async (name) => {
          try {
            const domain = await this.delegationResourceService.findOneDomain(
              user,
              name,
              language,
            )
            return domain.displayName
          } catch {
            return name
          }
        }),
      )
      return names.filter(Boolean).join(', ')
    }
    return {
      domainNameIs: await join('is'),
      domainNameEn: await join('en'),
    }
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
    await this.notificationsApi.notificationsControllerCreateHnippNotification({
      createHnippNotificationDto: { recipient, templateId, args },
    })
  }
}
