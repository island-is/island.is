import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { and, Op, UniqueConstraintError } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { uuid } from 'uuidv4'
import kennitala from 'kennitala'

import { User } from '@island.is/auth-nest-tools'
import { Features } from '@island.is/feature-flags'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'
import { FeatureFlagService } from '@island.is/nest/feature-flags'

import { ApiScope } from '../resources/models/api-scope.model'
import { Domain } from '../resources/models/domain.model'
import { DelegationResourcesService } from '../resources/delegation-resources.service'
import { DelegationDirection } from './types/delegationDirection'
import { DelegationsOutgoingService } from './delegations-outgoing.service'
import { NotificationsApi } from '../user-notification'
import { DelegationRequestError } from './constants/delegation-request-errors'
import {
  DELEGATION_REQUEST_APPROVED_TEMPLATE_ID,
  DELEGATION_REQUEST_REJECTED_TEMPLATE_ID,
  DELEGATION_REQUEST_TEMPLATE_ID,
} from './constants/hnipp'
import { DelegationConfig } from './DelegationConfig'
import {
  ApproveDelegationRequestDTO,
  CreateDelegationRequestDTO,
  DelegationRequestDTO,
} from './dto/delegation-request.dto'
import { DelegationRequestDelegation } from './models/delegation-request-delegation.model'
import { DelegationRequestScope } from './models/delegation-request-scope.model'
import { DelegationRequest } from './models/delegation-request.model'
import { NamesService } from './names.service'
import { DelegationRequestStatus } from './types/delegationRequestStatus'

const REQUEST_TTL_DAYS = 30
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000

