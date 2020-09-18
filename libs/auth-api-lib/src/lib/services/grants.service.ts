import { Grant } from '../entities/models/grants.model'
import { Inject, Injectable } from '@nestjs/common'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Sequelize } from 'sequelize-typescript'
import { InjectModel } from '@nestjs/sequelize'
import { GrantDto } from '../entities/dto/grant-dto'
import { WhereOptions } from 'sequelize/types'

@Injectable()
export class GrantsService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(Grant)
    private grantModel: typeof Grant,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async getAllAsync(subjectId: string, sessionId: string, clientId: string, type: string): Promise<Grant[]> {
    let whereOptions: WhereOptions = {}

    if (subjectId) {
      whereOptions = {...whereOptions, subjectId: subjectId}
    }

    if (sessionId) {
      whereOptions = {...whereOptions, sessionId: sessionId}
    }

    if (clientId) {
      whereOptions = {...whereOptions, clientId: clientId}
    }

    if (type) {
      whereOptions = {...whereOptions, type: type}
    }

    this.logger.debug(`Finding all grants with filter `, whereOptions)

    return await this.grantModel.findAll({
      where: whereOptions,
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

  async removeAllAsync(subjectId: string, sessionId: string, clientId: string, type: string): Promise<number> {
    let whereOptions: WhereOptions = {}

    if (subjectId) {
      whereOptions = {...whereOptions, subjectId: subjectId}
    }

    if (sessionId) {
      whereOptions = {...whereOptions, sessionId: sessionId}
    }

    if (clientId) {
      whereOptions = {...whereOptions, clientId: clientId}
    }

    if (type) {
      whereOptions = {...whereOptions, type: type}
    }

    this.logger.debug(`Removing grants with filter `, whereOptions)

    return await this.grantModel.destroy({
      where: whereOptions,
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

  async createAsync(grant: GrantDto): Promise<Grant> {
    this.logger.debug(`Creating a new grant`)

    return await this.grantModel.create(
      { ...grant }
    )
  }

}
