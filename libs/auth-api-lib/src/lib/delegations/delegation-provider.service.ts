import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { PaginatedDelegationProviderDto } from './dto/paginated-delegation-provider.dto'
import { DelegationProviderModel } from './models/delegation-provider.model'
import { DelegationTypeModel } from './models/delegation-type.model'
import { Op } from 'sequelize'
import { AuthDelegationType } from '@island.is/shared/types'

@Injectable()
export class DelegationProviderService {
  constructor(
    @InjectModel(DelegationProviderModel)
    private delegationProviderModel: typeof DelegationProviderModel,
    @InjectModel(DelegationTypeModel)
    private delegationTypeModel: typeof DelegationTypeModel,
  ) {}

  async findAll(): Promise<PaginatedDelegationProviderDto> {
    const delegationProviders = await this.delegationProviderModel.findAll({
      include: [
        {
          model: this.delegationTypeModel,
          as: 'delegationTypes',
          where: {
            id: {
              [Op.ne]: AuthDelegationType.GeneralMandate, // Exclude delegation type since we do not want to show this in the UI
            },
          },
        },
      ],
      order: [['order', 'ASC']],
    })

    return {
      totalCount: delegationProviders.length,
      data: delegationProviders.map((dp) => dp.toDTO()),
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: '',
        endCursor: '',
      },
    }
  }

  async findProviders(delegationTypes: string[]): Promise<string[]> {
    if (!delegationTypes) return []

    return (
      await this.delegationTypeModel.findAll({
        where: {
          id: delegationTypes,
        },
        attributes: ['providerId'],
      })
    ).map((dt) => dt.providerId)
  }
}
