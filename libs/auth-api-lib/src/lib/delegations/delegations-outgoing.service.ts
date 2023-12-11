import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { and, Op, WhereOptions } from 'sequelize'
import { isUuid, uuid } from 'uuidv4'

import { User } from '@island.is/auth-nest-tools'
import { NoContentException } from '@island.is/nest/problem'

import { ApiScope } from '../resources/models/api-scope.model'
import { DelegationScopeService } from './delegation-scope.service'
import {
  CreateDelegationDTO,
  DelegationDTO,
  PatchDelegationDTO,
} from './dto/delegation.dto'
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
    private namesService: NamesService,
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
    const delegations = await this.delegationModel.findAll({
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
    })

    return delegations.map((d) => d.toDTO())
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

    if (!delegation) {
      const [fromDisplayName, toName] = await Promise.all([
        this.namesService.getUserName(user),
        this.namesService.getPersonName(createDelegation.toNationalId),
      ])

      delegation = await this.delegationModel.create({
        id: uuid(),
        fromNationalId: user.nationalId,
        toNationalId: createDelegation.toNationalId,
        domainName: createDelegation.domainName,
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

    return newDelegation
  }

  async patch(
    user: User,
    delegationId: string,
    patchedDelegation: PatchDelegationDTO,
  ): Promise<DelegationDTO> {
    const currentDelegation = await this.delegationModel.findOne({
      where: {
        [Op.and]: [
          {
            id: delegationId,
            fromNationalId: user.nationalId,
          },
          getDelegationNoActorWhereClause(user),
        ],
      },
    })
    if (!currentDelegation) {
      throw new NoContentException()
    }

    if (
      !(await this.delegationResourceService.validateScopeAccess(
        user,
        currentDelegation.domainName,
        DelegationDirection.OUTGOING,
        [
          ...(patchedDelegation.updateScopes ?? []).map((scope) => scope.name),
          ...(patchedDelegation.deleteScopes ?? []),
        ],
      ))
    ) {
      throw new BadRequestException(
        'User does not have access to the requested scopes.',
      )
    }

    if (!validateScopesPeriod(patchedDelegation.updateScopes)) {
      throw new BadRequestException(
        'If scope validTo property is provided it must be in the future',
      )
    }

    if (
      patchedDelegation.deleteScopes &&
      patchedDelegation.deleteScopes?.length > 0
    ) {
      await this.delegationScopeService.delete(
        delegationId,
        patchedDelegation.deleteScopes,
      )
    }

    if (
      patchedDelegation.updateScopes &&
      patchedDelegation.updateScopes.length > 0
    ) {
      await this.delegationScopeService.createOrUpdate(
        delegationId,
        patchedDelegation.updateScopes,
      )
    }

    return this.findById(user, delegationId)
  }

  async delete(user: User, delegationId: string): Promise<void> {
    const delegation = await this.delegationModel.findByPk(delegationId)
    if (!delegation || !this.isConnectedToDelegation(user, delegation)) {
      return
    }

    const userScopes = await this.delegationResourceService.findScopes(
      user,
      delegation.domainName,
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
      delegation.domainName,
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
