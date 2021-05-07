import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
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
    return await this.delegationScopeModel.create({ ...delegationScope })
  }

  async createMany(delegationId: string, scopes: string[]): Promise<any> {
    const arr: DelegationScopeDTO[] = []
    for (let i = 0; i < scopes.length; i++) {
      arr.push({ delegationId: delegationId, scopeName: scopes[0] })
    }
    return this.delegationScopeModel.bulkCreate(arr)
  }

  async findAll(
    delegationId: string,
    scopeName: string | null = null,
  ): Promise<DelegationScope[] | null> {
    if (scopeName) {
      const response = await this.delegationScopeModel.findOne({
        where: { delegationId: delegationId, scopeName: scopeName },
      })
      return <DelegationScope[]>[response]
    }
    return await this.delegationScopeModel.findAll({
      where: { delegationId: delegationId },
    })
  }

  async delete(
    delegationId: string,
    scopeName?: string | null,
  ): Promise<number> {
    if (scopeName) {
      return await this.delegationScopeModel.destroy({
        where: { delegationId: delegationId, scopeName: scopeName },
      })
    }

    return await this.delegationScopeModel.destroy({
      where: { delegationId: delegationId },
    })
  }
}
