import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { and, Op, WhereOptions } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { isUuid, uuid } from 'uuidv4'
import startOfDay from 'date-fns/startOfDay'

import { User } from '@island.is/auth-nest-tools'
import { NoContentException } from '@island.is/nest/problem'
import { NotificationsApi } from '../user-notification'

import { ApiScope } from '../resources/models/api-scope.model'
import { DelegationScopeService } from './delegation-scope.service'
import {
  CreateDelegationDTO,
  DelegationDTO,
  PatchDelegationDTO,
} from './dto/delegation.dto'
import { CreateDelegationBatchDTO } from './dto/create-delegation-batch.dto'
import { DelegationScope } from './models/delegation-scope.model'
import { Delegation } from './models/delegation.model'
import { DelegationValidity } from './types/delegationValidity'
import {
  getScopeValidityWhereClause,
  validateScopesPeriod,
} from './utils/scopes'
import { NamesService } from './names.service'
import { getDelegationNoActorWhereClause } from './utils/delegations'
import { DelegationResourcesService } from '../resources/delegation-resources.service'
import { DelegationDirection } from './types/delegationDirection'
import { DelegationsIndexService } from './delegations-index.service'
import {
  NEW_DELEGATION_TEMPLATE_ID,
  UPDATED_DELEGATION_TEMPLATE_ID,
} from './constants/hnipp'
import { Features } from '@island.is/feature-flags'
import { FeatureFlagService } from '@island.is/nest/feature-flags'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { DelegationDelegationType } from './models/delegation-delegation-type.model'
import { AuthDelegationType } from '@island.is/shared/types'

/**
 * Discriminated result for the PATCH endpoint. Controllers translate the
 * variant into an HTTP status and decide whether to audit:
 *  - notFound: delegation didn't exist or wasn't the caller's → 204, skip audit
 *  - updated:  scopes changed but the delegation still has scopes → 200, audit "update"
 *  - destroyed: the patch removed the last scope and the row was deleted → 204, audit "destroy"
 */
export type PatchDelegationResult =
  | { kind: 'notFound' }
  | {
      kind: 'updated'
      delegation: DelegationDTO
      hadExistingScopes: boolean
    }
  | { kind: 'destroyed'; toNationalId: string }

/**
 * Service class for outgoing delegations.
 * This class supports domain based delegations.
 */
