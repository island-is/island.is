import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { and, Op, Transaction, WhereOptions } from 'sequelize'
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
import { isCardSession } from '@island.is/auth/step-up'
import { DelegationConfirmationService } from '../delegation-confirmation/delegation-confirmation.service'
import type { DelegationConfirmation } from '../delegation-confirmation/models/delegation-confirmation.model'
import { PendingConfirmationDTO } from '../delegation-confirmation/dto/delegation-confirmation.dto'
import { UpdateDelegationScopeDTO } from './dto/delegation-scope.dto'
import type { CreateScopesOptions } from './delegation-scope.service'
import { Domain } from '../resources/models/domain.model'

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

interface WrittenDelegation {
  id: string
  toNationalId: string
  hadExistingScopes: boolean
  /** Sensitive scopes held back from this write until the grantor confirms. */
  pendingConfirmation?: DelegationConfirmation
}

/**
 * Service class for outgoing delegations.
 * This class supports domain based delegations.
 */
@Injectable()
export class DelegationsOutgoingService {
  constructor(
    @InjectModel(Delegation)
    private delegationModel: typeof Delegation,
    @InjectModel(ApiScope)
    private apiScopeModel: typeof ApiScope,
    @InjectModel(Domain)
    private domainModel: typeof Domain,
    private delegationConfirmationService: DelegationConfirmationService,
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
    const [{ delegation }] = await this.createOrUpdateMany(user, [
      createDelegation,
    ])

    return delegation
  }

