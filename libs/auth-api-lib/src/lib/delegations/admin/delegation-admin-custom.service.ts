import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { Delegation } from '../models/delegation.model'
import { DelegationAdminCustomDto } from '../dto/delegation-admin-custom.dto'
import { DelegationScope } from '../models/delegation-scope.model'
import { ApiScope } from '../../resources/models/api-scope.model'
import { ApiScopeDelegationType } from '../../resources/models/api-scope-delegation-type.model'
import { AuthDelegationType } from '@island.is/shared/types'

@Injectable()
export class DelegationAdminCustomService {
  constructor(
    @InjectModel(Delegation)
    private delegationModel: typeof Delegation,
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

    return {
      incoming: incomingDelegations.map((delegation) => delegation.toDTO()),
      outgoing: outgoingDelegations.map((delegation) => delegation.toDTO()),
    }
  }
}