@Injectable()
export class DelegationsOutgoingService {
  constructor(
    @InjectModel(Delegation)
    private delegationModel: typeof Delegation,
    private delegationScopeService: DelegationScopeService,
    private delegationResourceService: DelegationResourcesService,
    private delegationIndexService: DelegationsIndexService,
    private namesService: NamesService,
    private notificationsApi: NotificationsApi,
    private featureFlagService: FeatureFlagService,
    private sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async findAll(
    user: User,
    validity: DelegationValidity,
    domainName?: string,
    otherUser?: string,
  ): Promise<DelegationDTO[]> {
    if (otherUser) {
      return this.findByOtherUser(user, otherUser, domainName)
    }

    const [delegations, delegationTypesDelegations] = await Promise.all([
      this.delegationModel.findAll({
        where: and(
          {
            fromNationalId: user.nationalId,
          },
          domainName ? { domainName } : {},
          getDelegationNoActorWhereClause(user),
          ...(await this.delegationResourceService.apiScopeFilter({
            user,
            prefix: 'delegationScopes->apiScope',
            direction: DelegationDirection.OUTGOING,
          })),
        ),
        include: [
          {
            model: DelegationScope,
            include: [
              {
                attributes: ['displayName'],
                model: ApiScope,
                required: true,
                include: [
                  ...this.delegationResourceService.apiScopeInclude(
                    user,
                    DelegationDirection.OUTGOING,
                  ),
                ],
              },
            ],
            required: validity !== DelegationValidity.ALL,
            where: getScopeValidityWhereClause(validity),
          },
        ],
      }),
      this.delegationModel.findAll({
        where: {
          fromNationalId: user.nationalId,
        },
        include: [
          {
            model: DelegationDelegationType,
            where: {
              delegationTypeId: AuthDelegationType.GeneralMandate,
              validTo: {
                [Op.or]: {
                  [Op.gte]: startOfDay(new Date()),
                  [Op.is]: null,
                },
              },
            },
            required: true,
          },
        ],
      }),
    ])

    const delegationTypesDTO = delegationTypesDelegations.map((d) =>
      d.toDTO(AuthDelegationType.GeneralMandate),
    )

    const delegationsDTO = delegations.map((d) => d.toDTO())

    return [...delegationsDTO, ...delegationTypesDTO]
  }

  async findByOtherUser(
    user: User,
    otherUser: string,
    domainName?: string,
  ): Promise<DelegationDTO[]> {
    if (!domainName) {
      throw new BadRequestException(
        'Domain name is required when fetching delegation by other user.',
      )
    }

    if (otherUser === user.actor?.nationalId) {
      throw new BadRequestException(
        'Cannot fetch delegations for yourself as actor.',
      )
    }

    const delegation = await this.findOneInternal(
      user,
      DelegationDirection.OUTGOING,
      {
        fromNationalId: user.nationalId,
        toNationalId: otherUser,
        domainName,
      },
    )
    return delegation ? [delegation] : []
  }

  async findById(user: User, delegationId: string): Promise<DelegationDTO> {
    if (!isUuid(delegationId)) {
      throw new BadRequestException('delegationId must be a valid uuid')
    }

    const delegation = await this.findOneInternal(
      user,
      DelegationDirection.OUTGOING,
      {
        fromNationalId: user.nationalId,
        id: delegationId,
      },
    )
    if (!delegation) {
      throw new NoContentException()
    }
    return delegation
  }

  async create(
    user: User,
    createDelegation: CreateDelegationDTO,
  ): Promise<DelegationDTO> {
    const { delegation } = await this.createOrUpdateForDomain(
      user,
      createDelegation,
    )

    return delegation
  }

  async createBatch(
    user: User,
    input: CreateDelegationBatchDTO,
  ): Promise<DelegationDTO[]> {
    const results: Array<{
      delegation: DelegationDTO
      hadExistingScopes: boolean
    }> = []
    for (const createDelegation of input.delegations) {
      results.push(await this.createOrUpdateForDomain(user, createDelegation))
    }

    const byRecipient = new Map<string, typeof results>()
    for (const result of results) {
      const recipient = result.delegation.toNationalId
      const group = byRecipient.get(recipient) ?? []
      group.push(result)
      byRecipient.set(recipient, group)
    }
    for (const group of byRecipient.values()) {
      void this.notifyDelegationUpdate(user, group)
    }

    return results.map((result) => result.delegation)
  }

  private async createOrUpdateForDomain(
    user: User,
    createDelegation: CreateDelegationDTO,
  ): Promise<{ delegation: DelegationDTO; hadExistingScopes: boolean }> {
    if (
      createDelegation.toNationalId === user.nationalId ||
      createDelegation.toNationalId === user.actor?.nationalId
    ) {
      throw new BadRequestException(
        `Cannot create delegation to self or actor.`,
      )
    }

    if (!createDelegation.domainName) {
      throw new BadRequestException(
        'Domain name is required to create delegation.',
      )
    }

    if (
      !(await this.delegationResourceService.validateScopeAccess(
        user,
        createDelegation.domainName,
        DelegationDirection.OUTGOING,
        (createDelegation.scopes ?? []).map((scope) => scope.name),
      ))
    ) {
      throw new BadRequestException(
        'User does not have access to the requested scopes.',
      )
    }

    if (!validateScopesPeriod(createDelegation.scopes)) {
      throw new BadRequestException(
        'When scope validTo property is provided it must be in the future',
      )
    }

    let delegation = await this.delegationModel.findOne({
      where: {
        fromNationalId: user.nationalId,
        toNationalId: createDelegation.toNationalId,
        domainName: createDelegation.domainName,
      },
    })

    const hadExistingScopes = delegation
      ? (await this.delegationScopeService.findByDelegationId(delegation.id))
          .length > 0
      : false

    if (!delegation) {
      const [fromDisplayName, toName] = await Promise.all([
        this.namesService.getUserName(user),
        this.namesService.validateRecipientNotDeceased(
          createDelegation.toNationalId,
        ),
      ])

      delegation = await this.delegationModel.create({
        id: uuid(),
        fromNationalId: user.nationalId,
        toNationalId: createDelegation.toNationalId,
        domainName: createDelegation.domainName,
        createdByNationalId: user.actor?.nationalId ?? user.nationalId,
        // TODO: should not persist names with the delegation
        // should always look it up to avoid being out of sync
        fromDisplayName,
        toName,
      })
    }

    await this.delegationScopeService.createOrUpdate(
      delegation.id,
      createDelegation.scopes,
    )

    const newDelegation = await this.findOneInternal(
      user,
      DelegationDirection.OUTGOING,
      {
        id: delegation.id,
      },
    )

    if (!newDelegation) {
      throw new InternalServerErrorException(
        `Failed to find the newly created delegation with id ${delegation.id}`,
      )
    }

    // Index custom delegations for the toNationalId
    void this.delegationIndexService.indexCustomDelegations(
      createDelegation.toNationalId,
      user,
    )

    return { delegation: newDelegation, hadExistingScopes }
  }

  private async notifyDelegationUpdate(
    user: User,
    updates: Array<{ delegation: DelegationDTO; hadExistingScopes: boolean }>,
  ) {
    try {
      const relevant = updates.filter(
        (update) =>
          update.delegation.scopes?.length && update.delegation.domainName,
      )
      if (relevant.length === 0) {
        return
      }

      const allowDelegationNotification =
        await this.featureFlagService.getValue(
          Features.isDelegationNotificationEnabled,
          false,
          user,
        )
      if (!allowDelegationNotification) {
        return
      }

      const recipient = relevant[0].delegation.toNationalId
      const fromDisplayName = await this.namesService.getUserName(user)

      const uniqueDomains = [
        ...new Set(
          relevant.map((update) => update.delegation.domainName as string),
        ),
      ]
      const domainDisplayNames = await Promise.all(
        uniqueDomains.map(async (domainName) => ({
          is: (
            await this.delegationResourceService.findOneDomain(
              user,
              domainName,
              'is',
            )
          ).displayName,
          en: (
            await this.delegationResourceService.findOneDomain(
              user,
              domainName,
              'en',
            )
          ).displayName,
        })),
      )

      const args = [
        { key: 'name', value: fromDisplayName },
        {
          key: 'domainNameIs',
          value: domainDisplayNames.map((domain) => domain.is).join(', '),
        },
        {
          key: 'domainNameEn',
          value: domainDisplayNames.map((domain) => domain.en).join(', '),
        },
      ]

      const isNewDelegation = relevant.some(
        (update) => !update.hadExistingScopes,
      )

      await this.notificationsApi.notificationsControllerCreateHnippNotification(
        {
          createHnippNotificationDto: {
            args,
            recipient,
            templateId: isNewDelegation
              ? NEW_DELEGATION_TEMPLATE_ID
              : UPDATED_DELEGATION_TEMPLATE_ID,
          },
        },
      )
    } catch (e) {
      this.logger.error(`Failed to send delegation notification`, e)
    }
  }

  async patch(
    user: User,
    delegationId: string,
    patchedDelegation: PatchDelegationDTO,
  ): Promise<PatchDelegationResult> {
    if (!validateScopesPeriod(patchedDelegation.updateScopes)) {
      throw new BadRequestException(
        'If scope validTo property is provided it must be in the future',
      )
    }

    const txResult = await this.sequelize.transaction(async (transaction) => {
      const currentDelegation = await this.delegationModel.findOne({
        where: {
          [Op.and]: [
            { id: delegationId, fromNationalId: user.nationalId },
            getDelegationNoActorWhereClause(user),
          ],
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      })
      if (!currentDelegation) {
        return { kind: 'notFound' as const }
      }

      const existingScopes =
        await this.delegationScopeService.findByDelegationId(
          delegationId,
          transaction,
        )

      if (
        !(await this.delegationResourceService.validateScopeAccess(
          user,
          currentDelegation.domainName ?? null,
          DelegationDirection.OUTGOING,
          [
            ...(patchedDelegation.updateScopes ?? []).map(
              (scope) => scope.name,
            ),
            ...(patchedDelegation.deleteScopes ?? []),
          ],
        ))
      ) {
        throw new BadRequestException(
          'User does not have access to the requested scopes.',
        )
      }

      if (
        patchedDelegation.deleteScopes &&
        patchedDelegation.deleteScopes.length > 0
      ) {
        await this.delegationScopeService.deleteByName(
          delegationId,
          patchedDelegation.deleteScopes,
          transaction,
        )
      }

      if (
        patchedDelegation.updateScopes &&
        patchedDelegation.updateScopes.length > 0
      ) {
        await this.delegationScopeService.createOrUpdate(
          delegationId,
          patchedDelegation.updateScopes,
          transaction,
        )
      }

      const remainingScopes =
        await this.delegationScopeService.findByDelegationId(
          delegationId,
          transaction,
        )

      if (remainingScopes.length === 0) {
        // No scopes remain — delete the delegation row so it doesn't linger
        // as an empty record that grants nothing.
        await this.delegationModel.destroy({
          where: { id: delegationId },
          transaction,
        })
        return {
          kind: 'destroyed' as const,
          toNationalId: currentDelegation.toNationalId,
        }
      }

      return {
        kind: 'survived' as const,
        toNationalId: currentDelegation.toNationalId,
        hadExistingScopes: existingScopes.length > 0,
      }
    })

    if (txResult.kind === 'notFound') {
      return { kind: 'notFound' }
    }

    // Reindex after commit so we never reindex changes that might roll back.
    void this.delegationIndexService.indexCustomDelegations(
      txResult.toNationalId,
      user,
    )

    if (txResult.kind === 'destroyed') {
      return {
        kind: 'destroyed',
        toNationalId: txResult.toNationalId,
      }
    }

    const delegation = await this.findById(user, delegationId)
    void this.notifyDelegationUpdate(user, [
      { delegation, hadExistingScopes: txResult.hadExistingScopes },
    ])
    return {
      kind: 'updated',
      delegation,
      hadExistingScopes: txResult.hadExistingScopes,
    }
  }

  async delete(user: User, delegationId: string): Promise<void> {
    const delegation = await this.delegationModel.findByPk(delegationId)
    if (!delegation || !this.isConnectedToDelegation(user, delegation)) {
      return
    }

    const userScopes = await this.delegationResourceService.findScopes(
      user,
      delegation.domainName ?? null,
    )
    await this.delegationScopeService.delete(
      delegationId,
      userScopes.map((scope) => scope.name),
    )

    // If no scopes are left delete the delegation.
    const remainingScopes = await this.delegationScopeService.findAll(
      delegationId,
    )
    if (remainingScopes.length === 0) {
      await this.delegationModel.destroy({
        where: {
          id: delegationId,
        },
      })
    }

    // Index custom delegations for the toNationalId
    void this.delegationIndexService.indexCustomDelegations(
      delegation.toNationalId,
      user,
    )
  }

  private async findOneInternal(
    user: User,
    direction: DelegationDirection,
    where: WhereOptions<Delegation>,
  ): Promise<DelegationDTO | null> {
    const delegation = await this.delegationModel.findOne({
      where,
      useMaster: true,
      include: [
        {
          model: DelegationScope,
          required: false,
          include: [
            {
              attributes: ['displayName'],
              model: ApiScope,
            },
          ],
        },
      ],
    })

    if (!delegation) {
      return null
    }

    // Verify and filter scopes.
    const userScopes = await this.delegationResourceService.findScopeNames(
      user,
      delegation.domainName ?? null,
      direction,
    )
    if (!userScopes.length) {
      return null
    }

    delegation.delegationScopes = delegation.delegationScopes?.filter((scope) =>
      userScopes.includes(scope.scopeName),
    )

    return delegation.toDTO()
  }

  private isConnectedToDelegation(user: User, delegation: Delegation): boolean {
    return (
      user.nationalId === delegation.fromNationalId ||
      user.nationalId === delegation.toNationalId
    )
  }
}