  async createBatch(
    user: User,
    input: CreateDelegationBatchDTO,
  ): Promise<DelegationDTO[]> {
    const results = await this.createOrUpdateMany(user, input.delegations)

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

  private async createOrUpdateMany(
    user: User,
    inputs: CreateDelegationDTO[],
  ): Promise<Array<{ delegation: DelegationDTO; hadExistingScopes: boolean }>> {
    for (const input of inputs) {
      await this.validateCreateDelegation(user, input)
    }

    const written = await this.sequelize.transaction(async (transaction) => {
      const rows: WrittenDelegation[] = []
      for (const input of inputs) {
        rows.push(await this.writeForDomain(user, input, transaction))
      }

      // One authentication confirms everything this grant holds, whatever
      // recipients and domains it spans.
      await this.delegationConfirmationService.group(
        rows.flatMap((row) =>
          row.pendingConfirmation ? [row.pendingConfirmation] : [],
        ),
        transaction,
      )

      return rows
    })

    // Reindex after commit so we never index changes that might roll back.
    for (const toNationalId of new Set(written.map((w) => w.toNationalId))) {
      void this.delegationIndexService.indexCustomDelegations(
        toNationalId,
        user,
      )
    }

    return Promise.all(
      written.map(async ({ id, hadExistingScopes, pendingConfirmation }) => {
        const delegation = await this.findOneInternal(
          user,
          DelegationDirection.OUTGOING,
          { id },
        )
        if (!delegation) {
          throw new InternalServerErrorException(
            `Failed to find the newly created delegation with id ${id}`,
          )
        }
        if (pendingConfirmation) {
          delegation.pendingConfirmations = [
            new PendingConfirmationDTO(pendingConfirmation),
          ]
        }
        return { delegation, hadExistingScopes }
      }),
    )
  }

  private async validateCreateDelegation(
    user: User,
    createDelegation: CreateDelegationDTO,
  ): Promise<void> {
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
  }

  private async writeForDomain(
    user: User,
    createDelegation: CreateDelegationDTO,
    transaction: Transaction,
  ): Promise<WrittenDelegation> {
    let delegation = await this.delegationModel.findOne({
      where: {
        fromNationalId: user.nationalId,
        toNationalId: createDelegation.toNationalId,
        domainName: createDelegation.domainName,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    })

    const hadExistingScopes = delegation
      ? (
          await this.delegationScopeService.findByDelegationId(
            delegation.id,
            transaction,
          )
        ).length > 0
      : false

    if (!delegation) {
      const [fromDisplayName, toName] = await Promise.all([
        this.namesService.getUserName(user),
        this.namesService.validateRecipientNotDeceased(
          createDelegation.toNationalId,
        ),
      ])

      delegation = await this.delegationModel.create(
        {
          id: uuid(),
          fromNationalId: user.nationalId,
          toNationalId: createDelegation.toNationalId,
          domainName: createDelegation.domainName,
          createdByNationalId: user.actor?.nationalId ?? user.nationalId,
          // TODO: should not persist names with the delegation
          // should always look it up to avoid being out of sync
          fromDisplayName,
          toName,
        },
        { transaction },
      )
    }

    // Sensitive scopes are held for confirmation in the same transaction, so a
    // rolled-back grant never leaves a confirmation behind.
    const { grantable, writeOptions, pendingConfirmation } =
      await this.splitSensitiveScopes({
        user,
        delegation,
        domainName: createDelegation.domainName ?? null,
        scopes: createDelegation.scopes ?? [],
        transaction,
      })

    await this.delegationScopeService.createOrUpdate(
      delegation.id,
      grantable,
      transaction,
      writeOptions,
    )

    return {
      id: delegation.id,
      toNationalId: delegation.toNationalId,
      hadExistingScopes,
      pendingConfirmation,
    }
  }

  /**
   * Decides whether a grant can be written now or must wait for a second,
   * high-assurance confirmation.
   *
   * If any requested scope is sensitive, the whole grant waits: every scope in
   * it is held on the confirmation record and nothing is written to the
   * delegation tables until the grantor confirms, when all of it is written
   * at once. Granting part of it now would leave a grantor who stops at the
   * step-up thinking nothing happened while some of it already took effect.
   * Held scopes being absent from the tables is also what makes them unusable
   * by construction rather than by filtering every read path.
   *
   * Scopes the delegation already has are untouched: only what this grant
   * requests waits.
   */
  private async splitSensitiveScopes({
    user,
    delegation,
    domainName,
    scopes,
    transaction,
  }: {
    user: User
    delegation: Delegation
    domainName: string | null
    scopes: UpdateDelegationScopeDTO[]
    transaction?: Transaction
  }): Promise<{
    grantable: UpdateDelegationScopeDTO[]
    /** How the grantable scopes may be written; see CreateScopesOptions. */
    writeOptions?: CreateScopesOptions
    pendingConfirmation?: Awaited<
      ReturnType<DelegationConfirmationService['request']>
    >
  }> {
    if (scopes.length === 0) {
      return { grantable: scopes }
    }

    const confirmationEnabled = await this.featureFlagService.getValue(
      Features.isDelegationConfirmationEnabled,
      false,
      user,
    )

    // Without the feature, a scope marked for confirmation is granted as it
    // always was. Said explicitly, so the guard below every write knows.
    if (!confirmationEnabled) {
      return {
        grantable: scopes,
        writeOptions: { confirmationNotRequired: true },
      }
    }

    const sensitiveScopeNames =
      await this.delegationResourceService.findSensitiveScopeNames(
        user,
        domainName,
        DelegationDirection.OUTGOING,
        scopes.map((scope) => scope.name),
      )

    if (sensitiveScopeNames.length === 0) {
      return { grantable: scopes }
    }

    // The confirmation is a step-up by the method the grantor logged in with,
    // and a card can't be used for it, so a card session can't grant these.
    if (isCardSession(user.amr)) {
      throw new ForbiddenException(
        'Scopes that require confirmation cannot be granted from a session logged in with an ID card.',
      )
    }

    // All of it waits for the confirmation, sensitive or not.
    const held = scopes

    const [scopeDisplayNames, domain] = await Promise.all([
      this.findScopeDisplayNames(held.map((scope) => scope.name)),
      this.domainModel.findOne({ where: { name: domainName } }),
    ])

    const pendingConfirmation =
      await this.delegationConfirmationService.request({
        user,
        delegation,
        scopes: held,
        scopeDisplayNames,
        toName: delegation.toName,
        domainDisplayName: domain?.displayName ?? null,
        transaction,
      })

    return { grantable: [], pendingConfirmation }
  }

  private async findScopeDisplayNames(
    scopeNames: string[],
  ): Promise<Map<string, string>> {
    const scopes = await this.apiScopeModel.findAll({
      attributes: ['name', 'displayName'],
      where: { name: scopeNames },
    })

    return new Map(scopes.map((scope) => [scope.name, scope.displayName]))
  }

  /**
   * Notifies the recipient once a held grant has actually taken effect.
   *
   * The recipient is deliberately not notified when the scopes are merely
   * requested — otherwise they would be told about access they cannot use, and
   * an abandoned confirmation would leave a false notification behind.
   */
  async notifyConfirmedDelegation(
    user: User,
    delegationId: string,
    hadExistingScopes: boolean,
  ): Promise<void> {
    const delegation = await this.findOneInternal(
      user,
      DelegationDirection.OUTGOING,
      { id: delegationId },
    )

    if (!delegation) {
      return
    }

    await this.notifyDelegationUpdate(user, [{ delegation, hadExistingScopes }])
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

    let pendingConfirmationId: string | undefined

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
        const { grantable, writeOptions, pendingConfirmation } =
          await this.splitSensitiveScopes({
            user,
            delegation: currentDelegation,
            domainName: currentDelegation.domainName ?? null,
            scopes: patchedDelegation.updateScopes,
            transaction,
          })

        pendingConfirmationId = pendingConfirmation?.id

        if (grantable.length > 0) {
          await this.delegationScopeService.createOrUpdate(
            delegationId,
            grantable,
            transaction,
            writeOptions,
          )
        }
      }

      const remainingScopes =
        await this.delegationScopeService.findByDelegationId(
          delegationId,
          transaction,
        )

      if (remainingScopes.length === 0 && !pendingConfirmationId) {
        // No scopes remain — delete the delegation row so it doesn't linger
        // as an empty record that grants nothing. A delegation with a pending
        // confirmation is kept: it is the envelope the held scopes attach to
        // once the confirmation is redeemed.
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

    if (pendingConfirmationId) {
      const pendingConfirmation =
        await this.delegationConfirmationService.findByIdForUser(
          user,
          pendingConfirmationId,
        )
      delegation.pendingConfirmations = [
        new PendingConfirmationDTO(pendingConfirmation),
      ]
    }

    // Only access that actually took effect is notified (a delegation with
    // nothing but held scopes has none). Held scopes notify when their
    // confirmation is redeemed instead.
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
