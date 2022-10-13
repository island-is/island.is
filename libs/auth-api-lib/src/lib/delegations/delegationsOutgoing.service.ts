import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { uuid } from 'uuidv4'

import { User } from '@island.is/auth-nest-tools'

import { ApiScope } from '../resources/models/api-scope.model'
import { DelegationScopeService } from './delegationScope.service'
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

@Injectable()
export class DelegationsOutgoingService {
  constructor(
    @InjectModel(Delegation)
    private delegationModel: typeof Delegation,
    private delegationScopeService: DelegationScopeService,
  ) {}

  async findAll(
    user: User,
    validity: DelegationValidity,
    domain?: string,
    otherUser?: string,
  ): Promise<DelegationDTO[]> {
    const delegations = await this.delegationModel.findAll({
      where: {
        fromNationalId: user.nationalId,
        ...(otherUser ? { toNationalId: otherUser } : {}),
        //domain,
      },
      include: [
        {
          model: DelegationScope,
          include: [
            {
              model: ApiScope,
              as: 'apiScope',
              where: {
                allowExplicitDelegationGrant: true,
              },
            },
          ],
          required: validity !== DelegationValidity.ALL,
        },
      ],
    })

    // TODO: Validate user scope access to the delegation scopes.

    return delegations.map((d) => d.toDTO())
  }

  async findById(
    user: User,
    delegationId: string,
  ): Promise<DelegationDTO | null> {
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
          as: 'delegationScopes',
          required: false,
          where: getScopeValidityWhereClause(DelegationValidity.INCLUDE_FUTURE),
          include: [
            {
              model: ApiScope,
              as: 'apiScope',
              where: {
                allowExplicitDelegationGrant: true,
              },
            },
          ],
        },
      ],
    })

    // TODO: Validate user scope access to the delegation scopes.

    return delegation?.toDTO() ?? null
  }

  async create(
    user: User,
    createDelegation: CreateDelegationDTO,
  ): Promise<DelegationDTO> {
    if (createDelegation.toNationalId === user.nationalId) {
      throw new BadRequestException(`Cannot create delegation to self.`)
    }

    if (!createDelegation.domainName) {
      throw new BadRequestException(
        'Domain name is required to create delegation.',
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
        //domainName: createDelegation.domainName,
      },
    })

    if (!delegation) {
      // We want to stop storing the names on the delegation
      // const [fromDisplayName, toName] = await Promise.all([
      //   this.getUserName(user),
      //   this.getPersonName(createDelegation.toNationalId),
      // ])

      delegation = await this.delegationModel.create({
        id: uuid(),
        fromNationalId: user.nationalId,
        toNationalId: createDelegation.toNationalId,
      })
    }

    // TODO: In next cycle we will add user authorization on the scopes

    await this.delegationScopeService.createOrUpdate(
      delegation.id,
      createDelegation.scopes,
    )

    const newDelegation = await this.findById(user, delegation.id)

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
  ): Promise<DelegationDTO | null> {
    const currentDelegation = await this.findById(user, delegationId)
    if (!currentDelegation) {
      return null
    }

    if (!validateScopesPeriod(patchedDelegation.updateScopes)) {
      throw new BadRequestException(
        'If scope validTo property is provided it must be in the future',
      )
    }

    if (
      patchedDelegation.deleteScopes &&
      patchedDelegation.deleteScopes.length > 0
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

    // TODO: Scope authorization and delete only scopes the user has access to.
    await this.delegationScopeService.delete(delegationId)

    // TODO: Delete the delegation if there are no scopes left.
    await this.delegationModel.destroy({
      where: {
        id: delegationId,
      },
    })
  }

  private isConnectedToDelegation(user: User, delegation: Delegation): boolean {
    return (
      user.nationalId === delegation.fromNationalId ||
      user.nationalId === delegation.toNationalId
    )
  }
}
