import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { Delegation } from '../models/delegation.model'
import { DelegationAdminCustomDto } from '../dto/delegation-admin-custom.dto'
import { DelegationScope } from '../models/delegation-scope.model'
import { ApiScope } from '../../resources/models/api-scope.model'
import { ApiScopeDelegationType } from '../../resources/models/api-scope-delegation-type.model'
import { AuthDelegationType } from '@island.is/shared/types'
import { User } from '@island.is/auth-nest-tools'
import { DelegationResourcesService } from '../../resources/delegation-resources.service'
import { DelegationsIndexService } from '../delegations-index.service'
import { DelegationScopeService } from '../delegation-scope.service'

@Injectable()
export class DelegationAdminCustomService {
  constructor(
    @InjectModel(Delegation)
    private delegationModel: typeof Delegation,
    private delegationResourceService: DelegationResourcesService,
    private delegationIndexService: DelegationsIndexService,
    private delegationScopeService: DelegationScopeService,
  ) {}

  async getAllDelegationsByNationalId(
    nationalId: string,
  ): Promise<DelegationAdminCustomDto> {
    const incomingDelegations = await this.delegationModel.findAll({
      useMaster: true,
      where: {
        toNationalId: nationalId,
      },
      include: [
        {
          model: DelegationScope,
          required: true,
          include: [
            {
              model: ApiScope,
              as: 'apiScope',
              required: true,
              where: {
                enabled: true,
              },
              include: [
                {
                  model: ApiScopeDelegationType,
                  required: true,
                  where: {
                    delegationType: AuthDelegationType.Custom,
                  },
                },
              ],
            },
          ],
        },
      ],
    })

    const outgoingDelegations = await this.delegationModel.findAll({
      useMaster: true,
      where: {
        fromNationalId: nationalId,
      },
      include: [
        {
          model: DelegationScope,
          required: true,
          include: [
            {
              model: ApiScope,
              required: true,
              as: 'apiScope',
              where: {
                enabled: true,
              },
              include: [
                {
                  model: ApiScopeDelegationType,
                  required: true,
                  where: {
                    delegationType: AuthDelegationType.Custom,
                  },
                },
              ],
            },
          ],
        },
      ],
    })

    return {
      incoming: incomingDelegations.map((delegation) => delegation.toDTO()),
      outgoing: outgoingDelegations.map((delegation) => delegation.toDTO()),
    }
  }

  async deleteDelegation(user: User, delegationId: string): Promise<void> {
    // TODO: Check if delegation has a ReferenceId and throw error if it does not.
    const delegation = await this.delegationModel.findByPk(delegationId)

    if (!delegation) {
      throw new NotFoundException('Delegation not found')
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

    // Index custom delegations for the toNationalId
    void this.delegationIndexService.indexCustomDelegations(
      delegation.toNationalId,
    )
  }
}
