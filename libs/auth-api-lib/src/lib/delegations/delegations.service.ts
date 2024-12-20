import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { isUuid } from 'uuidv4'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { NoContentException } from '@island.is/nest/problem'
import { AuthDelegationType } from '@island.is/shared/types'

import { DelegationResourcesService } from '../resources/delegation-resources.service'
import { ApiScope } from '../resources/models/api-scope.model'
import { DelegationScopeService } from './delegation-scope.service'
import { DelegationConfig } from './DelegationConfig'
import { DelegationDTO } from './dto/delegation.dto'
import { DelegationScope } from './models/delegation-scope.model'
import { Delegation } from './models/delegation.model'
import { DelegationDirection } from './types/delegationDirection'

import type { User } from '@island.is/auth-nest-tools'
import type { Logger } from '@island.is/logging'

@Injectable()
export class DelegationsService {
  constructor(
    @InjectModel(Delegation)
    private delegationModel: typeof Delegation,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @Inject(DelegationConfig.KEY)
    private delegationConfig: ConfigType<typeof DelegationConfig>,
    private delegationScopeService: DelegationScopeService,
    private readonly delegationResourcesService: DelegationResourcesService,
  ) {}

  /**
   * Finds a single delegation related to the user, either as a outgoing or incoming.
   * @param user Authenticated user object.
   * @param delegationId Id of the delegation to find.
   */
  async findById(user: User, delegationId: string): Promise<DelegationDTO> {
    if (!isUuid(delegationId)) {
      throw new BadRequestException('delegationId must be a valid uuid')
    }

    const delegation = await this.delegationModel.findOne({
      where: {
        id: delegationId,
        [Op.or]: [
          { fromNationalId: user.nationalId },
          { toNationalId: user.nationalId },
        ],
      },
      include: [
        {
          model: DelegationScope,
          required: false,
          include: [
            {
              model: ApiScope,
              attributes: ['displayName'],
            },
          ],
        },
      ],
    })

    const filteredDelegation = await this.filterDelegation(user, delegation)

    if (!filteredDelegation) {
      throw new NoContentException()
    }

    return filteredDelegation.toDTO()
  }

  private async filterDelegation(
    user: User,
    delegation: Delegation | null,
  ): Promise<Delegation | null> {
    let direction: DelegationDirection

    if (delegation?.fromNationalId === user.nationalId) {
      direction = DelegationDirection.OUTGOING
    } else if (delegation?.toNationalId === user.nationalId) {
      direction = DelegationDirection.INCOMING
    } else {
      return null
    }

    const allowedScopes = await this.delegationResourcesService.findScopeNames(
      user,
      delegation.domainName ?? null,
      direction,
    )
    // If the user doesn't have any allowed scope in the delegation domain we return null
    if (!allowedScopes.length) {
      return null
    }

    delegation.delegationScopes = delegation.delegationScopes?.filter((scope) =>
      allowedScopes.includes(scope.scopeName),
    )

    return delegation
  }

  /**
   * Deletes a delegation a user has given.
   * if direction is incoming is then all delegation scopes will be deleted else only user scopes
   * @param user User object of the authenticated user.
   * @param id Id of the delegation to delete
   * @param direction Direction of the delegation: incoming or outgoing
   * @returns
   */
  async delete(
    user: User,
    id: string,
    direction: DelegationDirection = DelegationDirection.OUTGOING,
  ): Promise<boolean> {
    this.logger.debug(`Deleting delegation ${id}`)

    const delegation = await this.delegationModel.findByPk(id)
    const isOutgoing = direction === DelegationDirection.OUTGOING
    const nationalId = isOutgoing
      ? delegation?.fromNationalId
      : delegation?.toNationalId

    if (!delegation || nationalId !== user.nationalId) {
      this.logger.debug('Delegation does not exists or is not assigned to user')
      throw new NotFoundException()
    }

    await this.delegationScopeService.delete(
      id,
      isOutgoing
        ? user.scope.filter((scope) => this.filterCustomScopeRule(scope, user))
        : null,
    )

    const remainingScopes =
      await this.delegationScopeService.findByDelegationId(id)

    // If no remaining scopes then we are save to delete the delegation
    if (remainingScopes.length === 0) {
      await this.delegationModel.destroy({
        where: { id },
      })
    }

    return true
  }

  private filterCustomScopeRule(scope: string, user: User): boolean {
    const customRule = this.delegationConfig.customScopeRules.find(
      (rule) => rule.scopeName === scope,
    )

    return (
      !customRule ||
      customRule.onlyForDelegationType.some((type) =>
        user.delegationType?.includes(type as AuthDelegationType),
      )
    )
  }
}
