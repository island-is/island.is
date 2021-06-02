import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { DelegationScopeDTO } from '../entities/dto/delegation-scope.dto'
import { DelegationScope } from '../entities/models/delegation-scope.model'

@Injectable()
export class DelegationScopeService {
  constructor(
    @InjectModel(DelegationScope)
    private delegationScopeModel: typeof DelegationScope,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async create(
    delegationScope: DelegationScopeDTO,
  ): Promise<DelegationScope | null> {
    this.logger.debug('Creating new delegation scope')
    return this.delegationScopeModel.create({ ...delegationScope })
  }

  async createMany(scopes: DelegationScopeDTO[]): Promise<any> {
    return this.delegationScopeModel.bulkCreate(scopes)
  }

  async findAll(
    delegationId: string,
    scopeName: string | null = null,
  ): Promise<DelegationScope[] | null> {
    if (scopeName) {
      return this.delegationScopeModel.findAll({
        where: { delegationId: delegationId, scopeName: scopeName },
      })
    }
    return this.delegationScopeModel.findAll({
      where: { delegationId: delegationId },
    })
  }

  async delete(
    delegationId: string,
    scopeName?: string | null,
  ): Promise<number> {
    if (scopeName) {
      return this.delegationScopeModel.destroy({
        where: { delegationId: delegationId, scopeName: scopeName },
      })
    }

    return this.delegationScopeModel.destroy({
      where: { delegationId: delegationId },
    })
  }
}
