import { Grant } from './grants.model'
import { Inject, Injectable } from '@nestjs/common'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Sequelize } from 'sequelize-typescript'
import { InjectModel } from '@nestjs/sequelize'

@Injectable()
export class GrantsService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(Grant)
    private grantModel: typeof Grant,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async getAllAsync(subjectId: string): Promise<Grant[]> {
    this.logger.debug(`Finding all grants with subjectId - "${subjectId}"`)

    return await this.grantModel.findAll({
      where: {
        subject_id: subjectId,
      },
    })
  }

  async getAsync(key: string): Promise<Grant> {
    this.logger.debug(`Finding grant with key - "${key}"`)

    return await this.grantModel.findOne({
      where: {
        key: key,
      },
    })
  }

  async removeAllAsync(subjectId: string, clientId: string): Promise<number> {
    this.logger.debug(
      `Removing grants with subjectId - "${subjectId}" and clientId - "${clientId}"`,
    )

    return await this.grantModel.destroy({
      where: {
        subject_id: subjectId,
        client_id: clientId,
      },
    })
  }

  async removeAllAsyncV2(
    subjectId: string,
    clientId: string,
    type: string,
  ): Promise<number> {
    this.logger.debug(
      `Removing grants with subjectId - "${subjectId}"    and clientId - "${clientId}"    and type - "${type}"`,
    )

    return await this.grantModel.destroy({
      where: {
        subject_id: subjectId,
        client_id: clientId,
        type: type,
      },
    })
  }

  async removeAsync(key: string): Promise<number> {
    this.logger.debug(`Removing grants with key - "${key}"`)

    return await this.grantModel.destroy({
      where: {
        key: key,
      },
    })
  }

  async storeAsync(grant: Grant): Promise<Grant> {
    this.logger.debug(`Creating a new grant`)

    return await this.grantModel.create(grant)
  }
}
