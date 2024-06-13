import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { PaginatedDelegationProviderDto } from './dto/paginated-delegation-provider.dto'
import { DelegationProviderModel } from './models/delegation-provider.model'
import { DelegationTypeModel } from './models/delegation-type.model'

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
}
