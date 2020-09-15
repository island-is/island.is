import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Sequelize } from 'sequelize-typescript'
import { GrantType } from './grant-type.model'

@Injectable()
export class GrantTypeService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(GrantType)
    private grantTypeModel: typeof GrantType,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

    async getGrantType(id: string): Promise<GrantType> {
      this.logger.debug(`Finding grant type for id - "${id}"`)

      return await this.grantTypeModel.findOne({
        where: { id: id }
      })
    }
}