const DUPLICATE_PENDING_MESSAGE =
  'A pending delegation request to this party already exists.'

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
    private namesService: NamesService,
    private delegationResourceService: DelegationResourcesService,
    private delegationsOutgoingService: DelegationsOutgoingService,
    private notificationsApi: NotificationsApi,
    private featureFlagService: FeatureFlagService,
    private sequelize: Sequelize,
    @Inject(DelegationConfig.KEY)
    private delegationConfig: ConfigType<typeof DelegationConfig>,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async createRequest(
    user: User,
    dto: CreateDelegationRequestDTO,
  ): Promise<DelegationRequestDTO> {
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

    await this.expireStale({ toNationalId: requesterNationalId })
    await this.assertNotRejectionBlocked(requesterNationalId)
    await this.assertUnderRateLimits(requesterNationalId, granterNationalId)
    await this.assertNoDuplicatePending(granterNationalId, requesterNationalId)
    await this.assertUnderPendingCap(requesterNationalId)

    if (!isCompany) {
      await this.namesService.validateRecipientNotDeceased(granterNationalId)
    }

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + REQUEST_TTL_DAYS)

    const request = await this.sequelize
      .transaction(async (transaction) => {
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
        // A concurrent submission won the race past assertNoDuplicatePending.
        if (error instanceof UniqueConstraintError) {
          throw new BadRequestException(DUPLICATE_PENDING_MESSAGE)
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

  async findAllOutgoing(user: User): Promise<DelegationRequestDTO[]> {
    await this.expireStale({ toNationalId: user.nationalId })
    const requests = await this.delegationRequestModel.findAll({
      where: { toNationalId: user.nationalId },
      include: [
        {
          model: DelegationRequestScope,
          include: [{ model: ApiScope, include: [Domain] }],
        },
        { model: DelegationRequestDelegation },
      ],
      order: [['created', 'DESC']],
    })
    return requests.map((r) => r.toDTO())
  }

  async findAllIncoming(user: User): Promise<DelegationRequestDTO[]> {
    await this.expireStale({ fromNationalId: user.nationalId })
    const requests = await this.delegationRequestModel.findAll({
      where: { fromNationalId: user.nationalId },
      include: [
        {
          model: DelegationRequestScope,
          include: [{ model: ApiScope, include: [Domain] }],
        },
        { model: DelegationRequestDelegation },
      ],
      order: [['created', 'DESC']],
    })
    return requests.map((r) => r.toDTO())
  }

  async findById(user: User, id: string): Promise<DelegationRequestDTO> {
    const request = await this.getParticipantRequest(user, id)
    return request.toDTO()
  }

  async reject(user: User, id: string): Promise<DelegationRequestDTO> {
    const request = await this.getGranterRequest(user, id)
    this.assertPending(request)
    await this.assertCanGrantRequestedScopes(user, request)

    await this.transitionFromPending(id, {
      status: DelegationRequestStatus.Rejected,
      resolvedByNationalId: user.actor?.nationalId ?? user.nationalId,
    })

    void this.notifyRequester(
      user,
      request.toNationalId,
      DELEGATION_REQUEST_REJECTED_TEMPLATE_ID,
      request.requestScopes?.map((s) => s.apiScope?.domainName) ?? [],
    )

    return this.findById(user, id)
  }

  async cancel(user: User, id: string): Promise<DelegationRequestDTO> {
    const request = await this.delegationRequestModel.findByPk(id)
    if (!request || request.toNationalId !== user.nationalId) {
      throw new NotFoundException('Delegation request not found.')
    }
    this.assertPending(request)

    await this.transitionFromPending(id, {
      status: DelegationRequestStatus.Cancelled,
    })
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
    const delegations = [...scopesByDomain].map(([domainName, scopes]) => ({
      toNationalId: request.toNationalId,
      domainName,
      scopes,
    }))

    await this.sequelize.transaction(async (transaction) => {
      const locked = await this.delegationRequestModel.findByPk(id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      })
      if (!locked) {
        throw new NotFoundException('Delegation request not found.')
      }
      this.assertPending(locked)

      const delegationIds =
        await this.delegationsOutgoingService.createBatchInTransaction(
          user,
          delegations,
          transaction,
        )

      await locked.update(
        {
          status: DelegationRequestStatus.Approved,
          resolvedByNationalId: user.actor?.nationalId ?? user.nationalId,
        },
        { transaction },
      )
      await this.delegationRequestDelegationModel.bulkCreate(
        delegationIds.map((delegationId) => ({
          id: uuid(),
          delegationRequestId: id,
          delegationId,
        })),
        { transaction },
      )
    })

    void this.notifyRequester(
      user,
      request.toNationalId,
      DELEGATION_REQUEST_APPROVED_TEMPLATE_ID,
      [...scopesByDomain.keys()],
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
        { model: DelegationRequestDelegation },
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
        { model: DelegationRequestDelegation },
      ],
    })
    // In company view user.nationalId is the company.
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
    if (request.expiresAt < new Date()) {
      throw new BadRequestException('Delegation request has expired.')
    }
  }

  private async transitionFromPending(
    id: string,
    values: Pick<DelegationRequest, 'status'> &
      Partial<Pick<DelegationRequest, 'resolvedByNationalId'>>,
  ): Promise<void> {
    const [updated] = await this.delegationRequestModel.update(values, {
      where: { id, status: DelegationRequestStatus.Pending },
    })
    if (updated === 0) {
      throw new BadRequestException('Delegation request is not pending.')
    }
  }

  private async assertCanGrantRequestedScopes(
    user: User,
    request: DelegationRequest,
  ): Promise<void> {
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

  private async assertUnderRateLimits(
    requesterNationalId: string,
    granterNationalId: string,
  ): Promise<void> {
    const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS)
    const [total, toGranter] = await Promise.all([
      this.delegationRequestModel.count({
        where: {
          toNationalId: requesterNationalId,
          created: { [Op.gte]: since },
        },
      }),
      this.delegationRequestModel.count({
        where: {
          toNationalId: requesterNationalId,
          fromNationalId: granterNationalId,
          created: { [Op.gte]: since },
        },
      }),
    ])
    if (
      total >= this.delegationConfig.delegationRequestMaxPerDay ||
      toGranter >= this.delegationConfig.delegationRequestMaxPerGrantorPerDay
    ) {
      throw new BadRequestException(DelegationRequestError.RateLimited)
    }
  }

  private async assertNoDuplicatePending(
    fromNationalId: string,
    toNationalId: string,
  ): Promise<void> {
    const existing = await this.delegationRequestModel.findOne({
      where: {
        fromNationalId,
        toNationalId,
        status: DelegationRequestStatus.Pending,
      },
    })
    if (existing) {
      throw new BadRequestException(DUPLICATE_PENDING_MESSAGE)
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

  // A rejection is the terminal write on its row, so `modified` is when it happened.
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
